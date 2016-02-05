#pragma strict

var special:boolean = false;
@HideInInspector var objectColor:Color;

function Start () {
	objectColor = GetComponent(SpriteRenderer).color;
}

function Update () {
	GetComponent(SpriteRenderer).color = Color.Lerp(GetComponent(SpriteRenderer).color,objectColor,Time.deltaTime * 6);
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