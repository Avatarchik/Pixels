Shader "Custom/SepiaForJames"
{
	Properties
	{
		[PerRendererData] _MainTex ("Sprite Texture", 2D) = "white" {}
		_Color ("Tint", Color) = (1,1,1,1)
		[MaterialToggle] PixelSnap ("Pixel snap", Float) = 0
		_Hue ("Hue", Float) = 1.0
		_Saturation ("Saturation", Float) = 1.0

	}

	SubShader
	{
		Tags
		{ 
			"Queue"="Transparent" 
			"IgnoreProjector"="True" 
			"RenderType"="Transparent" 
			"PreviewType"="Plane"
			"CanUseSpriteAtlas"="True"
		}

		Cull Off
		Lighting Off
		ZWrite Off
		Blend One OneMinusSrcAlpha

		Pass
		{
		CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma multi_compile _ PIXELSNAP_ON
			#include "UnityCG.cginc"
			
			struct appdata_t
			{
				float4 vertex   : POSITION;
				float4 color    : COLOR;
				float2 texcoord : TEXCOORD0;
			};

			struct v2f
			{
				float4 vertex   : SV_POSITION;
				fixed4 color    : COLOR;
				half2 texcoord  : TEXCOORD0;
			};
			
			fixed4 _Color;
			float _Hue;
			float _Saturation;

			fixed3 RGBtoHCV(in float3 RGB)
			{
				// Based on work by Sam Hocevar and Emil Persson
				fixed4 P = (RGB.g < RGB.b) ? fixed4(RGB.bg, -1.0, 2.0/3.0) : fixed4(RGB.gb, 0.0, -1.0/3.0);
				fixed4 Q = (RGB.r < P.x) ? fixed4(P.xyw, RGB.r) : fixed4(RGB.r, P.yzx);
				float C = Q.x - min(Q.w, Q.y);
				float H = abs((Q.w - Q.y) / (6 * C + 1e-10) + Q.z);
				return fixed3(H, C, Q.x);
			}

			//this function converts RGB colors to HSV
			fixed3 RGBtoHSV(in float3 RGB)
			{
				fixed3 HCV = RGBtoHCV(RGB);
				float S = HCV.y / (HCV.z + 1e-10);
				return fixed3(HCV.x, S, HCV.z);
			}

			fixed3 Hue(float H)
			{
			    float R = abs(H * 6 - 3) - 1;
			    float G = 2 - abs(H * 6 - 2);
			    float B = 2 - abs(H * 6 - 4);
			    return saturate(float3(R,G,B));
			}

			//this function converts HSV back to RGB
			fixed3 HSVtoRGB(in float3 HSV)
			{
				 return fixed3(((Hue(HSV.x) - 1) * HSV.y + 1) * HSV.z);
			}

			v2f vert(appdata_t IN)
			{
				v2f OUT;
				OUT.vertex = mul(UNITY_MATRIX_MVP, IN.vertex);
				OUT.texcoord = IN.texcoord;
				OUT.color = IN.color * _Color;
				#ifdef PIXELSNAP_ON
				OUT.vertex = UnityPixelSnap (OUT.vertex);
				#endif

				return OUT;
			}

			sampler2D _MainTex;

			//all the important stuff goes here
			fixed4 frag(v2f IN) : SV_Target
			{
				//sample the texture and multiply it by the tint color
				fixed4 c = tex2D(_MainTex, IN.texcoord) * IN.color;

				//convert it to HSV
				fixed3 hsv = RGBtoHSV(c.rgb);
				
				//do sepia effect by modifying hue and saturation
				hsv.g *= _Saturation; //modify existing saturation
				hsv.r = _Hue; //set hue (this is what makes it look sepia)

				//convert back to RGB
				c.rgb = HSVtoRGB(hsv);

				//multiply rgb by alpha to avoid white fringes on PNG textures
				c.rgb *= c.a;

				//poop out the color
				return c;
			}
		ENDCG
		}
	}
}
