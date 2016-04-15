#pragma strict

var special:boolean = false;
@HideInInspector var objectColor:Color;

var particle:boolean;
var system:ParticleSystem;

function Start () {
	if(!Master.hardMode)
	{
		if(particle)
		{
			
		}
		else
		{
			objectColor = GetComponent(SpriteRenderer).color;
		}
	}
}

function Update () {
	if(!Master.hardMode)
	{
		if(particle)
		{
			
		}
		else
		{
			GetComponent(SpriteRenderer).color = Color.Lerp(GetComponent(SpriteRenderer).color,objectColor,Time.deltaTime * 6);
		}
	}
}

function ChangeBackgroundColor (newColor:Color) {
	if(special)
	{
		objectColor = newColor;
		
	}
	else
	{
		objectColor = newColor;
		objectColor.a = 1;
	}
}