#pragma strict

class GameManager extends PimpedMonoBehaviour {}
// Variable Types
public enum WorldSelect{PackingPeanutFactory,Museum,test3};
//@Group("Variable Types")
var controller:Master;
//@Group("Variable Types")
var transition:GameObject;
//@Group("Variable Types")
var notification:GameObject;
//@Group("Variable Types")
var curNotify:GameObject;
//@Group("Variable Types")
var notified:boolean;
//@Group("Variable Types")
var notificationText:String;

// Controls time between games
//@Group("Timing")
var timeBeforeResponse:float;
//@Group("Timing")
var timeBeforeSpeedChange:float;
//@Group("Timing")
var timeIfSpeedChange:float;

// Game variables.
//@Group("Game Variables")
static var timeMultiplier:float;
//@Group("Game Variables")
static var speedProgress:int;
//@Group("Game Variables")
static var difficultyProgress:int;
//@Group("Game Variables")
static var difficulty:int;
//@Group("Game Variables")
static var failure:boolean;
//@Group("Game Variables")
static var currentGame:GameObject;
//@Group("Game Variables")
static var lives:int;
//@Group("Game Variables")
static var gameNumber:int;

// UI elements
//@Group("UI Elements")
var gameCovers:GameObject[];
//@Group("UI Elements")
var UI:GameObject;
//@Group("UI Elements")
var instructions:GameObject;
//@Group("UI Elements")
var controls:GameObject;
//@Group("UI Elements")
var speedHolderHorizontal:GameObject;
var speedHolderVertical:GameObject;
//@Group("UI Elements")
var speedObjectsHorizontal:GameObject[];
var speedObjectsVertical:GameObject[];

// Variables for Use
//@Group("Variables For Use")
var currentGames:GameObject[];
//@Group("Variables For Use")
var currentlyLoaded:GameObject;
//@Group("Variables For Use")
var numberAvoid:int;
//@Group("Variables For Use")
var previousGames:int[];
//@Group("Variables For Use")
var gameToLoad:int;
//@Group("Variables For Use")
var shuffled:boolean;
//@Group("Variables For Use")
var shuffleCount:int;

// Game change variables.
//@Group("Game Progress")
var changeOrder:String;
//@Group("Game Progress")
var smallAmount:int;
//@Group("Game Progress")
var largeAmount:int;

// Pausing Variables
//@Group("Pausing")
var pausable:boolean;
//@Group("Pausing")
var paused:boolean;
//@Group("Pausing")
var menu:GameObject;
//@Group("Pausing")
var currentMenu:GameObject;
//@Group("Pausing")
var fade:Renderer;

// "Cutscene" variables
//@Group("Cutscenes")
var openingText:GameObject;
//@Group("Cutscenes")
var endingText:GameObject;
//@Group("Cutscenes")
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
	speedHolderHorizontal = UI.Find("SpeedUpsHorizontal");
	speedHolderVertical = UI.Find("SpeedUpsVertical");
	speedObjectsHorizontal = speedHolderHorizontal.GetComponent(SpeedHolder).speedSprites;
	speedObjectsHorizontal[0].SetActive(true);
	speedObjectsVertical = speedHolderVertical.GetComponent(SpeedHolder).speedSprites;
	speedObjectsVertical[0].SetActive(true);
	
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
	yield WaitForSeconds (1);
	loadedText = Instantiate(openingText);
	while(!loadedText.GetComponent(TextManager).finished)
	{
		yield;
	}
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
	yield WaitForSeconds(2);
	loadedText = Instantiate(endingText);
	while(!loadedText.GetComponent(TextManager).finished)
	{
		yield;
	}
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
		DifficultSpeedCheck();
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
					Notify("Difficulty\nUp!");
					timeMultiplier = 1;
					UI.BroadcastMessage("DifficultyChange", difficulty,SendMessageOptions.DontRequireReceiver);
					difficultyProgress = 0;
					notified = true;
				}
				else if(speedProgress >= smallAmount)
				{
					speedObjectsHorizontal[timeMultiplier].SetActive(true);
					speedObjectsVertical[timeMultiplier].SetActive(true);
					timeMultiplier ++;
					Notify("Speed\nUp!");
					speedProgress = 0;
					notified = true;
				}
			}
			if(changeOrder == "DifficultySpeed")
			{
				if(speedProgress >= largeAmount)
				{
					speedObjectsHorizontal[timeMultiplier].SetActive(true);
					speedObjectsVertical[timeMultiplier].SetActive(true);
					timeMultiplier ++;
					Notify("Speed\nUp!");
					difficulty = 1;
					speedProgress = 0;
					notified = true;
				}
				else if(difficultyProgress >= smallAmount) 
				{
					difficulty ++;
					Notify("Difficulty\nUp!");
					//timeMultiplier = 1;
					UI.BroadcastMessage("DifficultyChange", difficulty,SendMessageOptions.DontRequireReceiver);
					difficultyProgress = 0;
					notified = true;
				}
			}
}