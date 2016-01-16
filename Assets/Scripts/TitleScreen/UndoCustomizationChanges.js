#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var playerParent:GameObject;
@HideInInspector var player:GameObject;

var manager:PlayerManager;

function Start () {
	Initial();
}

function Initial() {
	yield WaitForEndOfFrame();
	for(var peter:GameObject in GameObject.FindGameObjectsWithTag("Player"))
	{
		if(peter.transform.GetComponent(PlayerWalking) == null)
		{
			player = peter;
		}
	}
	manager = player.GetComponent(PlayerManager);
}
function Clicked () {
	TitleManager.currentState = TitleStatus.CustomizeNoColor;
	manager.Revert();
}