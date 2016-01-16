#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

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
		controller = Camera.main.GetComponent(Master);
		AudioManager.PlaySoundTransition(controller.currentWorld.audio.transitionIn);
		Instantiate(transition, Vector3(0,0,-9.5), Quaternion.identity);
		done = true;
	}
	yield WaitForSeconds(.7);
	AudioManager.StopSong();
	yield WaitForSeconds(1);
	if(controller.currentWorld.basic.world == WorldSelect.Theater)
	{
		Application.LoadLevel("Theater");
	}
	else
	{
		Application.LoadLevel("MicroGameLauncher");
	}
}