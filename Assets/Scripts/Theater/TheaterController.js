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

// Player Stuff
var playerPrefab:GameObject;
@HideInInspector var player1:GameObject;
@HideInInspector var player2:GameObject;
@HideInInspector var player3:GameObject;
var player3Parent:Transform;

function Awake () {
	player1 = Instantiate(playerPrefab);
	player2 = Instantiate(playerPrefab);
	player3 = Instantiate(playerPrefab);
	player1.transform.position = Vector3(3.579,-5.1,8.5);
	player2.transform.position = Vector3(52,-7.35,8.5);
	player3.transform.position = Vector3(-2,-24.9,-2.865);
	player1.transform.localScale = Vector3(1,1,1);
	player2.transform.localScale = Vector3(2.5,2.5,2.5);
	player3.transform.localScale = Vector3(2.5,2.5,2.5);
	player1.transform.parent = transform;
	player2.transform.parent = transform;
	player3.transform.parent = player3Parent;	
	player1.AddComponent(PlayerWalking);
	player2.AddComponent(PlayerWalking);
	player2.GetComponent(PlayerWalking).frontOfHousePlayer = true;
	player1.GetComponent(PlayerManager).speedOverride = true;
	player1.GetComponent(PlayerManager).thisSpeed = .3;
	player2.GetComponent(PlayerManager).speedOverride = true;
	player2.GetComponent(PlayerManager).thisSpeed = .3;
	player3.GetComponent(PlayerManager).speedOverride = true;
	player3.GetComponent(PlayerManager).thisSpeed = 1.4;
	player3.GetComponent(PlayerManager).currentState = PlayerState.SpecialHeadBob;
}
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
	AudioManager.PlaySongIntro(null,controller.worlds[0].audio.music,0);
	//AudioManager.PlaySongIntro(null,controller.currentWorld.audio.music,0);
}
