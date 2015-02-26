#pragma strict

private var manager:TheaterManager;
private var theaterPart:String;
var change:int;

function Start () {
	manager = GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterManager);
}

function Update () {
	// Updates which piece will change.
	theaterPart = TheaterCustomizeManager.pieceName;
}

function Clicked () {
	// Changes piece by Change.
	manager.ChangePart(theaterPart,change);
}