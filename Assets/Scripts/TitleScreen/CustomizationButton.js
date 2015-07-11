#pragma strict

var part:boolean;

var bodyPart:String;
var change:int;

var color:int;

//var players:GameObject[];
var manager:PlayerManager[];

function Start () {
	FindPlayers();
}

function Clicked () {
	FindPlayers();
	TitleManager.currentState = TitleStatus.CustomizeNoColor;
	if(part)
	{
		manager[0].ChangePart(bodyPart,change);
		for(var i:int = 0; i < GameObject.FindGameObjectsWithTag("Player").length; i++)
		{
			//manager[i].Refresh(bodyPart);
		}
	}
	else
	{
		manager[0].ChangeColor(bodyPart,color);
		for(i = 0; i < GameObject.FindGameObjectsWithTag("Player").length; i++)
		{
			//manager[i].Refresh(bodyPart);
		}
	}
}

function FindPlayers () {
	manager = new PlayerManager[GameObject.FindGameObjectsWithTag("Player").length];
	for(var i:int = 0; i < GameObject.FindGameObjectsWithTag("Player").length; i++)
	{
		manager[i] = GameObject.FindGameObjectsWithTag("Player")[i].GetComponent(PlayerManager);
	}
}