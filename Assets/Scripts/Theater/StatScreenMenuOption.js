#pragma strict

var type:LedgerState;

function Start () {
	
}

function Update () {
}

function Clicked () {
	if(LedgerController.songPlaying)
	{
		LedgerController.songPlaying = false;
		AudioManager.StopAll();
		GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterController).PlayAudio();
	}
	if(!LedgerController.videoPlaying)
	{
		GameObject.FindGameObjectWithTag("LedgerController").GetComponent(LedgerController).ReplaceCover(type);
	}
}