#pragma strict

var playerParent:GameObject;
@HideInInspector var player:GameObject;

var manager:PlayerManager;

function Start () {
	player = playerParent.Find("Player").gameObject;
	manager = player.GetComponent(PlayerManager);
}
function Clicked () {
	TitleManager.currentState = TitleStatus.CustomizeNoColor;
	manager.Revert();
}