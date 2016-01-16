#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

function Start () {

}

function Update () {
	GetComponent(PlayerManager).speed = .4;
	if(Input.GetKey("up"))
	{
		GetComponent(PlayerManager).currentState = PlayerState.WalkingBack;
	}
	if(Input.GetKeyUp("up"))
	{
		GetComponent(PlayerManager).currentState = PlayerState.StandingBack;
	}
	if(Input.GetKey("down"))
	{
		GetComponent(PlayerManager).currentState = PlayerState.WalkingFront;
	}
	if(Input.GetKeyUp("down"))
	{
		GetComponent(PlayerManager).currentState = PlayerState.StandingFront;
	}
}