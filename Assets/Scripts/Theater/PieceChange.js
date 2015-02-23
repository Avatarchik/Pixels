#pragma strict

private var manager:TheaterManager;
private var theaterPart:String;
var change:int;

function Start () {
	manager = GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterManager);
}

function Update () {
	theaterPart = TheaterCustomizeManager.pieceName;
}

function Clicked () {
	manager.ChangePart(theaterPart,change);
}