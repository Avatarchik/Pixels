#pragma strict

var manager:PlayerManager[];

var colorSelection:int;
var bodyPart:String;

function Start () {
	FindPlayers();
}

function Clicked () {
	FindPlayers();
	manager[0].ChangeColor(bodyPart,colorSelection);
	for(var i:int = 0; i < GameObject.FindGameObjectsWithTag("Player").length; i++)
	{
		manager[i].RefreshColor(bodyPart);
	}
}

function FindPlayers () {
	manager = new PlayerManager[GameObject.FindGameObjectsWithTag("Player").length];
	for(var i:int = 0; i < GameObject.FindGameObjectsWithTag("Player").length; i++)
	{
		manager[i] = GameObject.FindGameObjectsWithTag("Player")[i].GetComponent(PlayerManager);
	}
}