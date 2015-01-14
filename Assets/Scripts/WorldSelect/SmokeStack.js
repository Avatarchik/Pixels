#pragma strict

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
	yield WaitForSeconds(.3);
	effect.sprite = smokeSprites[0];
	yield WaitForSeconds(.3);
	effect.sprite = smokeSprites[1];
	yield WaitForSeconds(.3);
	effect.sprite = smokeSprites[2];
	yield WaitForSeconds(.3);
	effect.sprite = smokeSprites[3];
	yield WaitForSeconds(.3);
	effect.sprite = smokeSprites[4];
	yield WaitForSeconds(.3);
	effect.sprite = smokeSprites[5];
	yield WaitForSeconds(.3);
	effect.sprite = smokeSprites[6];
	yield WaitForSeconds(.3);
	effect.sprite = smokeSprites[7];
	yield WaitForSeconds(.3);
	effect.sprite = smokeSprites[8];
	yield WaitForSeconds(.3);
	effect.sprite = smokeSprites[9];
	yield WaitForSeconds(.3);
	effect.sprite = null;
	yield;
}