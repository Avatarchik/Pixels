﻿#pragma strict

var transition:GameObject;
var done:boolean;
var controller:Master;

function Start () {
	done = false;
}
function Clicked () {
	if(WorldMapManager.currentState == MapStatus.Confirmation)
	{
		Load();
	}
}

function Load () {
	if(transition != null && !done)
	{
		Master.showWorldTitle = true;
		controller = Camera.main.GetComponent(Master);
		AudioManager.PlaySoundTransition(controller.currentWorld.audio.transitionIn);
		Instantiate(transition, Vector3(0,0,-9.5), Quaternion.identity);
		done = true;
	}
	yield WaitForSeconds(.7);
	AudioManager.StopSong();
	yield WaitForSeconds(1);
	switch(controller.currentWorld.basic.world)
	{
		case WorldSelect.Theater:
			Application.LoadLevel("Theater");
			break;
		case WorldSelect.Arcade:
			Application.LoadLevel("Arcade");
			break;
		case WorldSelect.UnlockWheel:
			Application.LoadLevel("UnlockWheel");
			break;
		case WorldSelect.Remix:
			Application.LoadLevel("VRMachine");
			break;
		default:
			Application.LoadLevel("MicroGameLauncher");
			break;
	}
}