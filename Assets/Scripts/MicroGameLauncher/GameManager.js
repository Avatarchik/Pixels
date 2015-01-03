#pragma strict

// Variable Types
public enum WorldSelect{PackingPeanutFactory,Museum,test3};
var controller:Master;
var transition:GameObject;
var notification:GameObject;
var curNotify:GameObject;
var notified:boolean;
var notificationText:String;

// Controls time between games
var timeBeforeSuccessNotification:float;
var timeBeforeSpeedChange:float;
var timeIfSpeedChange:float;
var timeBeforeLevelLoad:float;

// Game variables.
static var speed:float;
static var speedProgress:int;
static var difficultyProgress:int;
static var difficulty:int;
static var failure:boolean;
static var currentGame:GameObject;
static var lives:int;
static var gameNumber:int;

// UI elements
var gameCovers:GameObject[];
var UI:GameObject;
var instructions:GameObject;

// Variables for Use
var currentGames:GameObject[];
var currentlyLoaded:GameObject;
var numberAvoid:int;
var previousGames:int[];
var gameToLoad:int;
var shuffled:boolean;
var shuffleCount:int;

// Game change variables.
var changeOrder:String;
var smallAmount:int;
var largeAmount:int;

// Pausing Variables
static var pausable:boolean;
var paused:boolean;
var menu:GameObject;
var currentMenu:GameObject;
var fade:Renderer;

// "Cutscene" variables
var openingText:GameObject;
var endingText:GameObject;
var loadedText:GameObject;

function Start () {
	// Get required variables.
	controller = Camera.main.GetComponent(Master);
	controller.worldNameFull = "";
	LoadWorld(controller.selectedWorld);
	lives = controller.lives;
	currentGames = controller.selectedWorldGames;
	UI = Instantiate(controller.selectedWorldUI);
	openingText = controller.selectedWorldOpeningText;
	endingText = controller.selectedWorldEndingText;
	
	
	// Set game change variables.
	changeOrder = "DifficultySpeed";
	smallAmount = 3;
	largeAmount = 9;
	
	// Microgame variables.
	shuffled = false;
	shuffleCount = 0;
	speed = 1;
	
	// Between game variables.
	timeBeforeSuccessNotification = 1;
	timeBeforeSpeedChange = 1;
	timeIfSpeedChange = 3.5;
	timeBeforeLevelLoad = 2;
	speedProgress = 0;
	difficultyProgress = 0;
	difficulty = 1;
	gameNumber = 1;
	notified = false;
	
	// Pause variables.
	pausable = false;
	paused = false;
	fade = Camera.main.GetComponentInChildren(Renderer);
	
	// Start the pre-game animation.
	StartCoroutine(BeforeGames());
}

//////////////////////////////////////////////////////////////////////////
/////////////////////////// Game Cycle Code //////////////////////////////
//////////////////////////////////////////////////////////////////////////

function BeforeGames () {
	UI.BroadcastMessage("GameNumberChange", gameNumber,SendMessageOptions.DontRequireReceiver);
	UI.BroadcastMessage("SpeedChange", gameNumber,SendMessageOptions.DontRequireReceiver);
	yield WaitForSeconds (1);
	loadedText = Instantiate(openingText);
	// Wait for the text to finish.
	while(!loadedText.GetComponent(TextManager).finished){yield;}
	GetRandomGame();
	yield WaitForSeconds(1);
	LaunchLevel(0);
}

function BetweenGame () {
	BroadcastArray(gameCovers,"DisplayChange","Clear");
	StartCoroutine(MoveBack());
	GetRandomGame();
	yield WaitForSeconds(timeBeforeSuccessNotification);
	UI.BroadcastMessage("GameNumberChange", gameNumber,SendMessageOptions.DontRequireReceiver);
	// Say "Success" or "Failure."
	if(failure) 
	{
		UI.BroadcastMessage("NotifySuccess", false,SendMessageOptions.DontRequireReceiver);
		BroadcastArray(gameCovers,"DisplayChange","Failure");
		lives--;
	}
	else
	{
		UI.BroadcastMessage("NotifySuccess", true,SendMessageOptions.DontRequireReceiver);
		BroadcastArray(gameCovers,"DisplayChange","Success");
	}
	yield WaitForSeconds(timeBeforeSpeedChange);
	if(lives <= 0)
	{
		StartCoroutine(GameOver());
	}
	else
	{
		LaunchLevel(0);
	}	
}

// End game and reset timer.
function GameComplete (success:boolean) {
	if(success)
	{
		failure = false;
		speedProgress++;
		difficultyProgress++;
		gameNumber ++;
	}
	else
	{
		failure = true;
	}
	pausable = true;
	StartCoroutine(BetweenGame());
}

// Lose all lives.
function GameOver () {
	yield WaitForSeconds(1);
	loadedText = Instantiate(endingText);
	while(!loadedText.GetComponent(TextManager).finished)
	{
		yield;
	}
	yield WaitForSeconds(1);
	Instantiate(transition,Vector3(0,0,-5), Quaternion.identity);
	yield WaitForSeconds(1);
	Application.LoadLevel("WorldSelect");
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
//////////////////////// Level Selection Code  ///////////////////////////
//////////////////////////////////////////////////////////////////////////

function LoadWorld (world:WorldSelect) {
	gameCovers = new GameObject[controller.selectedWorldCovers.Length];
	for(var i:int = 0; i < controller.selectedWorldCovers.Length; i++)
	{
		gameCovers[i] = Instantiate(controller.selectedWorldCovers[i]);	
		gameCovers[i].transform.position = gameCovers[i].GetComponent(GameCover).origin;
	}
	
	numberAvoid = 3;
	previousGames = new int[numberAvoid];
	for(var y:int = 0; y < numberAvoid; y++)
	{
		previousGames[y] = -1;
	}
}

function LaunchLevel (wait:float) {
	pausable = false;
	// Delete Level
	if(currentlyLoaded != null)
	{
		Destroy(currentlyLoaded);
	}
	if(!paused)
	{
		// Handles notification of speed or difficulty change.
		DifficultSpeedCheck();
		if(notified)
		{
			yield WaitForSeconds(timeIfSpeedChange);
		}
		notified = false;
		BroadcastArray(gameCovers,"DisplayChange","Controls");
		// Show instruction text and wait.
		yield WaitForSeconds(timeBeforeLevelLoad/3);
		Instantiate(instructions);
		yield WaitForSeconds(wait + 2*timeBeforeLevelLoad/3);
		StartCoroutine(MoveAway());
		// Launch level.
		currentlyLoaded = Instantiate(currentGames[gameToLoad], Vector3(0,0,5), Quaternion.identity);
		GameManager.currentGame = currentlyLoaded;
		// Shift list of previously loaded levels.
		for(var x:int = numberAvoid - 1; x > 0; x--)
		{
			previousGames[x] = previousGames[x-1];
		}
		previousGames[0] = gameToLoad;
		shuffled = false;
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

//////////////////////////////////////////////////////////////////////////
///////////////////////// Smaller Functions //////////////////////////////
//////////////////////////////////////////////////////////////////////////

function GetRandomGame() {
	while(!shuffled && shuffleCount < 10)
		{
			gameToLoad = Random.Range(0, currentGames.Length);
			for(var y:int = 0; y < numberAvoid; y++)
			{
				if(gameToLoad == previousGames[y])
				{
					shuffled = false;
					break;
				}
				else
				{
					shuffled = true;
				}
			}
			shuffleCount++;
		}
		shuffleCount = 0;
}

function Notify(text:String) {
	notificationText = text;
	curNotify = Instantiate(notification);
	curNotify.transform.position.z = -9;
}

function DifficultSpeedCheck() {
	if(changeOrder == "SpeedDifficulty")
			{
				if(difficultyProgress >= largeAmount) 
				{
					difficulty ++;
					Notify("Difficulty\nUp!");
					speed = 1;
					difficultyProgress = 0;
					notified = true;
				}
				else if(speedProgress >= smallAmount)
				{
					speed ++;
					Notify("Speed\nUp!");
					speedProgress = 0;
					notified = true;
				}
			}
			if(changeOrder == "DifficultySpeed")
			{
				if(speedProgress >= largeAmount)
				{
					speed ++;
					difficulty = 1;
					speedProgress = 0;
					Notify("Speed\nUp!");
					notified = true;
				}
				else if(difficultyProgress >= smallAmount) 
				{
					difficulty ++;
					difficultyProgress = 0;
					Notify("Difficulty\nUp!");
					notified = true;
				}
			}
			UI.BroadcastMessage("SpeedChange", speed,SendMessageOptions.DontRequireReceiver);
			UI.BroadcastMessage("DifficultyChange", difficulty,SendMessageOptions.DontRequireReceiver);
}

function BroadcastArray(array:GameObject[],message:String,input:String){
	for(var object:GameObject in array)
	{
		object.BroadcastMessage(message,input,SendMessageOptions.DontRequireReceiver);
	}
}