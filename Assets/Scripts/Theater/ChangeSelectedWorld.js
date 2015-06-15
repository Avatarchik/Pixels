﻿#pragma strict

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
			AudioManager.StopAll();
			GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterController).PlayAudio();
		}
		ledgerController.ChangeSelection(amount);
	}
}