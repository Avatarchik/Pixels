#pragma strict

public enum TheaterStatus{Home,Front,Stats,HomeLedger,FrontLedger,CustomizeNoColor,CustomizeColor};

static var currentState:TheaterStatus;

private var speed:float;

var ledgerRight:GameObject;
var ledgerTop:GameObject;

var controller:Master;

var colors1:GameObject;

var colors2:GameObject;

function Start () {
	controller = Camera.main.GetComponent(Master);
	AudioManager.PlaySongIntro(null,controller.selectedWorldMusic,0);
	currentState = TheaterStatus.Home;
	
	// Clear out camera variables for return to map.
	Camera.main.GetComponent(Master).worldNameLine1 = " ";
	Camera.main.GetComponent(Master).worldNameLine2 = " ";
	Camera.main.GetComponent(Master).worldNameFull = " ";
}

function Update () {
	Debug.Log(currentState);
	// Moves pieces of theater based on its current state.
	speed = Time.deltaTime * 8;
	switch(currentState)
	{
		case TheaterStatus.Home:
			AudioManager.humCharacter = Person.None;
			
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,0),speed/4);
			
			ledgerRight.transform.position = Vector3.MoveTowards(ledgerRight.transform.position,Vector3(18,0,-5),speed*2);
			ledgerRight.transform.position = Vector3.Lerp(ledgerRight.transform.position,Vector3(18,0,-5),speed/2);
			
			ledgerTop.transform.position = Vector3.MoveTowards(ledgerTop.transform.position,Vector3(0,15.6,-5),speed*2);
			ledgerTop.transform.position = Vector3.Lerp(ledgerTop.transform.position,Vector3(0,15.6,-5),speed/2);
			
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,.2),speed);
			
			break;
		case TheaterStatus.Front:
			AudioManager.humCharacter = Person.None;
		
			transform.position = Vector2.MoveTowards(transform.position,Vector2(-32,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(-32,0),speed/4);
			
			ledgerRight.transform.position = Vector3.MoveTowards(ledgerRight.transform.position,Vector3(18,0,-5),speed*2);
			ledgerRight.transform.position = Vector3.Lerp(ledgerRight.transform.position,Vector3(18,0,-5),speed/2);
			
			ledgerTop.transform.position = Vector3.MoveTowards(ledgerTop.transform.position,Vector3(0,15.6,-5),speed*2);
			ledgerTop.transform.position = Vector3.Lerp(ledgerTop.transform.position,Vector3(0,15.6,-5),speed/2);
			
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,.2),speed);
			
			break;
		case TheaterStatus.HomeLedger:	
			AudioManager.humCharacter = Person.None;
		
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,0),speed/4);
			
			ledgerRight.transform.position = Vector3.MoveTowards(ledgerRight.transform.position,Vector3(10.2,0,2),speed*2);
			ledgerRight.transform.position = Vector3.Lerp(ledgerRight.transform.position,Vector3(10.2,0,2),speed/2);
			
			ledgerTop.transform.position = Vector3.MoveTowards(ledgerTop.transform.position,Vector3(0,8.6,2),speed*2);
			ledgerTop.transform.position = Vector3.Lerp(ledgerTop.transform.position,Vector3(0,8.6,2),speed/2);
			
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,.2),speed);
			
			break;
		case TheaterStatus.FrontLedger:	
			AudioManager.humCharacter = Person.None;
		
			transform.position = Vector2.MoveTowards(transform.position,Vector2(-32,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(-32,0),speed/4);
			
			ledgerRight.transform.position = Vector3.MoveTowards(ledgerRight.transform.position,Vector3(10.2,0,2),speed*2);
			ledgerRight.transform.position = Vector3.Lerp(ledgerRight.transform.position,Vector3(10.2,0,2),speed/2);
			
			ledgerTop.transform.position = Vector3.MoveTowards(ledgerTop.transform.position,Vector3(0,8.6,2),speed*2);
			ledgerTop.transform.position = Vector3.Lerp(ledgerTop.transform.position,Vector3(0,8.6,2),speed/2);
			
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,.2),speed);
			
			break;
		case TheaterStatus.CustomizeNoColor:	
			AudioManager.humCharacter = Person.Peter;
		
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,25.1),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,25.1),speed/4);
			
			ledgerRight.transform.position = Vector3.MoveTowards(ledgerRight.transform.position,Vector3(18,0,-5),speed*2);
			ledgerRight.transform.position = Vector3.Lerp(ledgerRight.transform.position,Vector3(18,0,-5),speed/2);
			
			ledgerTop.transform.position = Vector3.MoveTowards(ledgerTop.transform.position,Vector3(0,15.6,-5),speed*2);
			ledgerTop.transform.position = Vector3.Lerp(ledgerTop.transform.position,Vector3(0,15.6,-5),speed/2);
			
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,.2),speed);
			
			break;
		case TheaterStatus.CustomizeColor:	
			AudioManager.humCharacter = Person.Peter;
		
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,25.1),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,25.1),speed/4);
			
			ledgerRight.transform.position = Vector3.MoveTowards(ledgerRight.transform.position,Vector3(18,0,-5),speed*2);
			ledgerRight.transform.position = Vector3.Lerp(ledgerRight.transform.position,Vector3(18,0,-5),speed/2);
			
			ledgerTop.transform.position = Vector3.MoveTowards(ledgerTop.transform.position,Vector3(0,15.6,-5),speed*2);
			ledgerTop.transform.position = Vector3.Lerp(ledgerTop.transform.position,Vector3(0,15.6,-5),speed/2);
			
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-14.15),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(12.4,.2),speed);
			
			break;
		default:
			break;
	}
}