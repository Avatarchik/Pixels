#pragma strict

public enum TheaterStatus{Home,Front,Ledger};

static var currentState:TheaterStatus;

private var speed:float;

function Start () {
	currentState = TheaterStatus.Home;
}

function Update () {
	if(Input.GetKeyDown("f"))
	{
		currentState = TheaterStatus.Front;
	}
	if(Input.GetKeyDown("h"))
	{
		currentState = TheaterStatus.Home;
	}
	if(Input.GetKeyDown("l"))
	{
		currentState = TheaterStatus.Ledger;
	}
	speed = Time.deltaTime * 5;
	switch(currentState)
	{
		case TheaterStatus.Home:
			Debug.Log("hey");
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,0),speed/4);
			break;
		case TheaterStatus.Front:
			transform.position = Vector2.MoveTowards(transform.position,Vector2(-32.1,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(-32.1,0),speed/4);
			break;
		case TheaterStatus.Ledger:	
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,29),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,29),speed/4);
			break;
		default:
			break;
	}
}