#pragma strict

var desiredState:PlayerState;
var wait:float;
var crossing:boolean;

function Start () {
	if(crossing)
	{
		if(transform.position.x > transform.parent.transform.position.x)
		{
			desiredState = PlayerState.WalkingLeft;
		}
		else
		{
			desiredState = PlayerState.WalkingRight;
		}
	}
}

function Update () {
	GetComponent(PlayerManager).currentState = desiredState;
	GetComponent(PlayerManager).speed = wait;
}