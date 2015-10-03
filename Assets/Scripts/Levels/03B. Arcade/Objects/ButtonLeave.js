#pragma strict

var manager:ArcadeManager;
var transition:GameObject;
@HideInInspector var done:boolean;

function Start () {
	done = false;
}

function Update () {

}

function Clicked () {
	manager.currentState = ArcadeState.Leaving;
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