﻿#pragma strict

// Audio
var transitionToWorld:AudioClip;

var transition:GameObject;
var done:boolean;

function Awake () {
	if(PlayerPrefs.GetInt("ActOneFinished") != 1)
	{
		Destroy(gameObject);
	}
}

function Start () {
	DontDestroyOnLoad(gameObject);
	done = false;
}

function Clicked () {
	if(transition != null && !done && TitleManager.currentState == TitleStatus.Home && !Master.notifying)
	{
		TitleManager.currentState = TitleStatus.Leaving;
		AudioManager.PlaySoundTransition(transitionToWorld);
		Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
		done = true;
		yield WaitForSeconds(.7);
		AudioManager.StopSong();
		yield WaitForSeconds(1);
		Master.initialLoad = false;
		Application.LoadLevel("Credits");
		yield WaitForSeconds(2);
	}
}