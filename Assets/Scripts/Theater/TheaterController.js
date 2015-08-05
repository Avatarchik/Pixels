#pragma strict

public enum TheaterStatus{Home,Front,Stats,CustomizeNoColor,CustomizeColor};
static var currentState:TheaterStatus;
static var customizing:boolean;
static var buttonCooldown:float;

@HideInInspector var speed:float;
@HideInInspector var controller:Master;

var statsScreen:GameObject;

var colors1:GameObject;
var colors2:GameObject;

function Start () {
	controller = Camera.main.GetComponent(Master);
	PlayAudio();
	currentState = TheaterStatus.Stats;
	buttonCooldown = 0;
	customizing = false;
}

function Update () {
	// Moves pieces of theater based on its current state.
	speed = Time.deltaTime * 8;
	buttonCooldown -= Time.deltaTime;
	switch(currentState)
	{
		case TheaterStatus.Home:
			AudioManager.humCharacter = Person.None;
			
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,0),speed/4);
			
			statsScreen.transform.position = Vector3.MoveTowards(statsScreen.transform.position,Vector3(-32.1,0,2),speed*2);
			statsScreen.transform.position = Vector3.Lerp(statsScreen.transform.position,Vector3(-32.1,0,2),speed/2);
			
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,.2),speed);
			
			break;
		case TheaterStatus.Front:
			AudioManager.humCharacter = Person.None;
		
			transform.position = Vector2.MoveTowards(transform.position,Vector2(-32,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(-32,0),speed/4);
			
			statsScreen.transform.position = Vector3.MoveTowards(statsScreen.transform.position,Vector3(-32.1,0,2),speed*2);
			statsScreen.transform.position = Vector3.Lerp(statsScreen.transform.position,Vector3(-32.1,0,2),speed/2);
			
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,.2),speed);
			
			break;
		case TheaterStatus.Stats:
			customizing = false;
			AudioManager.humCharacter = Person.None;
			
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,0),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,0),speed/4);
			
			statsScreen.transform.position = Vector3.MoveTowards(statsScreen.transform.position,Vector3(0,0,2),speed*1.25);
			statsScreen.transform.position = Vector3.Lerp(statsScreen.transform.position,Vector3(0,0,2),speed/5);
			
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,.2),speed);
			
			break;
		case TheaterStatus.CustomizeNoColor:
			customizing = false;
			AudioManager.humCharacter = Person.Peter;
		
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,25.1),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,25.1),speed/4);
			
			statsScreen.transform.position = Vector3.MoveTowards(statsScreen.transform.position,Vector3(-32.1,0,2),speed*2);
			statsScreen.transform.position = Vector3.Lerp(statsScreen.transform.position,Vector3(-32.1,0,2),speed/2);
			
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,.2),speed);
			
			break;
		case TheaterStatus.CustomizeColor:	
			customizing = false;
			AudioManager.humCharacter = Person.Peter;
		
			transform.position = Vector2.MoveTowards(transform.position,Vector2(0,25.1),speed);
			transform.position = Vector2.Lerp(transform.position,Vector2(0,25.1),speed/4);
			
			statsScreen.transform.position = Vector3.MoveTowards(statsScreen.transform.position,Vector3(-32.1,0,2),speed*2);
			statsScreen.transform.position = Vector3.Lerp(statsScreen.transform.position,Vector3(-32.1,0,2),speed/2);
			
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-14.15),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(12.4,.2),speed);
			break;
		default:
			break;
	}
}

function PlayAudio () {
	AudioManager.PlaySongIntro(null,controller.worlds[1].audio.music,0);
	//AudioManager.PlaySongIntro(null,controller.currentWorld.audio.music,0);
}
