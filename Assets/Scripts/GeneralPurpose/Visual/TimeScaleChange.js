#pragma strict

static var speed:boolean;

function Start () {
	speed = false;
}

function Update () {
	if(speed && GameObject.FindGameObjectWithTag("Transition") == null)
	{
		Time.timeScale = 4;
		AudioListener.volume = .25;
	}
	else
	{
		Time.timeScale = 1;
		AudioListener.volume = 1;
	}
	if(Input.GetKeyDown("f"))
	{
		speed = true;
	}
	if(Input.GetKeyUp("f"))
	{
		speed = false;
	}
}

function Clicked () {
	speed = true;
}

function Unclicked () {
	speed = false;
}

function OnDestroy () {
	speed = false;
	Time.timeScale = 1;
	AudioListener.volume = 1;
}