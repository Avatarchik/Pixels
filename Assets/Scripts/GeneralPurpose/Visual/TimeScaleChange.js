#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

static var speed:boolean;

@HideInInspector var slowOverride:boolean;

function Start () {
	speed = false;
	slowOverride = false;
}

function Update () {
	if(slowOverride)
	{
		Time.timeScale = .6;
		AudioListener.volume = 1;
	}
	else
	{
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
	}
	if(Input.GetKeyDown("f"))
	{
		speed = true;
	}
	if(Input.GetKeyUp("f"))
	{
		speed = false;
	}
	
	if(Input.GetKeyDown("q"))
	{
		slowOverride = true;
	}
	if(Input.GetKeyUp("q"))
	{
		slowOverride = false;
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