﻿#pragma strict

var replay:boolean;

function Start () {

}

function Clicked () {
	if(!ResultsScreen.notifying)
	{
		GameManager.replay = replay;
		transform.parent.SendMessage("Clicked",SendMessageOptions.DontRequireReceiver);
	}
}