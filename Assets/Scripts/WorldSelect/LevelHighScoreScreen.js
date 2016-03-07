#pragma strict

@HideInInspector var global:boolean;

@HideInInspector var leaderBoardName:String;

@HideInInspector var bigSize:float;
@HideInInspector var normalSize:float;

var gameNameText:TextMesh;

var notConnected:TextMesh;

var loading:GameObject;


function Start () {
	if(Master.hardMode)
	{
		leaderBoardName = Camera.main.GetComponent(Master).currentWorld.basic.worldNameVar + "Hard";
	}
	else
	{
		leaderBoardName = Camera.main.GetComponent(Master).currentWorld.basic.worldNameVar;
	}
	gameNameText.text = Camera.main.GetComponent(Master).currentWorld.basic.worldNameFull;
	if(gameNameText.text.length <= 10)
	{
		gameNameText.characterSize = .4;
		gameNameText.transform.localPosition.y += .05;
	}
	Social.localUser.Authenticate(function(success) {
		if(success)
		{
			FinishStart();
		}
		else
		{
			NotConnected();
		}
	}
	);
}

function NotConnected () {
	notConnected.color.a = 1;
	if(loading != null)
	{
		Destroy(loading);
	}
}

function FinishStart () {
	if(loading != null)
	{
		Destroy(loading);
	}
	UnityEngine.SocialPlatforms.GameCenter.GameCenterPlatform.ShowLeaderboardUI(leaderBoardName, TimeScope.AllTime);
	yield WaitForSeconds(3);
	Destroy(gameObject);
}