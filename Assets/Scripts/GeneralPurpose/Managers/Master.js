#pragma strict

static var initialLoad:boolean;

public enum WorldSelect{PackingPeanutFactory,Museum,Theater,HighSchool,Neverland,GameDev,Arcade};

static var speedIncrease:int;
static var lives:int;
static var paused:boolean;
static var lastScore:int;
static var counter:float;
static var demo:boolean;
static var unlockAll:boolean;
static var hardMode:boolean;
static var unlockLevels:int[];

@HideInInspector var topBar:GameObject;
@HideInInspector var bottomBar:GameObject;
static var device:String;
static var vertical:boolean;

var appVersion:float;
var varNames:String[];
var launchOptions:Options;
var arcadeGames:ArcadeGame[];
var worlds:World[];
var worldOptions:WorldOptions;
static var currentWorld:World;

var notification:GameObject;
static var notifying:boolean;

function Awake () {
	Time.timeScale = 1;
	WorldOptions();
	vertical = false;
	demo = false;
	unlockAll = false;
	notifying = false;
	if(launchOptions.unlockEverything){unlockAll=true;}
	
	// Sets initial variables for worlds.
	unlockLevels = new int[6];
	currentWorld = worlds[1];
	lives = 3;
	paused = false;
	speedIncrease = 1;
	initialLoad = true;
	hardMode = false;
	
	// Set iOS device settings, including framerate and permitted orientations, and find Top and Bottom objects.
	if(CheckDeviceType("iPad"))
	{
		device = "iPad";
	}
	else
	{
		device = "normal";
	}
	//var children:Transform[];
	for(var child:Transform in gameObject.GetComponentsInChildren(Transform))
	{
		if(child.name == "Top")
		{
			topBar = child.gameObject;
		}
		if(child.name == "Bottom")
		{
			bottomBar = child.gameObject;
		}
	}
	Application.targetFrameRate = 60;
	Screen.orientation = ScreenOrientation.AutoRotation; 
	Screen.autorotateToLandscapeLeft = true;
	Screen.autorotateToLandscapeRight = true; 
	Screen.autorotateToPortrait = true;
	Screen.autorotateToPortraitUpsideDown = true;
	
	DontDestroyOnLoad(gameObject);
	Initialize();
	if(launchOptions.skipOpening)
	{
		PlayerPrefs.SetInt("TutorialFinished",2);
	}
	if(Application.loadedLevelName == "GameStart")
	{
		Application.LoadLevel("TitleScreen");
	}
}

function Start () {
	if(launchOptions.demoMode)
	{
		demo = true;
		StartCoroutine(Demo());
	}
	PlayerPrefs.SetInt("PackingPeanutFactoryFirstOpeningPlayed",1);
}

function Update () {
	if(Input.deviceOrientation == DeviceOrientation.LandscapeLeft || Input.deviceOrientation == DeviceOrientation.LandscapeRight || Input.deviceOrientation == DeviceOrientation.FaceDown) 
	{
		vertical = false;
		if(device == "iPad")
		{
			topBar.transform.position = Vector3(0,25,-8.9);
			bottomBar.transform.position = Vector3(0,-25,-8.9);
			GetComponent.<Camera>().orthographicSize = 12;
		}
		else
		{
			GetComponent.<Camera>().orthographicSize = 9;
		}
	}
	else if(Input.deviceOrientation == DeviceOrientation.Portrait || Input.deviceOrientation == DeviceOrientation.PortraitUpsideDown) 
	{
		vertical = true;
		if(device == "iPad")
		{
			topBar.transform.position = Vector3(25,0,-8.9);
			bottomBar.transform.position = Vector3(-25,0,-8.9);
			GetComponent.<Camera>().orthographicSize = 16;
		}
		else
		{
			GetComponent.<Camera>().orthographicSize = 16;
		}
	}
}

// This function returns the device type to adjust the screen size (and borders) for iPad and older iPhone models.
function CheckDeviceType(search:String):boolean {
	switch(search)
	{
		case "iPad":
			if(iOS.Device.generation == iOS.DeviceGeneration.iPadAir1 || iOS.Device.generation == iOS.DeviceGeneration.iPadAir2|| iOS.Device.generation == iOS.DeviceGeneration.iPad1Gen || iOS.Device.generation == iOS.DeviceGeneration.iPad2Gen || iOS.Device.generation == iOS.DeviceGeneration.iPad3Gen || iOS.Device.generation == iOS.DeviceGeneration.iPad4Gen || iOS.Device.generation == iOS.DeviceGeneration.iPad5Gen || iOS.Device.generation == iOS.DeviceGeneration.iPadUnknown)
			{
				return true;
			}
			else
			{
				return false;
			}
			break;
		case "old iPhone":
			return false;
			break;
		default:
			return false;
			break;
	}
		
}

function Demo() {
	counter = launchOptions.demoTime;
	while(true)
	{
		if(Finger.GetExists(0) == true)
		{
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
			counter = launchOptions.demoTime;
		}
		yield;
		if(counter < 0)
		{
			yield WaitForSeconds(.5);
			PlayerPrefs.DeleteAll();
			AudioManager.StopAll();
			Application.LoadLevel("GameStart");
			Destroy(gameObject);
		}
		else if (counter > launchOptions.demoTime * 2)
		{
			launchOptions.unlockEverything = true;
			unlockAll = true;
			Initialize();
			UnlockAllOptions();
			AudioManager.StopAll();
			Application.LoadLevel("GameStart");
		}
	}
	yield;
}

function Initialize () {
	///////////////////////////////////////////////////////////////////////// Testing information.
	if(launchOptions.quickProgress)
	{
		unlockLevels = [0,5,10,15,20,100];
	}
	else
	{
		unlockLevels = [0,15,25,35,70,100];
	}
	if(launchOptions.eraseOnLoad || (launchOptions.eraseOnNewVersion && PlayerPrefs.GetFloat("ion") != appVersion))
	{
		PlayerPrefs.DeleteAll();
		PlayerPrefs.SetFloat("AppVersion",appVersion);
	}
	CheckArcadeUnlocks();
	if(unlockAll)
	{
		UnlockArcadeGames(true);
		UnlockAllOptions();
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
	PlayerPrefs.SetInt("PackingPeanutFactory", 1);
	
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
		PlayerPrefs.SetInt("HairSelection", 1);
	}
	if(!PlayerPrefs.HasKey("HairColor"))
	{
		PlayerPrefs.SetInt("HairColor", 1);
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
		PlayerPrefs.SetInt("TopSelection", 1);
	}
	if(!PlayerPrefs.HasKey("TopColor"))
	{
		PlayerPrefs.SetInt("TopColor", 1);
	}
	if(!PlayerPrefs.HasKey("BottomSelection"))
	{
		PlayerPrefs.SetInt("BottomSelection", 1);
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
}

function UnlockAllOptions () {
	PlayerPrefs.DeleteAll();
	PlayerPrefs.SetInt("TutorialFinished",2);
	for(var aWorld:World in worlds)
	{
		var worldName:String;
		worldName = aWorld.basic.worldNameVar;
	    ///////////////////////////////////////////////////////////////////// World unlock variables.
		if(!PlayerPrefs.HasKey(worldName))
		{
			PlayerPrefs.SetInt(worldName, 1);
		}
		///////////////////////////////////////////////////////////////////// World reward variables.
		if(!PlayerPrefs.HasKey(worldName+"Unlocks"))
		{
			PlayerPrefs.SetInt(worldName+"Unlocks", 3);
		}
		///////////////////////////////////////////////////////////////////// World high score variables.
		if(!PlayerPrefs.HasKey(worldName)+"HighScore")
		{
			PlayerPrefs.SetInt(worldName+"HighScore", 50);
		}
		if(!PlayerPrefs.HasKey(worldName)+"HighScoreHard")
		{
			PlayerPrefs.SetInt(worldName+"HighScoreHard", 50);
		}
		///////////////////////////////////////////////////////////////////// World visit variables.
		if(!PlayerPrefs.HasKey(worldName)+"PlayedOnce")
		{
			PlayerPrefs.SetInt(worldName+"PlayedOnce", 1);
		}
		if(!PlayerPrefs.HasKey(worldName)+"Beaten")
		{
			PlayerPrefs.SetInt(worldName+"Beaten", 1);
		}
		for(var varName:int = 0; varName < varNames.length; varName++)
		{
			if(!PlayerPrefs.HasKey(aWorld.basic.worldNameVar+varNames[varName]))
			{
				PlayerPrefs.SetInt(aWorld.basic.worldNameVar+varNames[varName], 1);
			}
		}
	}
	PlayerPrefs.SetInt("HairSelection",1);
	PlayerPrefs.SetInt("EyesSelection",1);
	PlayerPrefs.SetInt("TopSelection",1);
	PlayerPrefs.SetInt("BottomSelection",1);
	PlayerPrefs.SetInt("CurrencyNumber", 1000);
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
	var unlocksLevel3:String[];
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
	var eraseOnNewVersion:boolean;
	var quickProgress:boolean;
	var unlockEverything:boolean;
	var skipOpening:boolean;
	var eraseOnLoad:boolean;
	var demoMode:boolean;
	var demoTime:float;
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
	var playCost:int;
	var audioCues:AudioClip[];
	@HideInInspector var highScore:float;
	@HideInInspector var unlocked:boolean;
}

function CheckArcadeUnlocks () {
	for(var thisGame:ArcadeGame in arcadeGames)
	{
		if(!PlayerPrefs.HasKey("Arcade"+thisGame.name))
		{
			PlayerPrefs.SetInt("Arcade"+thisGame.name,0);
		}	
		else
		{
			if(PlayerPrefs.GetInt("Arcade"+thisGame.name) == 0)
			{
				thisGame.unlocked = false;
			}
			else
			{
				thisGame.unlocked = true;
			}
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
			thisGame.unlocked = true;
			PlayerPrefs.SetFloat("Arcade"+thisGame.name+"Score",4);
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
		specificGame.unlocked = true;
		PlayerPrefs.SetFloat("Arcade"+specificGame.name+"Score",0);
		specificGame.highScore = PlayerPrefs.GetFloat("Arcade"+specificGame.name+"Score");
	}
}

function LaunchNotification (text:String,type:NotificationType) {
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