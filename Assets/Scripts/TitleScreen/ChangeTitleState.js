#pragma strict

var newState:TitleStatus;
var player:GameObject;
var manager:PlayerManager;

function Clicked () {
	if(player != null)
	{
		manager = player.GetComponent(PlayerManager);
		manager.Save();
	}
	TitleManager.currentState = TitleStatus.CustomizeNoColor;
	TitleManager.currentState = newState;
}