#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var destination:Vector3;
var speed:float;
var jump:boolean;

function Start () {
	
}

function Update () {
	
}

function StartEvent (whichEvent:int) {
	while(transform.localPosition != destination)
	{
		transform.localPosition = Vector3.MoveTowards(transform.localPosition, destination,Time.deltaTime * speed);
		yield;
	}	
}