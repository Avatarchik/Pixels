#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var effectObject:GameObject;
@HideInInspector var effect:SpriteRenderer;
@HideInInspector var sprite:SpriteRenderer;

@HideInInspector var effectChoice:int;

var sleepingSprites:Sprite[];
var smokingSprites:Sprite[];
var puffSprites:Sprite[];
var zSprites:Sprite[];

function Start () {
	effect = effectObject.GetComponent(SpriteRenderer);
	sprite = GetComponent(SpriteRenderer);
	effectChoice = Random.Range(0,2);
	effect.sprite = null;
	if(effectChoice == 0)
	{
		sprite.sprite = smokingSprites[0];
		StartCoroutine(Smoke());
	}
	if(effectChoice == 1)
	{
		sprite.sprite = sleepingSprites[0];
		StartCoroutine(Zs());
		StartCoroutine(Sleep());
	}
}

function Smoke () {
	while(true)
	{
		sprite.sprite = smokingSprites[0];
		yield WaitForSeconds(Random.Range(4,8));
		sprite.sprite = smokingSprites[1];
		StartCoroutine(Puff());
		yield WaitForSeconds(Random.Range(4,6));
	}
	yield;
}

function Sleep () {
	while(true)
	{
		sprite.sprite = sleepingSprites[0];
		yield WaitForSeconds(3);
		sprite.sprite = sleepingSprites[1];
		yield WaitForSeconds(3);
	}
	yield;
}

function Puff () {
	yield WaitForSeconds(.4);
	effect.sprite = puffSprites[0];
	yield WaitForSeconds(.3);
	effect.sprite = puffSprites[1];
	yield WaitForSeconds(.3);
	effect.sprite = puffSprites[2];
	yield WaitForSeconds(.3);
	effect.sprite = puffSprites[3];
	yield WaitForSeconds(.3);
	effect.sprite = puffSprites[4];
	yield WaitForSeconds(.3);
	effect.sprite = puffSprites[5];
	yield WaitForSeconds(.3);
	effect.sprite = puffSprites[6];
	yield WaitForSeconds(.3);
	effect.sprite = null;
	yield;
}

function Zs () {
	while(true)
	{
		yield WaitForSeconds(1.3);
		effect.sprite = zSprites[0];
		yield WaitForSeconds(1.3);
		effect.sprite = zSprites[1];
	}
	yield;
}