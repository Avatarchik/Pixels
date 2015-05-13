#pragma strict

function Start () {
	
}

function Clicked () {
	AudioManager.StopAll();
	Application.LoadLevel("TutorialTitleScreen");
}