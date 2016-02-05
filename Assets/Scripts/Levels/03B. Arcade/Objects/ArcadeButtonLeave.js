﻿#pragma strict

var manager:ArcadeManager;
var transition:GameObject;
@HideInInspector var done:boolean;

function Start () {
	done = false;
}

function Update () {

}

function Clicked () {
	if(manager.currentState == ArcadeState.Selecting)
	{
		manager.currentState = ArcadeState.Leaving;
		if(transition != null && !done)
		{
			AudioManager.PlaySoundTransition(Master.currentWorld.audio.transitionOut);
			Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
			done = true;
		}
		yield WaitForSeconds(.7);
		AudioManager.StopSong();
		yield WaitForSeconds(.5);
		Application.LoadLevel("WorldSelect");
		yield WaitForSeconds(2);
	}
}