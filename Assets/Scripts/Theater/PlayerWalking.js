#pragma strict

var frontOfHousePlayer:boolean;

function Start () {

}

function Update () {
	if(TheaterController.currentState == TheaterStatus.Home || TheaterController.currentState == TheaterStatus.HomeLedger) 
	{
		if(frontOfHousePlayer)
		{
			GetComponent(PlayerManager).speed = .2;
			if(transform.localPosition.x != 52)
			{
				GetComponent(PlayerManager).currentState = PlayerState.WalkingRight;
				transform.localPosition.x = Mathf.MoveTowards(transform.localPosition.x,52,Time.deltaTime * 5);
			}
			else
			{
				GetComponent(PlayerManager).currentState = PlayerState.StandingFront;
			}
		}
		else
		{
			GetComponent(PlayerManager).speed = .2;
			if(transform.localPosition.x != 3.579)
			{
				GetComponent(PlayerManager).currentState = PlayerState.WalkingLeft;
				transform.localPosition.x = Mathf.MoveTowards(transform.localPosition.x,3.579,Time.deltaTime * 5);
			}
			else
			{
				GetComponent(PlayerManager).currentState = PlayerState.StandingFront;
			}
		}
	}
	else
	{
		if(frontOfHousePlayer)
		{
			GetComponent(PlayerManager).speed = .2;
			if(transform.localPosition.x != 37)
			{
				GetComponent(PlayerManager).currentState = PlayerState.WalkingLeft;
				transform.localPosition.x = Mathf.MoveTowards(transform.localPosition.x,37,Time.deltaTime * 5);
			}
			else
			{
				GetComponent(PlayerManager).currentState = PlayerState.StandingFront;
			}
		}
		else
		{
			GetComponent(PlayerManager).speed = .2;
			if(transform.localPosition.x != 13)
			{
				GetComponent(PlayerManager).currentState = PlayerState.WalkingRight;
				transform.localPosition.x = Mathf.MoveTowards(transform.localPosition.x,13.5,Time.deltaTime * 5);
			}
			else
			{
				GetComponent(PlayerManager).currentState = PlayerState.StandingFront;
			}
		}
	}
}