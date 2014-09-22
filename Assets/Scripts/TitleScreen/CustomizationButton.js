#pragma strict

var part:boolean;

var bodyPart:String;
var change:int;

var color:int;

var manager:PlayerManager;

function Start () {
	manager = GameObject.FindGameObjectWithTag("Player").GetComponent(PlayerManager);
}

function Clicked () {
	TitleManager.currentState = TitleStatus.CustomizeNoColor;
	if(part)
	{
		manager.ChangePart(bodyPart,change);
	}
	else
	{
		manager.ChangeColor(bodyPart,color);
	}
}