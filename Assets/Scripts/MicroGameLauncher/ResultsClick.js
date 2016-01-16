#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var replay:boolean;

function Start () {

}

function Clicked () {
	if(!ResultsScreen.notifying && !Master.notifying)
	{
		GameManager.replay = replay;
		transform.parent.SendMessage("Clicked",SendMessageOptions.DontRequireReceiver);
	}
}