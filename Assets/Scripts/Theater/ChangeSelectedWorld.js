#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var ledgerController:LedgerController;

var amount:int;

function Start () {
	ledgerController = GameObject.FindGameObjectWithTag("LedgerController").GetComponent(LedgerController);
}

function Clicked () {
	if(!ledgerController.videoPlaying)
	{
		if(ledgerController.songPlaying)
		{
			LedgerController.songPlaying = false;
			AudioManager.StopAll(0);
			GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterController).PlayAudio();
		}
		ledgerController.currentState = LedgerState.Worlds;
		ledgerController.ChangeSelection(amount);
	}
}