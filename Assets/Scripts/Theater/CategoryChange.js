#pragma strict

var changeAmount:int;

var customizeManager:GameObject;

function Clicked () {
	
	GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterCustomizeManager).PieceChange(changeAmount);
}