#pragma strict

var on:Sprite;
var off:Sprite;

function Update () {
	if(GameManager.pausable)
	{
		GetComponent(SpriteRenderer).sprite = on;
	}
	else
	{
		GetComponent(SpriteRenderer).sprite = off;
	}
}