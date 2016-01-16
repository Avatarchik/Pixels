#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var effect:SpriteRenderer;

var smokeSprites:Sprite[];

function Start () {
	effect = GetComponent(SpriteRenderer);
	effect.sprite = null;
	StartCoroutine(SmokeStackCycle());
}

function SmokeStackCycle () {
	while(true)
	{
		yield WaitForSeconds(Random.Range(3,17.5));
		Puff();
		yield;
	}
	yield;
}

function Puff () {
	var waitTime:float = .1;
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[0];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[1];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[2];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[3];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[4];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[5];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[6];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[7];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[8];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[9];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[10];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[11];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[12];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[13];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[14];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[15];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[16];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[17];
	yield WaitForSeconds(waitTime);
	effect.sprite = smokeSprites[18];
	yield WaitForSeconds(waitTime);
	effect.sprite = null;
	yield;
}