#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var waitTime:float;
var song:AudioClip;
var speaker:AudioSource;
var text:GameObject;

function Start () {
	//Application.targetFrameRate = 60;
	StartCoroutine(Stuff());
}

function Update () {
}

function Stuff () {
	yield WaitForSeconds(waitTime);
	Instantiate(text);
	yield;
}