#pragma strict

var manager:PlayerManager;

var colorSelection:int;
var bodyPart:String;

function Start () {
	manager = GameObject.FindGameObjectWithTag("Player").GetComponent(PlayerManager);
}

function Clicked () {
	manager.ChangeColor(bodyPart,colorSelection);
}