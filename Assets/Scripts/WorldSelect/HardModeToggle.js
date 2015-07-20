#pragma strict

var upSprite:Sprite;
var downSprite:Sprite;

function Start () {
	
}

function UpdateVisuals (reset:boolean) {
	if(reset)
	{
		GetComponent(SpriteRenderer).sprite = upSprite;
	}
	if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"End4Played") != 1)
	{
		GetComponent(ButtonSquare).enabled = false;
		GetComponent(SpriteRenderer).color = Color(.7,.7,.7,1);
	}
	else
	{
		GetComponent(ButtonSquare).enabled = true;
		GetComponent(SpriteRenderer).color = Color(1,.35,.35,1);
	}
}

function Clicked () {
	if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"End4Played") == 1)
	{
		if(Master.hardMode)
		{
			Master.hardMode = false;
			GetComponent(SpriteRenderer).sprite = upSprite;
		}
		else
		{
			Master.hardMode = true;
			GetComponent(SpriteRenderer).sprite = downSprite;
		}
	}
}