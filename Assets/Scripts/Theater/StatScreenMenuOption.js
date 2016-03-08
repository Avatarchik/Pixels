#pragma strict

var type:LedgerState;

function Start () {
	if(type == LedgerState.DevRequests && PlayerPrefs.GetInt("SaveSystemAvailable") != 1)
	{
		Destroy(gameObject);
	}
}

function Update () {
}

function Clicked () {
	if(LedgerController.currentState != LedgerState.Closed && LedgerController.currentState != LedgerState.Transition && !Master.notifying)
	{
		if(LedgerController.songPlaying)
		{
			LedgerController.songPlaying = false;
			AudioManager.StopAll(0);
			GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterController).PlayAudio();
		}
		if(!LedgerController.videoPlaying)
		{
			GameObject.FindGameObjectWithTag("LedgerController").GetComponent(LedgerController).ReplaceCover(type);
		}
	}
}