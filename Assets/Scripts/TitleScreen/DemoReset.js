#pragma strict

function Start () {
	
}

function Clicked () {
	AudioManager.StopAll(0);
	Application.LoadLevel("TutorialTitleScreen");
}