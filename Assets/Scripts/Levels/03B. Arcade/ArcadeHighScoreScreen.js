#pragma strict

@HideInInspector var global:boolean;

@HideInInspector var latestScore:float;

@HideInInspector var leaderBoardName:String;

@HideInInspector var clicked:boolean;

var gameNameDisplay:TextMesh;

var notConnected:TextMesh;

var loading:GameObject;

var loadButton:GameObject;


function Start () {	
	loadButton.transform.position.z = 10000;
	Social.ReportScore(ArcadeManager.lastScore,"Arcade"+leaderBoardName,DidItWork);
	leaderBoardName = "Arcade" + ArcadeManager.lastGameVariable;
	gameNameDisplay.text = ArcadeManager.lastGameDisplayName;
	
	latestScore = ArcadeManager.lastScore;
	if(PlayerPrefs.GetFloat(leaderBoardName+"Score") < latestScore)
	{
		PlayerPrefs.SetFloat(leaderBoardName+"Score",latestScore);
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
	Destroy(loading);
	if(loading != null)
	{
		Destroy(loading);
	}
}

function FinishStart () {
	loadButton.transform.position.z = 0;
	if(loading != null)
	{
		Destroy(loading);
	}
	RegularUpdate();
}

function RegularUpdate () {
	while(true)
	{
		if(Finger.GetExists(0) && Finger.GetInGame(0) && !clicked)
		{
			clicked = true;
			UnityEngine.SocialPlatforms.GameCenter.GameCenterPlatform.ShowLeaderboardUI(leaderBoardName, TimeScope.AllTime);
		}
		if(!Finger.GetExists(0))
		{
			clicked = false; 
		}
		yield;
	}
}

function DidItWork (itDid:boolean){
	if(itDid)
	{
		Debug.Log("Score successfully submitted.");
	}
	else
	{
		Debug.Log("Score submission failed.");
	}
}