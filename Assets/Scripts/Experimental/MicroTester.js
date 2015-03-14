#pragma strict
var speed:float;
var difficultyAmount:int;

// Variable Types
var controller:TestMaster;
var notification:GameObject;
var notificationText:String;

// Controls time between games
var timeBeforeResponse:float;
var timeBeforeSpeedChange:float;
var timeIfSpeedChange:float;

// Game variables.
static var timeMultiplier:float;
static var speedProgress:int;
static var difficultyProgress:int;
static var difficulty:int;
static var speedChange:int;
static var failure:boolean;
static var currentGame:GameObject;
static var lives:int;
static var gameNumber:int;

// Prefabs
var gameCovers:GameObject[];
var instructions:GameObject;
var controls:GameObject;

// Lists of Microgames by World
var game:GameObject;
var gameInstructions:MicroGameManager;

// Variables for Use
var currentlyLoaded:GameObject;
var speedUp:GameObject;

// Pausing Variables
static var pausable:boolean;
var paused:boolean;
var menu:GameObject;
var currentMenu:GameObject;
var fade:Renderer;

// "Cutscene" variables
var openingText:GameObject;
var loadedText:GameObject;

function Start () {
	// Get required variables.
	controller = Camera.main.GetComponent(TestMaster);
	lives = controller.lives;
	
	// Microgame variables.
	timeMultiplier = speed;
	difficulty = difficultyAmount;
	
	// Between game variables.
	if(speedChange == 0)
	{
		speedChange = 3;
	}
	if(timeBeforeResponse == 0)
	{
		timeBeforeResponse = .4;
	}
	if(timeBeforeSpeedChange == 0)
	{
		timeBeforeSpeedChange = .4;
	}
	if(timeIfSpeedChange == 0)
	{
		timeIfSpeedChange = .4;
	}
	speedProgress = 2;
	gameNumber = 1;
	pausable = true;
	paused = false;
	fade = Camera.main.GetComponentInChildren(Renderer);
	// Start the pre-game animation;
	StartCoroutine(BeforeGames());
}

//////////////////////////////////////////////////////////////////////////
/////////////////////////// Game Cycle Code //////////////////////////////
//////////////////////////////////////////////////////////////////////////

function BeforeGames () {
	/*
	loadedText = Instantiate(openingText);
	while(!loadedText.GetComponent(TextManager).finished)
	{
		yield;
	}
	yield WaitForSeconds(2);
	*/
	LaunchLevel(0);
	yield;
}

function BetweenGame () {
		StartCoroutine(MoveBack());
		yield WaitForSeconds(timeBeforeResponse);
		// Say "Success" or "Failure."
		yield WaitForSeconds(timeBeforeSpeedChange);
		if(failure) 
		{
			if(timeMultiplier > 7)
			{
				timeMultiplier -= speedChange;
			}
			yield WaitForSeconds(timeIfSpeedChange);
		}
		else if(speedProgress > 4)
		{
			if(speedUp != null)
			{
				speedUp.GetComponent(Animator).SetTrigger("SpeedUp");
			}
			if(timeMultiplier > 7)
			{
				timeMultiplier += speedChange;
			}
			speedProgress = 0;
			yield WaitForSeconds(timeIfSpeedChange);
		}
		if(lives > 0)
		{
			LaunchLevel(0);
		}
		else
		{
			StartCoroutine(GameOver());
		}
}

// End game and reset timer.
function GameComplete (success:boolean) {
	if(success)
	{
		Debug.Log("SUCCESS");
		failure = false;
		speedProgress++;
	}
	else
	{
		Debug.Log("FAILURE");
		speedProgress = 0;
		failure = true;
	}
	pausable = true;
	StartCoroutine(BetweenGame());
}

// Lose all lives.
function GameOver () {
	yield WaitForSeconds(1);
	//Application.LoadLevel("WorldSelect");
}

//////////////////////////////////////////////////////////////////////////
////////////////////////// Hud Movement Code /////////////////////////////
//////////////////////////////////////////////////////////////////////////

function MoveAway () {
	var countAway:int = 0;
	while(countAway < gameCovers.length)
	{
		countAway = 0;
		for(var i:int = 0; i < gameCovers.Length; i++)
		{
			if(gameCovers[i].transform.position == gameCovers[i].GetComponent(GameCover).destination)
			{
				countAway++;
			}
			else
			{
				gameCovers[i].transform.position = Vector2.MoveTowards(gameCovers[i].transform.position, gameCovers[i].GetComponent(GameCover).destination, Time.deltaTime * 40);
			}
		}
		yield;
	}
	yield;
}

function MoveBack () {
	var countTowards:int = 0;
	while(countTowards < gameCovers.length)
	{
		countTowards = 0;
		for(var i:int = 0; i < gameCovers.Length; i++)
		{
			if(gameCovers[i].transform.position == gameCovers[i].GetComponent(GameCover).origin)
			{
				countTowards++;
			}
			else
			{
				gameCovers[i].transform.position = Vector2.MoveTowards(gameCovers[i].transform.position, gameCovers[i].GetComponent(GameCover).origin, Time.deltaTime * 40);
			}
		}
		yield;
	}
	yield;
}

//////////////////////////////////////////////////////////////////////////
////////////////////// Level Selection Code Code /////////////////////////
//////////////////////////////////////////////////////////////////////////

function LaunchLevel (wait:float) {
	pausable = false;
	if(currentlyLoaded != null)
	{
		Destroy(currentlyLoaded);
	}
	
	if(!paused)
	{
		yield WaitForSeconds(wait);
		// LAUNCH THE LEVEL HERE
		StartCoroutine(MoveAway());
		currentlyLoaded = Instantiate(game, Vector3(0,0,5), Quaternion.identity);
		GameManager.currentGame = currentlyLoaded;
		yield WaitForSeconds(.05);
		Instantiate(instructions);
		Instantiate(controls,Vector3(-7.3,20,0),Quaternion.identity);
		Instantiate(controls,Vector3(7.3,20,0),Quaternion.identity);
	}
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////// Pausing Code ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function Clicked () {
	if(pausable && currentMenu == null)
	{
		paused = true;
		fade.material.color.a = .5;
		currentMenu = Instantiate(menu, Vector3(0,-24,-3),Quaternion.identity);
	}
	else
	{
		
	}
}