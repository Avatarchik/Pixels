using UnityEngine;
using System.Collections;
using System.Runtime.InteropServices;

public class InitialCOMScoreCall : MonoBehaviour {
	#if UNITY_IPHONE
	[DllImport ("__Internal")]
	static private extern void _trackState (string appState, string jsonDict);
	
	[DllImport ("__Internal")]
	static private extern void _trackAction (string eventName, string jsonDict);
	#endif

	// Use this for initialization
	void Start () {
		#if UNITY_IPHONE
		var contextData = new JSONObject(JSONObject.Type.OBJECT);
		contextData.AddField( "State", "launched" );
		if(!Application.isEditor)
		{
			_trackAction("OpenApp", contextData.Print(false));
		}
		#endif
		
		#if UNITY_ANDROID
		var contextData = new JSONObject(JSONObject.Type.OBJECT);
		contextData.AddField( "section", "game:level 1" );
		contextData.AddField( "page", "home" );
		
		using (AndroidJavaClass jc = new AndroidJavaClass("com.turner.analyticsplugin.UnityAnalyticsHelper")) {
			jc.CallStatic("TrackAction", "Explosion", contextData.Print(false));
		}
		#endif
	}
	// Update is called once per frame
	void Update () {
	
	}
}
