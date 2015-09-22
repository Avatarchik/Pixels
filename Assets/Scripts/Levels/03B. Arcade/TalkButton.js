#pragma strict

var talkSounds:AudioClip[];

function Start () {

}

function Update () {

}

function Clicked () {
	AudioManager.PlaySound(talkSounds[Random.Range(0,talkSounds.length)]);
}