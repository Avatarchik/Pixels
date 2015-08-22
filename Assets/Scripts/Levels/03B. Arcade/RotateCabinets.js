#pragma strict

var arcadeManager:ArcadeManager;

var change:int;

function Start () {

}

function Clicked () {
	if(arcadeManager.currentState == ArcadeState.Selecting)
	{
		arcadeManager.Scroll(change);
	}
}