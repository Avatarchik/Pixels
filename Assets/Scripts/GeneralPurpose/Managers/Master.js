	#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

import UnityEngine.SocialPlatforms;

static var initialLoad:boolean;

public enum WorldSelect{PackingPeanutFactory,Museum,Theater,HighSchool,Neverland,GameDev,Arcade,UnlockWheel,Remix};

static var lives:int;
static var paused:boolean;
static var lastScore:int;
static var counter:float;
static var demo:boolean;
static var unlockAll:boolean;
static var hardMode:boolean;
static var unlockLevels:int[];

@HideInInspector var numberOfHours:int;
static var device:String;
static var vertical:boolean;

@HideInInspector var showSelectedWorld:World;
@HideInInspector var showUnlockLevels:int[];

var varNames:String[];
var settings:Options;
var arcadeGames:ArcadeGame[];
var worlds:World[];
var worldOptions:WorldOptions;
static var currentWorld:World;

var notification:GameObject;
var unlockSaveNote:GameObject;
static var notifying:boolean;
static var mapNotifyWorlds:String[];
static var showWorldTitle:boolean;
static var worldCoverOn:boolean;
static var inCutscene:boolean;

static var allowShow:boolean;

static var date:String;

function Awake () {
	
	numberOfHours = .5;
	
	showWorldTitle = false;
	Time.timeScale = 1;
	WorldOptions();
	vertical = false;
	demo = false;
	unlockAll = false;
	notifying = false;
	worldCoverOn = false;
	inCutscene = false;
	allowShow = false;
	mapNotifyWorlds = new String[0];
	if(settings.unlockEverything){unlockAll=true;}
	
	// Sets initial variables for worlds.
	unlockLevels = new int[6];
	currentWorld = worlds[3];
	lives = 3;
	paused = false;
	initialLoad = true;
	hardMode = false;
	
	// Set iOS device settings, including framerate and permitted orientations, and find Top and Bottom objects.
	if(CheckDeviceType("4:3"))
	{
		device = "4:3";
	}
	else if(CheckDeviceType("16:9"))
	{
		device = "16:9";
	}
	else 
	{
		device = "16:9";
	}
	
	Application.targetFrameRate = 60;
	Screen.orientation = ScreenOrientation.AutoRotation; 
	Screen.autorotateToLandscapeLeft = true;
	Screen.autorotateToLandscapeRight = true; 
	Screen.autorotateToPortrait = true;
	Screen.autorotateToPortraitUpsideDown = true;
	Screen.sleepTimeout = SleepTimeout.NeverSleep;
	
	DontDestroyOnLoad(gameObject);
	Initialize();
	CheckForShowTime();
	Social.localUser.Authenticate (ProcessAuthentication);
	PushNotificationRegistration();
	if(Application.loadedLevelName == "GameStart")
	{
		Application.LoadLevel("TitleScreen");
	}
}

function Start () {
	if(settings.demoMode)
	{
		demo = true;
		StartCoroutine(Demo());
	}
}

function Update () {
	showSelectedWorld = currentWorld;
	showUnlockLevels = unlockLevels;
	CheckOrientation();
	
	if(vertical) 
	{
		switch(device)
		{
			case "16:9":
				break;
			case "4:3":
				break;
			default:
				break;
		}
		if(device == "4:3")
		{
			GetComponent.<Camera>().orthographicSize = 16;
		}
		else
		{
			GetComponent.<Camera>().orthographicSize = 16;
		}
	}
	else
	{
		if(device == "4:3")
		{
			GetComponent.<Camera>().orthographicSize = 12;
		}
		else
		{
			GetComponent.<Camera>().orthographicSize = 9;
		}
	}
}

function CheckOrientation () {
	if(Screen.width/Screen.height >= 1)
	{
		vertical = false;
	}
	else
	{
		vertical = true;
	}
}

function CheckForShowTime () {
	while(true)
	{
		allowShow = false;
		date = System.DateTime.Today.Day + " " + System.DateTime.Today.Month + " " + System.DateTime.Today.Year;
		if(settings.alwaysPerform)
		{
			allowShow = true;
		}
		else if(ObscuredPrefs.GetInt("HighSchool") == 1 && ObscuredPrefs.GetInt("ShowDate:"+date) != 1 && System.DateTime.Now.Hour == 14)
		{
			allowShow = true;
		}
		yield WaitForSeconds(10);
	}
}
// This function returns the device type to adjust the screen size (and borders) for iPad and older iPhone models.
function CheckDeviceType(search:String):boolean {
	switch(search)
	{
		case "4:3":
			if(Mathf.Abs(((Screen.width * 1.0)/(Screen.height * 1.0))-1.333) <.1 || Mathf.Abs(((Screen.height * 1.0)/(Screen.width * 1.0))-1.333)<.1)
			{	
				return true;
			}
			else
			{
				return false;
			}
			break;
		case "16:9":
			if(Mathf.Abs(((Screen.width * 1.0)/(Screen.height * 1.0))-.5625)<.1 || Mathf.Abs(((Screen.height * 1.0)/(Screen.width * 1.0))-.5625)<.1)
			{	
				return true;
			}
			else
			{
				return false;
			}
			break;
		default:
			return false;
			break;
	}
		
}

function Demo () {
	var resetTimer:float = settings.resetTime;
	counter = settings.demoTime;
	ObscuredPrefs.SetInt("CurrencyNumber",1000);
	while(true)
	{
		if(Input.GetKey("down") && Input.GetKey("m"))
		{
			ObscuredPrefs.SetInt("CurrencyNumber",Mathf.Max(ObscuredPrefs.GetInt("CurrencyNumber") - 10,0));
		}
		else if(Input.GetKey("up") && Input.GetKey("m"))
		{
			ObscuredPrefs.SetInt("CurrencyNumber",ObscuredPrefs.GetInt("CurrencyNumber") + 10);
		}
		if(Finger.GetExists(0))
		{
			resetTimer = 20;
			if((Finger.GetPosition(0).x < -13 && Finger.GetPosition(0).y > 6.5) || (Finger.GetPosition(0).x < -6 && Finger.GetPosition(0).y > 13.5))
			{
				counter -= Time.deltaTime;
			}
			if((Finger.GetPosition(0).x < -13 && Finger.GetPosition(0).y < -6.5) || (Finger.GetPosition(0).x > -6 && Finger.GetPosition(0).y < -13.5))
			{
				counter += Time.deltaTime;
			}
		}
		else
		{
			counter = settings.demoTime;
			if(!inCutscene && settings.resetTime > 0)
			{
				resetTimer -= Time.deltaTime;
			}
		}
		if(counter < 0 || resetTimer < 0)
		{
			ResetGame();
		}
		else if (counter > settings.demoTime * 2)
		{
			settings.unlockEverything = true;
			unlockAll = true;
			Initialize();
			UnlockAllOptions();
			ObscuredPrefs.SetInt("CurrencyNumber", 1000);
			AudioManager.StopAll(0);
			Application.LoadLevel("TitleScreen");
		}
		yield;
	}
}

function ResetGame () {
	DeleteAllValues();
	AudioManager.StopAll(0);
	Application.LoadLevel("GameStart");
	Destroy(gameObject);
}

function Initialize () {
	///////////////////////////////////////////////////////////////////////// Testing information.
	if(settings.quickProgress)
	{
		unlockLevels = [0,2,5,7,10,100];
	}
	else
	{
		unlockLevels = [0,14,24,34,70,100];
	}
	if(settings.eraseOnLoad)
	{
		DeleteAllValues();
	}
	if(ObscuredPrefs.GetInt("SaveSystemAvailable") == 0 && CurrentTick() - ObscuredPrefs.GetInt("LastClosedTime") >= 36 * numberOfHours)
	{
		DeleteAllValues();
	}
	CheckArcadeUnlocks();
	if(unlockAll)
	{
		UnlockArcadeGames(true);
		UnlockAllOptions();
		UnlockCustomizeOptions();
	}
	for(var i:int = 0; i < worlds.length; i++)
	{
		if(!ObscuredPrefs.HasKey(worlds[i].basic.worldNameVar))
		{
			ObscuredPrefs.SetInt(worlds[i].basic.worldNameVar, 0);
		}
		for(var varName:int = 0; varName < varNames.length; varName++)
		{
			if(!ObscuredPrefs.HasKey(worlds[i].basic.worldNameVar+varNames[varName]))
			{
				ObscuredPrefs.SetInt(worlds[i].basic.worldNameVar+varNames[varName], 0);
			}
		}
	}
	for(i = 0; i < settings.customizationPieces.length; i++)
	{
		if(!ObscuredPrefs.HasKey(settings.customizationPieces[i].GetComponent(VariablePrefix).variablePrefix+settings.customizationPieces[i].transform.name))
		{
			ObscuredPrefs.SetInt(settings.customizationPieces[i].GetComponent(VariablePrefix).variablePrefix+settings.customizationPieces[i].transform.name,0);
		}
	}
	ObscuredPrefs.SetInt("PackingPeanutFactory", 1);
	
	///////////////////////////////////////////////////////////////////////// IAP variables.
	if(!ObscuredPrefs.HasKey("SaveSystemAvailable"))
	{
		ObscuredPrefs.SetInt("SaveSystemAvailable", 0);
	}
	if(!ObscuredPrefs.HasKey("PaidSongOneUnlocked"))
	{
		ObscuredPrefs.SetInt("PaidSongOneUnlocked", 0);
	}
	if(!ObscuredPrefs.HasKey("PaidSongTwoUnlocked"))
	{
		ObscuredPrefs.SetInt("PaidSongTwoUnlocked", 0);
	}
	if(!ObscuredPrefs.HasKey("IAPBeggingNumber"))
	{
		ObscuredPrefs.SetInt("IAPBeggingNumber", 0);
	}
	///////////////////////////////////////////////////////////////////////// Overall status variables.
	if(!ObscuredPrefs.HasKey("LastWorldVisited"))
	{
		ObscuredPrefs.SetString("LastWorldVisited", "PackingPeanutFactory");
	}
	if(!ObscuredPrefs.HasKey("CurrencyNumber"))
	{
		ObscuredPrefs.SetInt("CurrencyNumber", 0);
	}
	if(!ObscuredPrefs.HasKey("TutorialFinished"))
	{
		ObscuredPrefs.SetInt("TutorialFinished", 0);
	}
	if(!ObscuredPrefs.HasKey("WorldMapState"))
	{
		ObscuredPrefs.SetInt("WorldMapState", 0);
	}
	///////////////////////////////////////////////////////////////////////// Options variables.
	if(!ObscuredPrefs.HasKey("Sound"))
	{
		ObscuredPrefs.SetInt("Sound", 1);
	}
	if(!ObscuredPrefs.HasKey("Music"))
	{
		ObscuredPrefs.SetInt("Music", 1);
	}
	///////////////////////////////////////////////////////////////////////// Character selection variables.
	if(!ObscuredPrefs.HasKey("HairSelection"))
	{
		ObscuredPrefs.SetInt("HairSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("HairColor"))
	{
		ObscuredPrefs.SetInt("HairColor", 0);
	}
	if(!ObscuredPrefs.HasKey("EyesSelection"))
	{
		ObscuredPrefs.SetInt("EyesSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("EyeColor"))
	{
		ObscuredPrefs.SetInt("EyeColor", 0);
	}
	if(!ObscuredPrefs.HasKey("TopSelection"))
	{
		ObscuredPrefs.SetInt("TopSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("TopColor"))
	{
		ObscuredPrefs.SetInt("TopColor", 1);
	}
	if(!ObscuredPrefs.HasKey("BottomSelection"))
	{
		ObscuredPrefs.SetInt("BottomSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("BottomColor"))
	{
		ObscuredPrefs.SetInt("BottomColor", 0);
	}
	if(!ObscuredPrefs.HasKey("BodyColor"))
	{
		ObscuredPrefs.SetInt("BodyColor", 0);
	}
	///////////////////////////////////////////////////////////////////////// Theater Theater selection variables.
	if(!ObscuredPrefs.HasKey("StageWallSelection"))
	{
		ObscuredPrefs.SetInt("StageWallSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("StageFloorSelection"))
	{
		ObscuredPrefs.SetInt("StageFloorSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("CeilingSelection"))
	{
		ObscuredPrefs.SetInt("CeilingSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("TheaterWallSelection"))
	{
		ObscuredPrefs.SetInt("TheaterWallSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("TheaterFloorSelection"))
	{
		ObscuredPrefs.SetInt("TheaterFloorSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("CurtainSelection"))
	{
		ObscuredPrefs.SetInt("CurtainSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("ChairsSelection"))
	{
		ObscuredPrefs.SetInt("ChairsSelection", 0);
	}
	///////////////////////////////////////////////////////////////////////// Theater FOH selection variables.
	if(!ObscuredPrefs.HasKey("FOHWallSelection"))
	{
		ObscuredPrefs.SetInt("FOHWallSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("FOHFloorSelection"))
	{
		ObscuredPrefs.SetInt("FOHFloorSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("FOHBoozeSelection"))
	{
		ObscuredPrefs.SetInt("FOHBoozeSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("FOHTicketBoothSelection"))
	{
		ObscuredPrefs.SetInt("FOHTicketBoothSelection", 0);
	}
	if(!ObscuredPrefs.HasKey("FOHDeskSelection"))
	{
		ObscuredPrefs.SetInt("FOHDeskSelection", 0);
	}
	if(ObscuredPrefs.GetInt("HighSchoolBeatEndPlayed") == 1)
	{
		ObscuredPrefs.SetInt("WorldMapState",1);
	}
}

function UnlockCustomizeOptions() {
	for(var i:int = 0; i < settings.customizationPieces.length; i++)
	{
		ObscuredPrefs.SetInt(settings.customizationPieces[i].GetComponent(VariablePrefix).variablePrefix+settings.customizationPieces[i].transform.name,1);
	}
}

function UnlockAllOptions () {
	DeleteAllValues();
	ObscuredPrefs.SetInt("TutorialFinished",2);
	ObscuredPrefs.SetInt("WorldMapState",2);
	ObscuredPrefs.SetInt("FirstThingUnlocked",1);
	for(var aWorld:World in worlds)
	{
		var worldName:String;
		worldName = aWorld.basic.worldNameVar;
		
		ObscuredPrefs.SetInt("SaveSystemAvailable", 1);
		ObscuredPrefs.SetInt("PaidSongOneUnlocked", 1);
		ObscuredPrefs.SetInt("PaidSongTwoUnlocked", 1);
	    ///////////////////////////////////////////////////////////////////// World unlock variables.
		if(!ObscuredPrefs.HasKey(worldName))
		{
			ObscuredPrefs.SetInt(worldName, 1);
		}
		///////////////////////////////////////////////////////////////////// World reward variables.
		if(!ObscuredPrefs.HasKey(worldName+"Unlocks"))
		{
			ObscuredPrefs.SetInt(worldName+"Unlocks", 3);
		}
		///////////////////////////////////////////////////////////////////// World high score variables.
		if(!ObscuredPrefs.HasKey(worldName)+"HighScore")
		{
			ObscuredPrefs.SetInt(worldName+"HighScore", 50);
		}
		if(!ObscuredPrefs.HasKey(worldName)+"HighScoreHard")
		{
			ObscuredPrefs.SetInt(worldName+"HighScoreHard", 50);
		}
		///////////////////////////////////////////////////////////////////// World visit variables.
		if(!ObscuredPrefs.HasKey(worldName)+"PlayedOnce")
		{
			ObscuredPrefs.SetInt(worldName+"PlayedOnce", 1);
		}
		if(!ObscuredPrefs.HasKey(worldName)+"Beaten")
		{
			ObscuredPrefs.SetInt(worldName+"Beaten", 1);
		}
		for(var varName:int = 0; varName < varNames.length; varName++)
		{
			if(!ObscuredPrefs.HasKey(aWorld.basic.worldNameVar+varNames[varName]))
			{
				ObscuredPrefs.SetInt(aWorld.basic.worldNameVar+varNames[varName], 1);
			}
		}
	}
	ObscuredPrefs.SetInt("HairSelection",0);
	ObscuredPrefs.SetInt("EyesSelection",0);
	ObscuredPrefs.SetInt("TopSelection",0);
	ObscuredPrefs.SetInt("BottomSelection",0);
	UnlockCustomizeOptions();
}

class BasicVariables {
	var world:WorldSelect;
	var playbillNormal:Texture;
	var playbillEvil:Texture;
	var worldNameFull:String;
	var worldNameVar:String;
	var topLine:String;
	var games:GameObject[];
	var bossGame:GameObject;
	var covers:GameObject[];
	var colors:Color[];
	var UI:GameObject;
	var successObject:GameObject;
}

class TextVariables {
	var firstOpening:GameObject;
	var regularOpening:GameObject;
	var end1:GameObject;
	var end2:GameObject;
	var end3:GameObject;
	var end4:GameObject;
	var beatEnd:GameObject;
}

class AudioVariables {
	var transitionIn:AudioClip;
	var transitionOut:AudioClip;
	var speedUp:AudioClip;
	var success:AudioClip;
	var failure:AudioClip;
	var bossGameSounds:AudioClip[];
	var music:AudioClip[];
}

class UnlockVariables {
	var unlocksLevel1:String[];
	var unlocksLevel2:String[];
	var unlocksLevel3:float;
	var unlockNotificationTextLine1:String[];
	var unlockNotificationTextLine2:String[];
	var unlockIcons:Sprite[];
}

class World {
	var nameOfWorld:String;
	var basic:BasicVariables;
	var text:TextVariables;
	var audio:AudioVariables;
	var unlocks:UnlockVariables;
}

class WorldOptions {
	var switchWorlds:boolean;
	var switchSpot1:int;
	var switchSpot2:int;
	var insertWorld:boolean;
	var insertSpot:int;
}

class Options {
	var quickProgress:boolean;
	var unlockEverything:boolean;
	var eraseOnLoad:boolean;
	var alwaysPerform:boolean;
	var demoMode:boolean;
	var demoTime:float;
	var resetTime:float;
	var customizationPieces:GameObject[];
	var economy:Economy;
}

class Economy {
	var regularGameValue:int;
	var hardGameValue:int;
	var minimumUnlockCost:int;
	var maximumUnlockCost:int;
}

function WorldOptions () {
	if(worldOptions.switchWorlds)
	{
		var newWorld:World;
		newWorld = worlds[worldOptions.switchSpot1];
		worlds[worldOptions.switchSpot1] = worlds[worldOptions.switchSpot2];
		worlds[worldOptions.switchSpot2] = newWorld;
	}
	if(worldOptions.insertWorld)
	{
		var newArray:World[];
		newArray = new World[worlds.length + 1];
		for(var i:int = 0; i < newArray.length; i++)
		{
			if(i > worldOptions.insertSpot)
			{
				newArray[i] = worlds[i-1];
			}
			else
			{
				newArray[i] = worlds[i];
			}
		}
		worlds = newArray;
	}
}

class ArcadeGame {
	var name:String;
	var game:GameObject;
	var cabinet:Sprite;
	var paidUnlockCost:int;
	var unlockText:String;
	var playCost:int;
	var audioCues:AudioClip[];
	@HideInInspector var highScore:float;
}

function CheckArcadeUnlocks () {
	for(var thisGame:ArcadeGame in arcadeGames)
	{
		if(!ObscuredPrefs.HasKey("Arcade"+thisGame.name))
		{
			ObscuredPrefs.SetInt("Arcade"+thisGame.name,0);
		}	
		if(!ObscuredPrefs.HasKey("Arcade"+thisGame.name+"Score"))
		{
			ObscuredPrefs.SetFloat("Arcade"+thisGame.name+"Score",0);
		}	
		thisGame.highScore = ObscuredPrefs.GetFloat("Arcade"+thisGame.name+"Score");
	}
}

function UnlockArcadeGames (all:boolean) {
	UnlockArcadeGames("N/A",all);
}
function UnlockArcadeGames (gameName:String) {
	UnlockArcadeGames(gameName,false);
}
function UnlockArcadeGames (gameName:String,all:boolean) {
	if(all)
	{
		for(var thisGame:ArcadeGame in arcadeGames)
		{
			ObscuredPrefs.SetInt("Arcade"+thisGame.name,1);
			ObscuredPrefs.SetFloat("Arcade"+thisGame.name+"Score",0);
			thisGame.highScore = ObscuredPrefs.GetFloat("Arcade"+thisGame.name+"Score");
		}
	}
	else
	{
		var specificGame:ArcadeGame;
		for(var thisGame:ArcadeGame in arcadeGames)
		{
			if(thisGame.name == gameName)
			{
				specificGame = thisGame;
			}
		}
		ObscuredPrefs.SetInt("Arcade"+specificGame.name,1);
		ObscuredPrefs.SetFloat("Arcade"+specificGame.name+"Score",0);
		specificGame.highScore = ObscuredPrefs.GetFloat("Arcade"+specificGame.name);
	}
}

function LaunchNotification (text:String,type:NotificationType):IEnumerator {
	if(!notifying)
	{
		notifying = true;
		var newNotification:GameObject;
		newNotification = Instantiate(notification);
		newNotification.GetComponent(NotificationManager).SetType(text,type);
		while(newNotification!=null)
		{
			yield;
		}
		notifying = false;
	}
}

function ProcessAuthentication (success: boolean) {
	if (success) 
	{
		//Debug.Log ("Authenticated");
		//Debug.Log (Social.localUser.userName);
	}
	else
	{
		//Debug.Log ("Failed to authenticate");
	}
}

function PushNotificationRegistration () {
	iOS.NotificationServices.RegisterForNotifications(iOS.NotificationType.Alert);
	iOS.NotificationServices.ClearLocalNotifications();
	iOS.NotificationServices.CancelAllLocalNotifications();
	if(ObscuredPrefs.GetInt("HighSchool") == 1)
	{
		for(var i:int = 0; i < 8; i++)
		{
			var newNotif:iOS.LocalNotification;
			newNotif = new iOS.LocalNotification();
			newNotif.alertBody = "The show is on!";
			/*
			if(System.DateTime.Today.AddDays(i).DayOfWeek == System.DayOfWeek.Monday || System.DateTime.Today.AddDays(i).DayOfWeek == System.DayOfWeek.Tuesday || System.DateTime.Today.AddDays(i).DayOfWeek == System.DayOfWeek.Wednesday || System.DateTime.Today.AddDays(i).DayOfWeek == System.DayOfWeek.Thursday || System.DateTime.Today.AddDays(i).DayOfWeek == System.DayOfWeek.Friday)
			{
				newNotif.fireDate = System.DateTime.Today.AddDays(i).AddHours(19);
			}
			else
			{
				newNotif.fireDate = System.DateTime.Today.AddDays(i).AddHours(14);
			}*/
			newNotif.fireDate = System.DateTime.Today.AddDays(i).AddHours(19);
			iOS.NotificationServices.ScheduleLocalNotification(newNotif);
		}
	}
}

function CurrentTick ():int {
	var  currentTick:System.Int64 = System.DateTime.Now.Ticks;
	currentTick /= 1000000000;
	while(currentTick > 10000000)
	{
		currentTick -= 10000000;
	}
	return currentTick;
}

function SetLastTick (closed:boolean) {
	if(closed)
	{
		ObscuredPrefs.SetInt("LastClosedTime",CurrentTick() - 16);
	}
	else
	{
		ObscuredPrefs.SetInt("LastClosedTime",CurrentTick());	
	}
}

function OnApplicationPause (pause:boolean) {
	if(pause)
	{
		SetLastTick(false);
	}
	else
	{
		if(ObscuredPrefs.GetInt("SaveSystemAvailable") == 0 && CurrentTick() - ObscuredPrefs.GetInt("LastClosedTime") >= 36 * numberOfHours)
		{
			ResetGame();
		}
	}
}

function OnApplicationFocus (focus:boolean) {
	if(focus)
	{
		if(ObscuredPrefs.GetInt("SaveSystemAvailable") == 0 && CurrentTick() - ObscuredPrefs.GetInt("LastClosedTime") >= 36 * numberOfHours)
		{
			ResetGame();
		}
	}
	else
	{
		SetLastTick(false);
	}
}

function OnApplicationQuit () {
	SetLastTick(true);
}


function DeleteAllValues () {
	if(settings.eraseOnLoad)
	{
		ObscuredPrefs.DeleteAll();
	}
	else
	{
		var beggingNumber:int = ObscuredPrefs.GetInt("IAPBeggingNumber");
		var saveSystem:int = ObscuredPrefs.GetInt("SaveSystemAvailable");
		var paidSongOne:int = ObscuredPrefs.GetInt("PaidSongOneUnlocked");
		var paidSongTwo:int = ObscuredPrefs.GetInt("PaidSongTwoUnlocked");
		ObscuredPrefs.DeleteAll();
		ObscuredPrefs.SetInt("IAPBeggingNumber",beggingNumber);
		ObscuredPrefs.SetInt("SaveSystemAvailable",saveSystem);
		ObscuredPrefs.SetInt("PaidSongOneUnlocked",paidSongOne);
		ObscuredPrefs.SetInt("PaidSongTwoUnlocked",paidSongTwo);
	}
}