#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var currentBrightness:float;

function Start () {
	Randomize();
}

function Update () {
	if(GetComponent(SpriteRenderer) != null)
	{
		GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,currentBrightness,Time.deltaTime*.3);
	}
}

function Randomize () {
	while(true)
	{
		currentBrightness = Random.Range(.8,1);
		yield WaitForSeconds(Random.Range(.2,1));
	}
}