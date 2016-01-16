#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var flickerSpeed:float;
var newBrightness:float;
var lightSprite:SpriteRenderer;

function Start () {
	flickerSpeed = Random.Range(.05,.25);
	newBrightness = Random.Range(.5,1);
	lightSprite = GetComponent(SpriteRenderer);
	if(lightSprite != null)
	{
		StartCoroutine(FlickerSprite());
	}
}

function FlickerSprite () {
	while(true)
		{
			lightSprite.color.a = newBrightness;
			newBrightness = Random.Range(.4,1);
			flickerSpeed = Random.Range(.03,.1);
			yield WaitForSeconds(flickerSpeed);
			
			lightSprite.color.a = newBrightness;
			newBrightness = Random.Range(.75,1);
			flickerSpeed = Random.Range(.01,.05);
			yield WaitForSeconds(flickerSpeed);
			yield;
		}
}