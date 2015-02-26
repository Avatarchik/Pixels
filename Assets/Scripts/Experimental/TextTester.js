#pragma strict

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
	speaker.PlayOneShot(song);
	yield WaitForSeconds(waitTime);
	Instantiate(text);
	yield;
}