#pragma strict

function Start () {
	GetComponent(TextMesh).color.a = 0;
	Opening();
}

function Update () {
	
}

function Opening () {
	while(AudioManager.GetLocation() < 2.2 || TitleManager.currentState == TitleStatus.Intro)
	{
		yield;
	}
	GetComponent(TextMesh).color.a = 1;
}	