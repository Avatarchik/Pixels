#pragma strict

// Variable Types
public enum WorldSelect{PackingPeanutFactory,Museum,test3};
var controller:Master;
var transition:GameObject;
var instructions:GameObject;

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

// Variables for Use
var currentGames:GameObject[];
var currentlyLoaded:GameObject;
var numberAvoid:int;
var previousGames:int[];
var gameToLoad:int;
var shuffled:boolean;
var shuffleCount:int;
var speedUp:GameObject;

function Start () {
	// Get required variables.
	controller = Camera.main.GetComponent(Master);
	controller.worldNameFull = "";
	LoadWorld(controller.selectedWorld);
	lives = controller.lives;
	currentGames = controller.selectedWorldGames;
	UI = Instantiate(controller.selectedWorldUI);
	speedUp = UI.Find("SpeedUp");
	
	// Microgame variables.
	shuffled = false;
	shuffleCount = 0;
	timeMultiplier = 1;
	
	// Between game variables.
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
	speedProgress = 0;
	difficultyProgress = 0;
	difficulty = 1;
	gameNumber = 1;
	// Start the pre-game animation.
	StartCoroutine(BeforeGames());
}

//////////////////////////////////////////////////////////////////////////
/////////////////////////// Game Cycle Code //////////////////////////////
//////////////////////////////////////////////////////////////////////////

function BeforeGames () {
	UI.BroadcastMessage("GameNumberChange", gameNumber,SendMessageOptions.DontRequireReceiver);
	yield WaitForSeconds(3);
	StartCoroutine(MoveAway());
	LaunchLevel();
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
		else if(difficultyProgress > 15) 
		{
			difficulty ++;
			timeMultiplier = 1;
			UI.BroadcastMessage("DifficultyChange", difficulty,SendMessageOptions.DontRequireReceiver);
			difficultyProgress = 0;
			yield WaitForSeconds(timeIfSpeedChange);
		}
		else if(speedProgress > 4)
		{
			if(speedUp != null)
			{
				speedUp.GetComponent(Animator).SetTrigger("SpeedUp");
			}
			timeMultiplier ++;
			speedProgress = 0;
			yield WaitForSeconds(timeIfSpeedChange);
		}
		
		//Check for Death
		if(lives > 0)
		{
			StartCoroutine(MoveAway());
			LaunchLevel();
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
		Debug.Log(Time.time);
		failure = false;
		speedProgress++;
		difficultyProgress++;
		gameNumber ++;
	}
	else
	{
		failure = true;
	}
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
////////////////////// Level Selection Code Code /////////////////////////
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

function LaunchLevel () {
	if(currentlyLoaded != null)
	{
		Destroy(currentlyLoaded);
	}
	// Pick games and check against previous games ten times.
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
	// LAUNCH THE LEVEL HERE
	currentlyLoaded = Instantiate(currentGames[gameToLoad], Vector3(0,0,5), Quaternion.identity);
	GameManager.currentGame = currentlyLoaded;
	Instantiate(instructions);
	// Shift list of previously loaded levels.
	for(var x:int = numberAvoid - 1; x > 0; x--)
	{
		previousGames[x] = previousGames[x-1];
	}
	previousGames[0] = gameToLoad;
	shuffled = false;
}