#pragma strict

private var manager:TheaterManager;
private var theaterPart:String;
var change:int;

var specificChange:boolean;
var specificNumber:int;

function Start () {
	manager = GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterManager);
}

function Update () {
	//Debug.Log(PlayerPrefs.GetInt("StageWallSelection"));
	// Updates which piece will change.
	theaterPart = TheaterCustomizeManager.pieceName;
	if(PlayerPrefs.GetInt(theaterPart+"Selection") == specificNumber)
	{
		GetComponent(SpriteRenderer).sprite = GetComponent(ButtonSquare).down;
	}
	else
	{
		GetComponent(SpriteRenderer).sprite = GetComponent(ButtonSquare).up;
	}
}

function Clicked () {
	if(specificChange)
	{
		Debug.Log("hey");
		manager.ChangePartSpecific(theaterPart,specificNumber);	
	}
	else
	{
		manager.ChangePart(theaterPart,change);
	}
}