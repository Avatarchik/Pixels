#pragma strict

var manager:ArcadeManager;
var transition:GameObject;
@HideInInspector var done:boolean;
var transitionToWorld:AudioClip;

function Start () {
	done = false;
}

function Update () {

}

function Clicked () {
	manager.currentState = ArcadeState.Leaving;
	if(transition != null && !done)
	{
		AudioManager.PlaySoundTransition(transitionToWorld);
		Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
		done = true;
	}
	yield WaitForSeconds(.7);
	AudioManager.StopSong();
	yield WaitForSeconds(1);
	Application.LoadLevel("WorldSelect");
	yield WaitForSeconds(2);
}