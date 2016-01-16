#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var done:boolean;
var transition:GameObject;

function Start () {
	done = false;
}	

function Update () {

}

function Clicked () {
	if(!RemixManager.leaving)
	{
		RemixManager.leaving = true;
	}
	if(transition != null && !done)
	{
		AudioManager.PlaySoundTransition(Master.currentWorld.audio.transitionOut);
		Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
		done = true;
	}
	yield WaitForSeconds(.7);
	AudioManager.StopSong();
	yield WaitForSeconds(1);
	Application.LoadLevel("WorldSelect");
	yield WaitForSeconds(2);
}