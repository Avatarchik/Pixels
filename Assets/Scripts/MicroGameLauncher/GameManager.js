#pragma strict

// Variable Types

var transition:GameObject;
var notification:GameObject;
private var curNotify:GameObject;
@HideInInspector var notified:boolean;
@HideInInspector var notificationText:String;

// Controls time between games
private var timeBeforeSuccessNotification:float;
private var timeBeforeSpeedChange:float;
private var timeIfSpeedChange:float;
private var timeBeforeLevelLoad:float;

// Game variables.
static var speed:float;
static var speedProgress:int;
static var difficultyProgress:int;
static var difficulty:int;
static var bossDifficulty:int;
static var failure:boolean;
static var currentGame:GameObject;
static var lives:int;
static var gameNumber:int;

// UI elements
@HideInInspector var gameCovers:GameObject[];
@HideInInspector var UI:GameObject;
var instructions:GameObject;
var heartPrefab:GameObject;
static var instructionText:String;
static var instructionType:Sprite;

// Variables for Use
@HideInInspector var currentGames:GameObject[];
@HideInInspector var bossGame:GameObject;
private var currentlyLoaded:GameObject;
private var numberAvoid:int;
private var previousGames:int[];
static var gameToLoad:int;
private var shuffled:boolean;
private var shuffleCount:int;
static var movingBack:boolean;

// Game change variables.
private var smallAmount:int;
private var largeAmount:int;

// First Time Variables
static var gameNames:String[];
static var firstTimeValues:boolean[];

// Pausing Variables
static var pausable:boolean;
@HideInInspector var paused:boolean;
var menu:GameObject;
private var currentMenu:GameObject;
@HideInInspector var fade:Renderer;

// "Cutscene" variables
@HideInInspector var loadedText:GameObject;

function Start () {
	// Get required variables.
	LoadWorld();
	lives = Master.lives;
	currentGames = Master.currentWorld.basic.games;
	bossGame = Master.currentWorld.basic.bossGame;
	UI = Instantiate(Master.currentWorld.basic.UI);
	
	// Set game change variables.
	smallAmount = 3;
	largeAmount = 10;
	if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Beaten") == 0)
	{
		smallAmount = 3;
		largeAmount = 5;
	}
	
	// Microgame variables.
	shuffled = false;
	shuffleCount = 0;
	speed = 1;
	
	// Between game variables.
	timeBeforeSuccessNotification = .45;
	timeBeforeSpeedChange = .7;
	timeIfSpeedChange = 1.5;
	timeBeforeLevelLoad = 1;
	speedProgress = 0;
	difficultyProgress = 0;
	difficulty = 1;
	bossDifficulty = 0;
	gameNumber = 1;
	notified = false;
	movingBack = false;
	
	// "First time" variables.
	gameNames = new String[currentGames.length];
	firstTimeValues = new boolean[currentGames.length];
	for(var gameNum:int = 0; gameNum < currentGames.length; gameNum++)
	{
		gameNames[gameNum] = currentGames[gameNum].transform.name;
		firstTimeValues[gameNum] = false;
	}
	
	// Pause variables.
	pausable = false;
	paused = false;
	fade = Camera.main.GetComponentInChildren(Renderer);
	
	// Start the pre-game animation.
	StartCoroutine(BeforeGames());
}

function Update () {
	Master.paused = paused;
}

//////////////////////////////////////////////////////////////////////////
/////////////////////////// Game Cycle Code //////////////////////////////
//////////////////////////////////////////////////////////////////////////

function BeforeGames () {
	UI.BroadcastMessage("GameNumberChange", gameNumber,SendMessageOptions.DontRequireReceiver);
	UI.BroadcastMessage("SpeedChange", gameNumber,SendMessageOptions.DontRequireReceiver);
	UI.BroadcastMessage("LifeChange", lives,SendMessageOptions.DontRequireReceiver);
	yield WaitForSeconds (1);
	UI.BroadcastMessage("TimerPause", gameNumber,SendMessageOptions.DontRequireReceiver);
	if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"PlayedOnce") == 0)
	{
		//AudioManager.PlaySong(Master.currentWorld.text.firstOpeningSong);
		loadedText = Instantiate(Master.currentWorld.text.firstOpening);
	}
	else
	{
		//AudioManager.PlaySong(Master.currentWorld.text.regularOpeningSong);
		loadedText = Instantiate(Master.currentWorld.text.regularOpening);
	}
	// Wait for the text to finish.
	while(!loadedText.GetComponent(TextManager).finished){yield;}
	pausable = true;
	AudioManager.PlaySong(Master.currentWorld.audio.music[speed-1]);
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
	UI.BroadcastMessage("TimerPause", gameNumber,SendMessageOptions.DontRequireReceiver);
	// Say "Success" or "Failure."
	if(failure) 
	{
		UI.BroadcastMessage("NotifySuccess", false,SendMessageOptions.DontRequireReceiver);
		BroadcastArray(gameCovers,"DisplayChange","Failure");
		AudioManager.PlaySound(Master.currentWorld.audio.failure,.5);
		lives--;
		Instantiate(heartPrefab);
		UI.BroadcastMessage("LifeChange", lives,SendMessageOptions.DontRequireReceiver);
	}
	else
	{
		UI.BroadcastMessage("NotifySuccess", true,SendMessageOptions.DontRequireReceiver);
		BroadcastArray(gameCovers,"DisplayChange","Success");
		AudioManager.PlaySound(Master.currentWorld.audio.success,.5);
	}
	yield WaitForSeconds(timeBeforeSpeedChange);
	if(lives <= 0 || (PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Beaten") == 0 && gameNumber > Master.unlockLevels[1]))
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
		firstTimeValues[gameToLoad] = true;
	}
	else
	{
		failure = true;
	}
	StartCoroutine(BetweenGame());
}

// Lose all lives.
function GameOver () {
	yield WaitForSeconds(.5);
	pausable = false;
	PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"PlayedOnce", 1);
	if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Beaten") == 0 && gameNumber >= Master.unlockLevels[1])
	{
		PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"Beaten",1);
		loadedText = Instantiate(Master.currentWorld.text.beatEnd);
	}
	else if(gameNumber >= Master.unlockLevels[3])
	{
		loadedText = Instantiate(Master.currentWorld.text.end4);
	}
	else if(gameNumber >= Master.unlockLevels[2])
	{
		loadedText = Instantiate(Master.currentWorld.text.end3);
	}
	else if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Beaten") == 1 && gameNumber >= Master.unlockLevels[1])
	{
		loadedText = Instantiate(Master.currentWorld.text.end2);
	}
	else
	{
		loadedText = Instantiate(Master.currentWorld.text.end1);
	}
	yield WaitForSeconds(.2);
	while(!loadedText.GetComponent(TextManager).finished){yield;}
	AudioManager.PlaySoundTransition(Master.currentWorld.audio.transitionOut);
	Instantiate(transition,Vector3(0,0,-5), Quaternion.identity);
	yield WaitForSeconds(.7);
	AudioManager.StopSong();
	yield WaitForSeconds(1.3);
	Master.lastScore = gameNumber;
	if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"HighScore") <= gameNumber)
	{
		PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"HighScore",gameNumber);
	}
	Master.needToNotify = true;
	Application.LoadLevel("WorldSelect");
}

//////////////////////////////////////////////////////////////////////////
////////////////////////// Hud Movement Code /////////////////////////////
//////////////////////////////////////////////////////////////////////////

function MoveAway () {
	var countAway:int = 0;
	movingBack = false;
	while(countAway < gameCovers.length && !movingBack)
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
				gameCovers[i].transform.position = Vector3.MoveTowards(gameCovers[i].transform.position, gameCovers[i].GetComponent(GameCover).destination, Time.deltaTime * 70);
			}
		}
		yield;
	}
	yield;
}

function MoveBack () {
	var countTowards:int = 0;
	movingBack = true;
	while(countTowards < gameCovers.length && movingBack)
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
				gameCovers[i].transform.position = Vector3.MoveTowards(gameCovers[i].transform.position, gameCovers[i].GetComponent(GameCover).origin, Time.deltaTime * 70);
			}
		}
		yield;
	}
	movingBack = false;
	yield;
}

//////////////////////////////////////////////////////////////////////////
//////////////////////// Level Selection Code  ///////////////////////////
//////////////////////////////////////////////////////////////////////////

function LoadWorld () {
	gameCovers = new GameObject[Master.currentWorld.basic.covers.Length];
	for(var i:int = 0; i < Master.currentWorld.basic.covers.Length; i++)
	{
		gameCovers[i] = Instantiate(Master.currentWorld.basic.covers[i]);	
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
	// Delete Level
	
	if(currentlyLoaded != null)
	{
		Destroy(currentlyLoaded);
	}
	while(paused){yield;}
	
	// Handles notification of speed or difficulty change.
	DifficultSpeedCheck();
	if(notified)
	{
		yield WaitForSeconds(timeIfSpeedChange);
		if(Master.currentWorld.audio.music.length >= speed)
		{
			AudioManager.StopSong();
			AudioManager.PlaySong(Master.currentWorld.audio.music[speed-1]);
		}
	}
	notified = false;
	switch(gameNumber)
	{
		case Master.unlockLevels[1]:case Master.unlockLevels[2]:case Master.unlockLevels[3]:case Master.unlockLevels[4]:case Master.unlockLevels[5]:
			instructionText = bossGame.GetComponent(MicroGameManager).instruction;
			instructionType = bossGame.GetComponent(MicroGameManager).controls;
			break;
		default:
			instructionText = currentGames[gameToLoad].GetComponent(MicroGameManager).instruction;
			instructionType = currentGames[gameToLoad].GetComponent(MicroGameManager).controls;
			break;
	}
	BroadcastArray(gameCovers,"DisplayChange","Controls");
	
	// Show instruction text and wait.
	yield WaitForSeconds(timeBeforeLevelLoad/3);
	
	Instantiate(instructions);
	yield WaitForSeconds(wait + 2*timeBeforeLevelLoad/3);
	UI.BroadcastMessage("TimerStart", gameNumber,SendMessageOptions.DontRequireReceiver);
	StartCoroutine(MoveAway());
	// Launch level.
	if(currentlyLoaded == null)
	{
		switch(gameNumber)
		{
			case Master.unlockLevels[1]:case Master.unlockLevels[2]:case Master.unlockLevels[3]:case Master.unlockLevels[4]:case Master.unlockLevels[5]:
				bossDifficulty++;
				currentlyLoaded = Instantiate(bossGame, Vector3(0,0,5), Quaternion.identity);
				AudioManager.PlaySound(Master.currentWorld.audio.bossGameSounds[Random.Range(0,Master.currentWorld.audio.bossGameSounds.length)],1);
				break;
			default:
				currentlyLoaded = Instantiate(currentGames[gameToLoad], Vector3(0,0,5), Quaternion.identity);
				break;
		}
	}
	GameManager.currentGame = currentlyLoaded;
	// Shift list of previously loaded levels.
	for(var x:int = numberAvoid - 1; x > 0; x--)
	{
		previousGames[x] = previousGames[x-1];
	}
	previousGames[0] = gameToLoad;
	shuffled = false;
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////// Pausing Code ////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function Clicked () {
	if(pausable && currentMenu == null && lives > 0)
	{
		paused = true;
		fade.material.color.a = .5;
		Time.timeScale = 0;
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
	if(speedProgress >= largeAmount)
	{
		speed ++;
		AudioManager.PlaySound(Master.currentWorld.audio.speedUp);
		difficulty = 1;
		speedProgress = 0;
		Notify("Speed\nUp!");
		notified = true;
	}
	else if(difficultyProgress >= smallAmount) 
	{
		difficulty ++;
		if(difficulty > 3)
		{
			difficulty = 3;
		}
		difficultyProgress = 0;
	}
	UI.BroadcastMessage("SpeedChange", speed,SendMessageOptions.DontRequireReceiver);
}

function BroadcastArray(array:GameObject[],message:String,input:String){
	for(var object:GameObject in array)
	{
		object.BroadcastMessage(message,input,SendMessageOptions.DontRequireReceiver);
	}
}