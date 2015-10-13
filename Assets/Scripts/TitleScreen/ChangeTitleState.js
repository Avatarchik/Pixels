#pragma strict

var newState:TitleStatus;
var player:GameObject;
@HideInInspector var manager:PlayerManager;

function Clicked () {
	if(TitleManager.currentState != TitleStatus.Intro && !Master.notifying)
	{
		if(player != null)
		{
			manager = player.GetComponent(PlayerManager);
			manager.Save();
		}
		TitleManager.currentState = TitleStatus.CustomizeNoColor;
		TitleManager.currentState = newState;
	}
}