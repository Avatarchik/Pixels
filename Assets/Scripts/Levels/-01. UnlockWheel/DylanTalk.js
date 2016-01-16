#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var talkSounds:AudioClip[];

static var talkWait:float;

var mouth:SpriteRenderer;
var mouthClosedSprite:Sprite;
var mouthOpenSprite:Sprite;

var dylan:SpriteRenderer;
var dylanNormal:Sprite;
var dylanBlink:Sprite;

function Awake () {
	talkWait = 0;
	Mouth();
	Blink();
}

function Update () {
	talkWait -= Time.deltaTime;
}

function Clicked () {
	Talk(talkSounds);
}

function Talk (clips:AudioClip[]) {
	if(talkWait <= 0)
	{
		var tempVar:int = Random.Range(0,clips.length);
		AudioManager.PlayCutscene(clips[tempVar]);
		talkWait = clips[tempVar].length;
	}
}

function Mouth () {
	while(true)
	{
		if(talkWait > 0)
		{
			mouth.sprite = mouthOpenSprite;
			yield WaitForSeconds(.1);
			mouth.sprite = mouthClosedSprite;
			yield WaitForSeconds(.1);
		}
		else
		{
			mouth.sprite = mouthClosedSprite;
		}
		yield;
	}
}

function Blink () {
	while(true)
	{
		yield WaitForSeconds(Random.Range(.6,5.4));
		dylan.sprite = dylanBlink;
		yield WaitForSeconds(Random.Range(.15,.9));
		dylan.sprite = dylanNormal;
		yield;
	}
}