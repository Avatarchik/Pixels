#pragma strict

public enum TheaterStatus{Home,Front,Stats,HomeLedger,FrontLedger};

static var currentState:TheaterStatus;

private var speed:float;

var ledgerRight:GameObject;
var ledgerTop:GameObject;

var controller:Master;

function Start () {
	controller = Camera.main.GetComponent(Master);
	Audio.PlaySongIntro(null,controller.selectedWorldMusic,1);
	currentState = TheaterStatus.Home;
}

function Update () {
	if(Input.GetKeyDown("1"))
	{
		currentState = TheaterStatus.Front;
	}
	if(Input.GetKeyDown("2"))
	{
		currentState = TheaterStatus.Home;
	}
	if(Input.GetKeyDown("3"))
	{
		currentState = TheaterStatus.FrontLedger;
	}
	if(Input.GetKeyDown("4"))
	{
		currentState = TheaterStatus.HomeLedger;
	}
	speed = Time.deltaTime * 5;
	switch(currentState)
	{
		case TheaterStatus.Home:
			
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,0),speed/4);
			
			ledgerRight.transform.position = Vector3.MoveTowards(ledgerRight.transform.position,Vector3(18,0,-5),speed);
			ledgerRight.transform.position = Vector3.Lerp(ledgerRight.transform.position,Vector3(18,0,-5),speed/4);
			
			ledgerTop.transform.position = Vector3.MoveTowards(ledgerTop.transform.position,Vector3(0,15.6,-5),speed);
			ledgerTop.transform.position = Vector3.Lerp(ledgerTop.transform.position,Vector3(0,15.6,-5),speed/4);
			
			break;
		case TheaterStatus.Front:
		
			transform.position = Vector2.MoveTowards(transform.position,Vector2(-32,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(-32,0),speed/4);
			
			ledgerRight.transform.position = Vector3.MoveTowards(ledgerRight.transform.position,Vector3(18,0,-5),speed);
			ledgerRight.transform.position = Vector3.Lerp(ledgerRight.transform.position,Vector3(18,0,-5),speed/4);
			
			ledgerTop.transform.position = Vector3.MoveTowards(ledgerTop.transform.position,Vector3(0,15.6,-5),speed);
			ledgerTop.transform.position = Vector3.Lerp(ledgerTop.transform.position,Vector3(0,15.6,-5),speed/4);
			
			break;
		case TheaterStatus.HomeLedger:	
		
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,0),speed/4);
			
			ledgerRight.transform.position = Vector3.MoveTowards(ledgerRight.transform.position,Vector3(10.2,0,2),speed);
			ledgerRight.transform.position = Vector3.Lerp(ledgerRight.transform.position,Vector3(10.2,0,2),speed/4);
			
			ledgerTop.transform.position = Vector3.MoveTowards(ledgerTop.transform.position,Vector3(0,8.6,2),speed);
			ledgerTop.transform.position = Vector3.Lerp(ledgerTop.transform.position,Vector3(0,8.6,2),speed/4);
			
			break;
		case TheaterStatus.FrontLedger:	
		
			transform.position = Vector2.MoveTowards(transform.position,Vector2(-32,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(-32,0),speed/4);
			
			ledgerRight.transform.position = Vector3.MoveTowards(ledgerRight.transform.position,Vector3(10.2,0,2),speed);
			ledgerRight.transform.position = Vector3.Lerp(ledgerRight.transform.position,Vector3(10.2,0,2),speed/4);
			
			ledgerTop.transform.position = Vector3.MoveTowards(ledgerTop.transform.position,Vector3(0,8.6,2),speed);
			ledgerTop.transform.position = Vector3.Lerp(ledgerTop.transform.position,Vector3(0,8.6,2),speed/4);
			
			break;
		default:
			break;
	}
}