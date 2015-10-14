#pragma strict

var frontOfHousePlayer:boolean;

function Start () {

}

function Update () {
	if(TheaterController.currentState == TheaterStatus.Home) 
	{
		if(frontOfHousePlayer)
		{
			if(transform.localPosition.x != 52)
			{
				GetComponent(PlayerManager).currentState = PlayerState.WalkingFront;
				GetComponent(AnimationManager).flipped = 1;
				transform.localPosition.x = Mathf.MoveTowards(transform.localPosition.x,52,Time.deltaTime * 5);
			}
			else
			{
				GetComponent(PlayerManager).currentState = PlayerState.StandingFront;
				GetComponent(AnimationManager).flipped = 1;
			}
		}
		else
		{
			if(transform.localPosition.x != 3.579)
			{
				GetComponent(PlayerManager).currentState = PlayerState.WalkingFront;
				GetComponent(AnimationManager).flipped = -1;
				transform.localPosition.x = Mathf.MoveTowards(transform.localPosition.x,3.579,Time.deltaTime * 5);
			}
			else
			{
				GetComponent(PlayerManager).currentState = PlayerState.StandingFront;
				GetComponent(AnimationManager).flipped = 1;
			}
		}
	}
	else
	{
		if(frontOfHousePlayer)
		{
			if(transform.localPosition.x != 37)
			{
				GetComponent(PlayerManager).currentState = PlayerState.WalkingFront;
				GetComponent(AnimationManager).flipped = -1;
				transform.localPosition.x = Mathf.MoveTowards(transform.localPosition.x,37,Time.deltaTime * 5);
			}
			else
			{
				GetComponent(PlayerManager).currentState = PlayerState.StandingFront;
				GetComponent(AnimationManager).flipped = 1;
			}
		}
		else
		{
			if(transform.localPosition.x != 13)
			{
				GetComponent(PlayerManager).currentState = PlayerState.WalkingFront;
				GetComponent(AnimationManager).flipped = 1;
				transform.localPosition.x = Mathf.MoveTowards(transform.localPosition.x,13.5,Time.deltaTime * 5);
			}
			else
			{
				GetComponent(PlayerManager).currentState = PlayerState.StandingFront;
				GetComponent(AnimationManager).flipped = 1;
			}
		}
	}
}