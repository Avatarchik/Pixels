	#pragma strict

import UnityEngine.SocialPlatforms;

import System.Runtime.InteropServices;

static var initialLoad:boolean;

public enum WorldSelect{PackingPeanutFactory,Museum,Theater,HighSchool,Neverland,GameDev,Arcade,UnlockWheel,Remix,AptFour,Movies,Mother,Finale,PostShow};

static var lives:int;
static var paused:boolean;
static var lastScore:int;
static var counter:float;
static var demo:boolean;
static var unlockAll:boolean;
static var hardMode:boolean;
static var unlockLevels:int[];

@HideInInspector var numberOfHours:float;
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

static var resetting:boolean;
static var comScoreCalled:boolean;

@HideInInspector var newNotification:GameObject;

function Awake () {
	resetting = false;
	comScoreCalled = false;
	numberOfHours = .26;
	
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
		else if(PlayerPrefs.GetInt("HighSchool") == 1 && PlayerPrefs.GetInt("ShowDate:"+date) != 1 && System.DateTime.Now.Hour == 19)
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
	PlayerPrefs.SetInt("CurrencyNumber",1000);
	while(true)
	{
		if(Input.GetKey("down") && Input.GetKey("m"))
		{
			PlayerPrefs.SetInt("CurrencyNumber",Mathf.Max(PlayerPrefs.GetInt("CurrencyNumber") - 10,0));
		}
		else if(Input.GetKey("up") && Input.GetKey("m"))
		{
			PlayerPrefs.SetInt("CurrencyNumber",PlayerPrefs.GetInt("CurrencyNumber") + 10);
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
			PlayerPrefs.SetInt("CurrencyNumber", 1000);
			AudioManager.StopAll(0);
			Application.LoadLevel("TitleScreen");
		}
		yield;
	}
}

function ResetGame () {
	if(!resetting)
	{
		//Destroy(GameObject.Find("IOSInAppPurchaseManager"));
		resetting = true;
		DeleteAllValues();
		AudioManager.StopAll(0);
		Destroy(gameObject);
		Application.LoadLevel("GameStart");
		SetLastTick();
	}
}

function EraseGameButton () {
	ResetGame();
	/*
	if(!resetting)
	{
		Destroy(GameObject.Find("IOSInAppPurchaseManager"));
		resetting = true;
		DeleteAllValues();
		AudioManager.StopAll(0);
		SetLastTick();
		Application.Quit();
	}
	*/
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
	CheckArcadeUnlocks();
	if(unlockAll)
	{
		UnlockArcadeGames(true);
		UnlockAllOptions();
		UnlockCustomizeOptions(true);
	}
	for(var i:int = 0; i < worlds.length; i++)
	{
		if(!PlayerPrefs.HasKey(worlds[i].basic.worldNameVar))
		{
			PlayerPrefs.SetInt(worlds[i].basic.worldNameVar, 0);
		}
		for(var varName:int = 0; varName < varNames.length; varName++)
		{
			if(!PlayerPrefs.HasKey(worlds[i].basic.worldNameVar+varNames[varName]))
			{
				PlayerPrefs.SetInt(worlds[i].basic.worldNameVar+varNames[varName], 0);
			}
		}
	}
	for(i = 0; i < settings.customizationPieces.length; i++)
	{
		if(!PlayerPrefs.HasKey(settings.customizationPieces[i].GetComponent(VariablePrefix).variablePrefix+settings.customizationPieces[i].transform.name))
		{
			PlayerPrefs.SetInt(settings.customizationPieces[i].GetComponent(VariablePrefix).variablePrefix+settings.customizationPieces[i].transform.name,0);
		}
	}
	PlayerPrefs.SetInt("PackingPeanutFactory", 1);
	
	///////////////////////////////////////////////////////////////////////// IAP variables.
	if(!PlayerPrefs.HasKey("SaveSystemAvailable"))
	{
		PlayerPrefs.SetInt("SaveSystemAvailable", 0);
	}
	if(!PlayerPrefs.HasKey("PaidSongOneUnlocked"))
	{
		PlayerPrefs.SetInt("PaidSongOneUnlocked", 0);
	}
	if(!PlayerPrefs.HasKey("PaidSongTwoUnlocked"))
	{
		PlayerPrefs.SetInt("PaidSongTwoUnlocked", 0);
	}
	if(!PlayerPrefs.HasKey("IAPBeggingNumber"))
	{
		PlayerPrefs.SetInt("IAPBeggingNumber", 0);
	}
	///////////////////////////////////////////////////////////////////////// Overall status variables.
	if(!PlayerPrefs.HasKey("LastWorldVisited"))
	{
		PlayerPrefs.SetString("LastWorldVisited", "PackingPeanutFactory");
	}
	if(!PlayerPrefs.HasKey("CurrencyNumber"))
	{
		PlayerPrefs.SetInt("CurrencyNumber", 0);
	}
	if(!PlayerPrefs.HasKey("TutorialFinished"))
	{
		PlayerPrefs.SetInt("TutorialFinished", 0);
	}
	if(!PlayerPrefs.HasKey("WorldMapState"))
	{
		PlayerPrefs.SetInt("WorldMapState", 0);
	}
	///////////////////////////////////////////////////////////////////////// Options variables.
	if(!PlayerPrefs.HasKey("Sound"))
	{
		PlayerPrefs.SetInt("Sound", 1);
	}
	if(!PlayerPrefs.HasKey("Music"))
	{
		PlayerPrefs.SetInt("Music", 1);
	}
	///////////////////////////////////////////////////////////////////////// Character selection variables.
	if(!PlayerPrefs.HasKey("HairSelection"))
	{
		PlayerPrefs.SetInt("HairSelection", 0);
	}
	if(!PlayerPrefs.HasKey("HairColor"))
	{
		PlayerPrefs.SetInt("HairColor", 0);
	}
	if(!PlayerPrefs.HasKey("EyesSelection"))
	{
		PlayerPrefs.SetInt("EyesSelection", 0);
	}
	if(!PlayerPrefs.HasKey("EyeColor"))
	{
		PlayerPrefs.SetInt("EyeColor", 0);
	}
	if(!PlayerPrefs.HasKey("TopSelection"))
	{
		PlayerPrefs.SetInt("TopSelection", 0);
	}
	if(!PlayerPrefs.HasKey("TopColor"))
	{
		PlayerPrefs.SetInt("TopColor", 1);
	}
	if(!PlayerPrefs.HasKey("BottomSelection"))
	{
		PlayerPrefs.SetInt("BottomSelection", 0);
	}
	if(!PlayerPrefs.HasKey("BottomColor"))
	{
		PlayerPrefs.SetInt("BottomColor", 0);
	}
	if(!PlayerPrefs.HasKey("BodyColor"))
	{
		PlayerPrefs.SetInt("BodyColor", 0);
	}
	///////////////////////////////////////////////////////////////////////// Theater Theater selection variables.
	if(!PlayerPrefs.HasKey("StageWallSelection"))
	{
		PlayerPrefs.SetInt("StageWallSelection", 0);
	}
	if(!PlayerPrefs.HasKey("StageFloorSelection"))
	{
		PlayerPrefs.SetInt("StageFloorSelection", 0);
	}
	if(!PlayerPrefs.HasKey("CeilingSelection"))
	{
		PlayerPrefs.SetInt("CeilingSelection", 0);
	}
	if(!PlayerPrefs.HasKey("TheaterWallSelection"))
	{
		PlayerPrefs.SetInt("TheaterWallSelection", 0);
	}
	if(!PlayerPrefs.HasKey("TheaterFloorSelection"))
	{
		PlayerPrefs.SetInt("TheaterFloorSelection", 0);
	}
	if(!PlayerPrefs.HasKey("CurtainSelection"))
	{
		PlayerPrefs.SetInt("CurtainSelection", 0);
	}
	if(!PlayerPrefs.HasKey("ChairsSelection"))
	{
		PlayerPrefs.SetInt("ChairsSelection", 0);
	}
	///////////////////////////////////////////////////////////////////////// Theater FOH selection variables.
	if(!PlayerPrefs.HasKey("FOHWallSelection"))
	{
		PlayerPrefs.SetInt("FOHWallSelection", 0);
	}
	if(!PlayerPrefs.HasKey("FOHFloorSelection"))
	{
		PlayerPrefs.SetInt("FOHFloorSelection", 0);
	}
	if(!PlayerPrefs.HasKey("FOHBoozeSelection"))
	{
		PlayerPrefs.SetInt("FOHBoozeSelection", 0);
	}
	if(!PlayerPrefs.HasKey("FOHTicketBoothSelection"))
	{
		PlayerPrefs.SetInt("FOHTicketBoothSelection", 0);
	}
	if(!PlayerPrefs.HasKey("FOHDeskSelection"))
	{
		PlayerPrefs.SetInt("FOHDeskSelection", 0);
	}
	if(PlayerPrefs.GetInt("HighSchoolBeatEndPlayed") == 1)
	{
		PlayerPrefs.SetInt("WorldMapState",1);
	}
}

function UnlockCustomizeOptions(unlock:boolean) {
	var valuePref:int = 0;
	if(unlock)
	{
		valuePref = 1;
	}
	for(var i:int = 0; i < settings.customizationPieces.length; i++)
	{
		PlayerPrefs.SetInt(settings.customizationPieces[i].GetComponent(VariablePrefix).variablePrefix+settings.customizationPieces[i].transform.name,valuePref);
	}
}

function UnlockAllOptions () {
	DeleteAllValues();
	PlayerPrefs.SetInt("TutorialFinished",2);
	PlayerPrefs.SetInt("WorldMapState",2);
	PlayerPrefs.SetInt("FirstThingUnlocked",1);
	PlayerPrefs.SetInt("ActOneFinished",1);
	for(var aWorld:World in worlds)
	{
		var worldName:String;
		worldName = aWorld.basic.worldNameVar;
		
		PlayerPrefs.SetInt("SaveSystemAvailable", 1);
		PlayerPrefs.SetInt("PaidSongOneUnlocked", 1);
		PlayerPrefs.SetInt("PaidSongTwoUnlocked", 1);
	    ///////////////////////////////////////////////////////////////////// World unlock variables.
		PlayerPrefs.SetInt(worldName, 1);
		///////////////////////////////////////////////////////////////////// World reward variables.
		PlayerPrefs.SetInt(worldName+"Unlocks", 3);
		///////////////////////////////////////////////////////////////////// World high score variables.
		PlayerPrefs.SetInt(worldName+"HighScore", 50);
		PlayerPrefs.SetInt(worldName+"HighScoreHard", 50);
		///////////////////////////////////////////////////////////////////// World visit variables.
		PlayerPrefs.SetInt(worldName+"PlayedOnce", 1);
		PlayerPrefs.SetInt(worldName+"Beaten", 1);
		for(var varName:int = 0; varName < varNames.length; varName++)
		{
			PlayerPrefs.SetInt(aWorld.basic.worldNameVar+varNames[varName], 1);
		}
	}
	PlayerPrefs.SetInt("HairSelection",0);
	PlayerPrefs.SetInt("EyesSelection",0);
	PlayerPrefs.SetInt("TopSelection",0);
	PlayerPrefs.SetInt("BottomSelection",0);
	PlayerPrefs.SetInt("HairColor", 0);
	PlayerPrefs.SetInt("EyeColor", 0);
	PlayerPrefs.SetInt("TopColor", 1);
	PlayerPrefs.SetInt("BottomColor", 0);
	PlayerPrefs.SetInt("BodyColor", 0);
	UnlockCustomizeOptions(true);
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
	var displayName:String;
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
		if(!PlayerPrefs.HasKey("Arcade"+thisGame.name))
		{
			PlayerPrefs.SetInt("Arcade"+thisGame.name,0);
		}	
		if(!PlayerPrefs.HasKey("Arcade"+thisGame.name+"Score"))
		{
			PlayerPrefs.SetFloat("Arcade"+thisGame.name+"Score",0);
		}	
		thisGame.highScore = PlayerPrefs.GetFloat("Arcade"+thisGame.name+"Score");
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
			PlayerPrefs.SetInt("Arcade"+thisGame.name,1);
			PlayerPrefs.SetFloat("Arcade"+thisGame.name+"Score",0);
			thisGame.highScore = PlayerPrefs.GetFloat("Arcade"+thisGame.name+"Score");
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
		PlayerPrefs.SetInt("Arcade"+specificGame.name,1);
		PlayerPrefs.SetFloat("Arcade"+specificGame.name+"Score",0);
		specificGame.highScore = PlayerPrefs.GetFloat("Arcade"+specificGame.name);
	}
}

function LaunchNotification (text:String,type:NotificationType):IEnumerator {
	if(!notifying)
	{
		notifying = true;
		newNotification = Instantiate(notification);
		newNotification.GetComponent(NotificationManager).SetType(text,type);
		while(newNotification!=null)
		{
			yield;
		}
		notifying = false;
	}
}

function ChangeNotificationText (text:String) {
	newNotification.GetComponent(TextMesh).text = text;
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
	if(PlayerPrefs.GetInt("HighSchool") == 1)
	{
		for(var i:int = 0; i < 8; i++)
		{
			var newNotif:iOS.LocalNotification;
			newNotif = new iOS.LocalNotification();
			newNotif.alertBody = "The show is on!";
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

function SetLastTick () {
	PlayerPrefs.SetInt("LastClosedTime",CurrentTick());
}

function OnApplicationFocus (focus:boolean) {
	if(focus)
	{
		if(PlayerPrefs.GetInt("SaveSystemAvailable") == 0 && CurrentTick() - PlayerPrefs.GetInt("LastClosedTime") >= 36 * numberOfHours && PlayerPrefs.GetInt("LastClosedTime") != 0)  // .5 is the number of hours
		{
			ResetGame();
		}
	}
	else
	{
		SetLastTick();
	}
}

function DeleteAllValues () {
	if(settings.eraseOnLoad)
	{
		PlayerPrefs.DeleteAll();
	}
	else
	{
		PlayerPrefs.SetInt("PackingPeanutFactoryFirstOpeningPlayed",0);
		PlayerPrefs.SetInt("WorldMapState",1);
		PlayerPrefs.SetInt("CurrencyNumber",0);
		PlayerPrefs.SetInt("TutorialFinished",0);
		PlayerPrefs.SetInt("WorldMapState",0);
		PlayerPrefs.SetInt("FirstThingUnlocked",0);
		for(var thisGame:ArcadeGame in arcadeGames)
		{
			PlayerPrefs.SetInt("Arcade"+thisGame.name,0);
			PlayerPrefs.SetFloat("Arcade"+thisGame.name+"Score",0);
			thisGame.highScore = PlayerPrefs.GetFloat("Arcade"+thisGame.name+"Score");
		}
		for(var aWorld:World in worlds)
		{
			var worldName:String;
			worldName = aWorld.basic.worldNameVar;
			
			PlayerPrefs.SetInt("SaveSystemAvailable", 0);
			PlayerPrefs.SetInt("PaidSongOneUnlocked", 0);
			PlayerPrefs.SetInt("PaidSongTwoUnlocked", 0);
		    ///////////////////////////////////////////////////////////////////// World unlock variables.
			PlayerPrefs.SetInt(worldName, 0);
			///////////////////////////////////////////////////////////////////// World reward variables.
			PlayerPrefs.SetInt(worldName+"Unlocks", 0);
			///////////////////////////////////////////////////////////////////// World high score variables.
			PlayerPrefs.SetInt(worldName+"HighScore", 0);
			PlayerPrefs.SetInt(worldName+"HighScoreHard", 0);
			///////////////////////////////////////////////////////////////////// World visit variables.
			PlayerPrefs.SetInt(worldName+"PlayedOnce", 0);
			PlayerPrefs.SetInt(worldName+"Beaten", 0);
			for(var varName:int = 0; varName < varNames.length; varName++)
			{
				PlayerPrefs.SetInt(aWorld.basic.worldNameVar+varNames[varName], 0);
			}
		}
		PlayerPrefs.SetInt("HairSelection",0);
		PlayerPrefs.SetInt("EyesSelection",0);
		PlayerPrefs.SetInt("TopSelection",0);
		PlayerPrefs.SetInt("BottomSelection",0);
		UnlockCustomizeOptions(false);
	}
}

#if UNITY_IPHONE
	@DllImport("__Internal")
	static private function _trackState(appState: String, jsonDict: String) : float {}; 
	@DllImport("__Internal")
	static private function _trackAction(eventName: String, jsonDict: String) : float {};
#endif

function ComScoreCall () {
	if(!comScoreCalled)
	{
		comScoreCalled = true;
		Debug.Log( "Game Launch Analytics Event about to fire." );
		var contextData = new JSONObject(JSONObject.Type.OBJECT);
		contextData.AddField( "state", "game launched" );
		contextData.AddField( "screen", "title" );    
		#if UNITY_IPHONE      
		if(!Application.isEditor)  
		{
			_trackAction("Launch", contextData.Print(false));
		}
		#endif    
		Debug.Log( "Game Launch Analytics Event just fired!" );
	}
}