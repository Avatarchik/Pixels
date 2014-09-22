#pragma strict

var player:GameObject;
var manager:PlayerManager;

function Start () {
	manager = player.GetComponent(PlayerManager);
}
function Clicked () {
	TitleManager.currentState = TitleStatus.CustomizeNoColor;
	manager.Revert();
}