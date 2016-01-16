#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var mouth:SpriteRenderer;
var frownSprites:Sprite[];
var smileSprites:Sprite[];
var characterSprites:Sprite[];

@HideInInspector var frown:boolean;
var latestValue:int;

function Start () {

}

function Update () {

}

function SpriteType () {
	
}

function SetSongSprite (spriteNumber:int) {
	latestValue = spriteNumber;
	if(mouth != null)
	{
		if(frown)
		{
			mouth.sprite = frownSprites[spriteNumber];
		}
		else
		{
			mouth.sprite = smileSprites[spriteNumber];
		}
	}
}
function Frown (newValue:boolean) {
	frown = newValue;
	if(mouth != null)
	{
		if(frown)
		{
			mouth.sprite = frownSprites[latestValue];
		}
		else
		{
			mouth.sprite = smileSprites[latestValue];
		}
	}
}

function SpriteChange (data:int) {
	GetComponent(SpriteRenderer).sprite = characterSprites[data];
}