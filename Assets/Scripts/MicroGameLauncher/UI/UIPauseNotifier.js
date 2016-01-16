#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

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