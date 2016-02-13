	#pragma strict

// Variable Types
var transition:GameObject;
var notification:GameObject;
var results:GameObject;
@HideInInspector var currentResults:GameObject;
private var curNotify:GameObject;
@HideInInspector var notified:boolean;
@HideInInspector var notificationText:String;

// Controls time between games
@HideInInspector var timeBeforeSuccessNotification:float;
@HideInInspector var timeBeforeSpeedChange:float;
@HideInInspector var timeIfSpeedChange:float;
@HideInInspector var timeBeforeLevelLoad:float;

// Game variables.
@HideInInspector var settings:String;
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

@HideInInspector var loadedNotification:GameObject;

// Variables for Use
@HideInInspector var currentGames:GameObject[];
@HideInInspector var bossGame:GameObject;
@HideInInspector var currentlyLoaded:GameObject;
@HideInInspector var numberAvoid:int;
@HideInInspector var previousGames:int[];
static var gameToLoad:int;
@HideInInspector var shuffled:boolean;
@HideInInspector var shuffleCount:int;
static var movingBack:boolean;
@HideInInspector var quitting:boolean;
static var replay:boolean;
@HideInInspector var tutorialize:boolean;
@HideInInspector var tutorialText:String;

// Game change variables.
@HideInInspector var difficultyChangeAmount:int;
@HideInInspector var speedChangeAmount:int;

// First Time Variables
static var gameNames:String[];
static var firstTimeValues:boolean[];

// Pausing Variables
static var pausable:boolean;
@HideInInspector var paused:boolean;
var menu:GameObject;
@HideInInspector var currentMenu:GameObject;
@HideInInspector var fade:Renderer;

// "Cutscene" variables
@HideInInspector var loadedText:GameObject;

static var showCredits:boolean;

function Start () {
	// Get required variables.
	showCredits = false;
	LoadWorld();
	currentGames = Master.currentWorld.basic.games;
	bossGame = Master.currentWorld.basic.bossGame;
	UI = Instantiate(Master.currentWorld.basic.UI);
	if(Master.hardMode)
	{
		var hue:float = 0;
		var saturation:float = 1.3;
		var tint:Color = Color(1,.4,.4,1);
		GetComponent(ChangeHue).ChangeHue(UI.transform,hue,saturation,tint);
		for(var cover:GameObject in gameCovers)
		{
			GetComponent(ChangeHue).ChangeHue(cover.transform,hue,saturation,tint);
		}
	}
	
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
	
	// Microgame variables.
	shuffled = false;
	shuffleCount = 0;
	speed = 2;
	
	// Set game change variables.
	lives = Master.lives;
	difficultyChangeAmount = 3;
	speedChangeAmount = 10;
	if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Beaten") == 0)
	{
		settings = "First Time";
	}
	else
	{
		settings = "Return Visit";
	}
	if(Master.hardMode)
	{
		settings = "Hard Mode";
	}
	
	// Between game variables.
	timeBeforeSuccessNotification = .45;
	timeBeforeSpeedChange = .7;
	timeIfSpeedChange = 1.5;
	timeBeforeLevelLoad = 1;
	speedProgress = 0;
	difficultyProgress = 0;
	gameNumber = 0;
	notified = false;
	movingBack = false;
	quitting = false;
	replay = false;
	tutorialize = false;
	BroadcastArray(gameCovers,"DisplayChange","Clear");
	
	// "First time" variables.
	gameNames = new String[currentGames.length];
	firstTimeValues = new boolean[currentGames.length];
	for(var gameNum:int = 0; gameNum < currentGames.length; gameNum++)
	{
		gameNames[gameNum] = currentGames[gameNum].transform.name;
		firstTimeValues[gameNum] = false;
	}
	
	
	switch(settings)
	{
		case "First Time":
			difficultyChangeAmount = 3;
			speedChangeAmount = 5;
			speed = 1;
			difficulty = 1;
			bossDifficulty = 0;
			break;
		case "Return Visit":
			difficultyChangeAmount = 3;
			speedChangeAmount = 10;
			speed = 2;
			difficulty = 1;
			bossDifficulty = 0;
			break;
		case "Hard Mode":
			difficultyChangeAmount = 5;
			speedChangeAmount = 10;
			speed = 5;
			difficulty = 2;
			bossDifficulty = 2;
			break;
		default:
			break;
	}
	// Hard mode settings
	
	
	// Pause variables.
	pausable = false;
	paused = false;
	fade = Camera.main.GetComponentInChildren(Renderer);
	UI.BroadcastMessage("GameNumberChange", gameNumber,SendMessageOptions.DontRequireReceiver);
	UI.BroadcastMessage("SpeedChange", Mathf.Floor(speed),SendMessageOptions.DontRequireReceiver);
	UI.BroadcastMessage("LifeChange", lives,SendMessageOptions.DontRequireReceiver);
	yield WaitForSeconds (.55);
	UI.BroadcastMessage("TimerPause", gameNumber,SendMessageOptions.DontRequireReceiver);
	if(!Master.hardMode)
	{
		if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"PlayedOnce") == 0)
		{
			PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"FirstOpeningPlayed",1);
			loadedText = Instantiate(Master.currentWorld.text.firstOpening);
		}
		else
		{
			PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"RegularOpeningPlayed",1);
			loadedText = Instantiate(Master.currentWorld.text.regularOpening);
		}
		// Wait for the text to finish.
		while(!loadedText.GetComponent(TextManager).finished){yield;}
	}
	UI.BroadcastMessage("GamesStart", gameNumber,SendMessageOptions.DontRequireReceiver);
	PlayCurrentMusic();
	GetRandomGame();
	yield WaitForSeconds(1);
	pausable = true;
	LaunchLevel(0);
}

function BetweenGame () {
											if(quitting){return;}
	BroadcastArray(gameCovers,"DisplayChange","Clear");
	StartCoroutine(MoveBack());
	GetRandomGame();
	yield WaitForSeconds(timeBeforeSuccessNotification);
											if(quitting){return;}
	UI.BroadcastMessage("GameNumberChange", gameNumber,SendMessageOptions.DontRequireReceiver);
	UI.BroadcastMessage("TimerPause", gameNumber,SendMessageOptions.DontRequireReceiver);
	// Say "Success" or "Failure."
	if(failure) 
	{
		UI.BroadcastMessage("NotifySuccess", false,SendMessageOptions.DontRequireReceiver);
		UI.BroadcastMessage("NotifySuccess", false,SendMessageOptions.DontRequireReceiver);
		BroadcastArray(gameCovers,"DisplayChange","Failure");
		AudioManager.PlaySound(Master.currentWorld.audio.failure,.5);
		lives--;
		Instantiate(heartPrefab);
		UI.BroadcastMessage("LifeChange", lives,SendMessageOptions.DontRequireReceiver);
	}
	else
	{
		Instantiate(Master.currentWorld.basic.successObject, Vector3(0,0,-2.9),Quaternion.identity);
		UI.BroadcastMessage("NotifySuccess", true,SendMessageOptions.DontRequireReceiver);
		BroadcastArray(gameCovers,"DisplayChange","Success");
		AudioManager.PlaySound(Master.currentWorld.audio.success,.5);
	}
	yield WaitForSeconds(timeBeforeSpeedChange);
	if(quitting){return;}
	if(lives <= 0 || (PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Beaten") == 0 && gameNumber > Master.unlockLevels[1] && Master.currentWorld.basic.worldNameVar != "VRTraining"))
	{
		StartCoroutine(GameOver());
	}
	else
	{
		LaunchLevel(0);
	}	
}

function Quit () {
	quitting = true;
	MoveBack();
	lives = 0;
	BroadcastArray(gameCovers,"DisplayChange","Clear");
	UI.BroadcastMessage("TimerPause", gameNumber,SendMessageOptions.DontRequireReceiver);
	AudioManager.StopSong();
	GameOver();	
}

// End game and reset timer.
function GameComplete (success:boolean) {
											if(quitting){return;}
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
	UI.BroadcastMessage("GamesEnd", gameNumber,SendMessageOptions.DontRequireReceiver);
	if(!Master.hardMode && !quitting && Master.currentWorld.basic.worldNameVar != "VRTraining")
	{
			loadedText = Instantiate(FindEnding());
			yield WaitForSeconds(.2);
			Destroy(currentlyLoaded);
			while(!loadedText.GetComponent(TextManager).finished){yield;}
	}
	Master.lastScore = gameNumber;
	UI.BroadcastMessage("GameNumberChange", "",SendMessageOptions.DontRequireReceiver);
	currentResults = Instantiate(results,Vector3(results.transform.position.x,20,results.transform.position.z), Quaternion.identity);
	var sinCounter:float = 0;
	var sinMultiplier:float = 20;
	while(!currentResults.GetComponent(ResultsScreen).finished) {
		fade.material.color.a = Mathf.MoveTowards(fade.material.color.a,.5,Time.deltaTime);
		currentResults.transform.position.y = Mathf.Abs(Mathf.Cos(sinCounter) * sinMultiplier);
		sinCounter += Time.deltaTime * 6;
		sinMultiplier = Mathf.Lerp(sinMultiplier,0,Time.deltaTime * 3.5);
		yield;
	}
	fade.material.color.a = 0;
	if(Master.hardMode)
	{
		if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"HighScoreHard") <= gameNumber)
		{
			PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"HighScoreHard",gameNumber);
		}
	}
	else
	{
		if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"HighScore") <= gameNumber)
		{
			PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"HighScore",gameNumber);
		}
	}
	if(showCredits)
	{
		AudioManager.PlaySoundTransition(Master.currentWorld.audio.transitionOut);
		Instantiate(transition,Vector3(0,0,-9.5), Quaternion.identity);
		yield WaitForSeconds(.7);
		AudioManager.StopSong();
		yield WaitForSeconds(1.3);
		Application.LoadLevel("Credits");
		Master.hardMode = false;
	}
	else
	{
		if(replay)
		{
			AudioManager.StopAll(.5);
			BeforeGames();
		}
		else
		{
			AudioManager.PlaySoundTransition(Master.currentWorld.audio.transitionOut);
			Instantiate(transition,Vector3(0,0,-9.5), Quaternion.identity);
			yield WaitForSeconds(.7);
			AudioManager.StopSong();
			yield WaitForSeconds(1.3);
			Application.LoadLevel("WorldSelect");
			Master.hardMode = false;
		}
	}
}

function FindEnding ():GameObject{
	if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Beaten") == 0 && gameNumber > Master.unlockLevels[1])
	{
		PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"Beaten",1);
		PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"BeatEndPlayed",1);
		return Master.currentWorld.text.beatEnd;
	}
	else if(gameNumber > Master.unlockLevels[3])
	{
		PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"End4Played",1);
		PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"End3Played",1);
		PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"End2Played",1);
		return Master.currentWorld.text.end4;
	}
	else if(gameNumber > Master.unlockLevels[2])
	{
		PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"End3Played",1);
		PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"End2Played",1);
		return Master.currentWorld.text.end3;
	}
	else if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Beaten") == 1 && gameNumber > Master.unlockLevels[1])
	{
		PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"End2Played",1);
		return Master.currentWorld.text.end2;
	}
	else
	{
		PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"End1Played",1);
		return Master.currentWorld.text.end1;
	}
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
											if(quitting){return;}
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
			PlayCurrentMusic();
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
											if(quitting){return;}
	BroadcastArray(gameCovers,"DisplayChange","Controls");
	
	// Show instruction text and wait.
											if(quitting){return;}
	if(tutorialize)
	{
		TutorialNotification(tutorialText);
	}
	Instantiate(instructions);
	yield WaitForSeconds(wait + 3*timeBeforeLevelLoad/3);
											if(quitting){return;}
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
				if(Master.currentWorld.audio.bossGameSounds.length > 0)
				{
					AudioManager.PlayCutscene(Master.currentWorld.audio.bossGameSounds[Random.Range(0,Master.currentWorld.audio.bossGameSounds.length)],1);
				}
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
	if(tutorialize)
	{
		gameToLoad = previousGames[0];
	}
}

function Notify(text:String) {
	notificationText = text;
	curNotify = Instantiate(notification);
	curNotify.transform.position.z = -3.5;
}

function DifficultSpeedCheck() {
	if(speedProgress >= speedChangeAmount)
	{
		if(!Master.hardMode)
		{
			speed = Mathf.MoveTowards(speed,6,1);
			difficulty = 1;
		}
		else
		{
			speed = Mathf.MoveTowards(speed,8,.5);
			difficulty = 2;
		}
		AudioManager.PlaySound(Master.currentWorld.audio.speedUp);
		Notify("Speed\nUp!");
		notified = true;
		speedProgress = 0;
	}
	else if(difficultyProgress >= difficultyChangeAmount) 
	{
		difficulty = Mathf.MoveTowards(difficulty,3,1);
		difficultyProgress = 0;
	}
	UI.BroadcastMessage("SpeedChange", Mathf.Floor(speed),SendMessageOptions.DontRequireReceiver);
}

function BroadcastArray(array:GameObject[],message:String,input:String){
	for(var object:GameObject in array)
	{
		object.BroadcastMessage(message,input,SendMessageOptions.DontRequireReceiver);
	}
}

function PlayCurrentMusic () {
	if(Master.currentWorld.audio.music.length > speed-1)
	{
		AudioManager.PlaySong(Master.currentWorld.audio.music[speed-1]);
	}
	else
	{
		AudioManager.PlaySong(Master.currentWorld.audio.music[Master.currentWorld.audio.music.length-1]);
	}
}

function TurnOnNotification (newNotification:String) {
	tutorialText = newNotification;
	tutorialize = true;
}

function TutorialNotification (notificationText:String) {
	paused = true;
	fade.material.color.a = .5;
	Time.timeScale = 0;
	Camera.main.GetComponent(Master).LaunchNotification(notificationText,NotificationType.tutorial);
	while(Master.notifying)
	{
		yield;
	}
	fade.material.color.a = 0;
	Time.timeScale = 1;
	paused = false;
	tutorialize = false;
}