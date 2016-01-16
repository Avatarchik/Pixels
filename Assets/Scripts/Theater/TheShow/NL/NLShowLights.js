#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var sprite:SpriteRenderer;
var lights:Sprite[];

function Start () {
	sprite = GetComponent(SpriteRenderer);
}

function Update () {
}
function StartEvent (which:int) {
	if(Master.allowShow)
	{
		sprite.color.a = 1;
	}
	if(lights.Length > which)
	{
		sprite.sprite = lights[which];
	}
}