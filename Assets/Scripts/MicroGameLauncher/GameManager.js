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
var timeBeforeResponse:float;
var timeBeforeSpeedChange:float;
var timeIfSpeedChange:float;

// Game variables.
static var timeMultiplier:float;
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
var controls:GameObject;


// Variables for Use
var currentGames:GameObject[];
var currentlyLoaded:GameObject;
var numberAvoid:int;
var previousGames:int[];
var gameToLoad:int;
var shuffled:boolean;
var shuffleCount:int;
var speedUp:GameObject;

// Game change variables.
var changeOrder:String;
var smallAmount:int;
var largeAmount:int;

// Pausing Variables
var pausable:boolean;
var paused:boolean;
var menu:GameObject;
var currentMenu:GameObject;
var fade:Renderer;

function Start () {
	// Get required variables.
	controller = Camera.main.GetComponent(Master);
	controller.worldNameFull = "";
	LoadWorld(controller.selectedWorld);
	lives = controller.lives;
	currentGames = controller.selectedWorldGames;
	UI = Instantiate(controller.selectedWorldUI);
	speedUp = UI.Find("SpeedUp");
	
	// Set game change variables.
	changeOrder = "DifficultySpeed";
	smallAmount = 3;
	largeAmount = 9;
	
	// Microgame variables.
	shuffled = false;
	shuffleCount = 0;
	timeMultiplier = 1;
	
	// Between game variables.
	timeBeforeResponse = 1;
	timeBeforeSpeedChange = 1;
	timeIfSpeedChange = 3.5;
	speedProgress = 0;
	difficultyProgress = 0;
	difficulty = 1;
	gameNumber = 1;
	notified = false;
	
	// Pause variables.
	pausable = true;
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
	yield WaitForSeconds(2);
	LaunchLevel(0);
}

function BetweenGame () {
		StartCoroutine(MoveBack());
		yield WaitForSeconds(timeBeforeResponse);
		UI.BroadcastMessage("GameNumberChange", gameNumber,SendMessageOptions.DontRequireReceiver);
		// Say "Success" or "Failure."
		yield WaitForSeconds(timeBeforeSpeedChange);
		if(failure) 
		{
			lives--;
			yield WaitForSeconds(timeIfSpeedChange);
		}
		if(lives <= 0)
		{
			StartCoroutine(GameOver());
		}
		else 
		{
			DifficultSpeedCheck();
		}
		LaunchLevel(0);
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
	yield WaitForSeconds(2);
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
		if(notified)
		{
			yield WaitForSeconds(timeIfSpeedChange);
		}
		notified = false;
		
		// Pick games and check against previous games ten times.
		yield WaitForSeconds(wait);
		StartCoroutine(MoveAway());
		GetRandomGame();
		
		// Launch level
		currentlyLoaded = Instantiate(currentGames[gameToLoad], Vector3(0,0,5), Quaternion.identity);
		GameManager.currentGame = currentlyLoaded;
		
		// Wait for update, show instructions.
		yield WaitForSeconds(.05);
		ShowInstructions();
		
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

function ShowInstructions() {
	Instantiate(instructions);
	Instantiate(controls,Vector3(-7.3,20,0),Quaternion.identity);
	Instantiate(controls,Vector3(7.3,20,0),Quaternion.identity);
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
					Notify("Difficulty Up!");
					timeMultiplier = 1;
					UI.BroadcastMessage("DifficultyChange", difficulty,SendMessageOptions.DontRequireReceiver);
					difficultyProgress = 0;
					notified = true;
				}
				else if(speedProgress >= smallAmount)
				{
					if(speedUp != null)
					{
						speedUp.GetComponent(Animator).SetTrigger("SpeedUp");
					}
					timeMultiplier ++;
					Notify("Speed Up!");
					speedProgress = 0;
					notified = true;
				}
			}
			if(changeOrder == "DifficultySpeed")
			{
				if(speedProgress >= largeAmount)
				{
					if(speedUp != null)
					{
						speedUp.GetComponent(Animator).SetTrigger("SpeedUp");
					}
					timeMultiplier ++;
					Notify("Speed Up!");
					difficulty = 1;
					speedProgress = 0;
					notified = true;
				}
				else if(difficultyProgress >= smallAmount) 
				{
					difficulty ++;
					Notify("Difficulty Up!");
					//timeMultiplier = 1;
					UI.BroadcastMessage("DifficultyChange", difficulty,SendMessageOptions.DontRequireReceiver);
					difficultyProgress = 0;
					notified = true;
				}
			}
}