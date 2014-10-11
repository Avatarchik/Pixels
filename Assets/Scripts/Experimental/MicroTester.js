#pragma strict

// Variable Types
var controller:TestMaster;

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

var gameCovers:GameObject[];
var instructions:GameObject;

// Lists of Microgames by World
var game:GameObject;

// Variables for Use
var currentlyLoaded:GameObject;
var speedUp:GameObject;

function Start () {
	// Get required variables.
	controller = Camera.main.GetComponent(TestMaster);
	lives = controller.lives;
	
	// Microgame variables.
	if(timeMultiplier == null || timeMultiplier < 7)
	{
		timeMultiplier = 3;
	}
	
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
	speedProgress = 0;
	difficulty = 3;
	gameNumber = 1;
	// Start the pre-game animation.
	StartCoroutine(BeforeGames());
}

//////////////////////////////////////////////////////////////////////////
/////////////////////////// Game Cycle Code //////////////////////////////
//////////////////////////////////////////////////////////////////////////

function BeforeGames () {
	yield WaitForSeconds(3);
	StartCoroutine(MoveAway());
	LaunchLevel();
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
			//lives--;
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
		failure = false;
		speedProgress++;
	}
	else
	{
		speedProgress = 0;
		failure = true;
	}
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

function LaunchLevel () {
	if(currentlyLoaded != null)
	{
		Destroy(currentlyLoaded);
	}
	
	// LAUNCH THE LEVEL HERE
	currentlyLoaded = Instantiate(game, Vector3(0,0,5), Quaternion.identity);
	GameManager.currentGame = currentlyLoaded;
	Instantiate(instructions);
}