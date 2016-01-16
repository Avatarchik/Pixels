#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var hasMoved:boolean;
@HideInInspector var distance:float;

function Start () {
	hasMoved = false;
	distance = .5;
}

function Update () {
	if(CreditsManager.move && !hasMoved)
	{
		transform.position.x -= distance;
		hasMoved = true;
	}
	else if (!CreditsManager.move && hasMoved)
	{
		transform.position.x += distance;
		hasMoved = false;
	}
}