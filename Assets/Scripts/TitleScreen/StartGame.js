#pragma strict

// Audio
var transitionToWorld:AudioClip;

var transition:GameObject;
var done:boolean;

function Start () {
	DontDestroyOnLoad(gameObject);
	done = false;
}

function Clicked () {
	if(transition != null && !done && TitleManager.currentState == TitleStatus.Home)
	{
		TitleManager.currentState = TitleStatus.Leaving;
		AudioManager.PlaySoundTransition(transitionToWorld);
		Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
		done = true;
		yield WaitForSeconds(.7);
		AudioManager.StopSong();
		yield WaitForSeconds(1);
		Master.initialLoad = false;
		Application.LoadLevel("WorldSelect");
		yield WaitForSeconds(2);
	}
}