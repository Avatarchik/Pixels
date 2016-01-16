#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var words:boolean;
var sprites:boolean;

var sprite:Sprite[];

function Start () {
	words = false;
	sprites = false;
	if(gameObject.GetComponent(TextMesh) != null)
	{
		words = true;
	}
	if(gameObject.GetComponent(SpriteRenderer) != null)
	{
		sprites = true;
	}
}

function GameNumberChange (gameNumber:int) {
	if(sprites)
	{
		gameObject.GetComponent(SpriteRenderer).sprite = sprite[gameNumber-1];
	}
	if(words)
	{
		gameObject.GetComponent(TextMesh).text = gameNumber.ToString();
	}
}