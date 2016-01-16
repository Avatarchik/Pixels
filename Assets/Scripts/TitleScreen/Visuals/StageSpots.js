#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var sprite:SpriteRenderer;

@HideInInspector var on:boolean;
@HideInInspector var goal:float;
@HideInInspector var numberToSubtract:float;
@HideInInspector var currentBrightness:float;

var particles:ParticleSystem;

function Start () {
	sprite = GetComponent(SpriteRenderer);
	sprite.color.a = 0;
	on = false;
	goal = 0;
	currentBrightness = 0;
	StageSpots();
	RandomSubtraction();
}

function Update () {
	particles.startColor.a = currentBrightness - .6;
	if(on)
	{
		goal = Mathf.Abs(Mathf.Sin(Time.time * .3))/2 + .5;
	}
	else
	{
		goal = 0;
	}
	currentBrightness = Mathf.MoveTowards(currentBrightness,goal,Time.deltaTime*2);
	sprite.color.a = Mathf.Lerp(sprite.color.a,currentBrightness - numberToSubtract,Time.deltaTime * 15);
}

function StageSpots () {
	while(AudioManager.GetLocation() < 2.2 || TitleManager.currentState == TitleStatus.Intro)
	{
		yield;
	}
	while(true)
	{
		on = true;
		yield WaitForSeconds(Random.Range(10.5,15.5));
		on = false;
		yield WaitForSeconds(Random.Range(10.5,25.5));
	}
}

function RandomSubtraction () {
	while(true)
	{
		yield WaitForSeconds(Random.Range(.07,.12));
		numberToSubtract = Random.Range(0,0.1);
	}
}