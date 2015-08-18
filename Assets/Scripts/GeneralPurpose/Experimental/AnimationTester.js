#pragma strict

function Start () {

}

function Update () {
	GetComponent(PlayerManager).speed = .4;
	if(Input.GetKey("left"))
	{
		GetComponent(PlayerManager).currentState = PlayerState.WalkingLeft;
	}
	if(Input.GetKeyUp("left"))
	{
		GetComponent(PlayerManager).currentState = PlayerState.StandingLeft;
	}
	if(Input.GetKey("right"))
	{
		GetComponent(PlayerManager).currentState = PlayerState.WalkingRight;
	}
	if(Input.GetKeyUp("right"))
	{
		GetComponent(PlayerManager).currentState = PlayerState.StandingRight;
	}
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