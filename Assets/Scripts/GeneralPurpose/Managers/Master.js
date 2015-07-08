#pragma strict

static var initialLoad:boolean;

public enum WorldSelect{PackingPeanutFactory,Museum,Theater,HighSchool,Neverland};

static var initialWorldSpeed:int;
static var speedIncrease:int;
static var lives:int;
static var paused:boolean;

static var lastScore:int;

static var unlockLevels:int[];

private var topBar:GameObject;
private var bottomBar:GameObject;
static var device:String;
static var vertical:boolean;

var appVersion:float;
var eraseOnNewVersion:boolean;
var worldNames:String[];
var quickProgress:boolean;
var unlockEverything:boolean;
var skipOpening:boolean;
var eraseOnLoad:boolean;
var demoMode:boolean;
var demoTime:float;
var varNames:String[];
static var counter:float;
static var demo:boolean;
static var unlockAll:boolean;

var worlds:World[];
static var currentWorld:World;

function Awake () {
	vertical = false;
	demo = false;
	unlockAll = false;
	if(unlockEverything){unlockAll=true;}
	
	// Sets initial variables for worlds.
	unlockLevels = new int[6];
	currentWorld = worlds[0];
	lives = 3;
	paused = false;
	initialWorldSpeed = 1;
	speedIncrease = 1;
	initialLoad = true;
	
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
	if(Application.loadedLevelName == "GameStart")
	{
		if(PlayerPrefs.GetInt("TutorialFinished") == 0 && !skipOpening)
		{
			Application.LoadLevel("TutorialTitleScreen");
		}
		else
		{
			Application.LoadLevel("TitleScreen");
		}
	}
}

function Start () {
	if(demoMode)
	{
		demo = true;
		StartCoroutine(Demo());
	}
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
	counter = demoTime;
	while(true)
	{
		if(Finger.GetExists(0) == true)
		{
			counter = demoTime;
		}
		else if(!Application.loadedLevelName.Contains("Tutorial"))
		{
			counter -= Time.deltaTime;
		}
		yield;
		if(counter < 0)
		{
			Application.LoadLevel("GameStart");
			Destroy(gameObject);
		}
	}
	yield;
}

function Initialize () {
	///////////////////////////////////////////////////////////////////////// Testing information.
	if(quickProgress)
	{
		unlockLevels = [0,5,10,15,20,100];
	}
	else
	{
		unlockLevels = [0,15,30,45,70,100];
	}
	if(eraseOnLoad || (eraseOnNewVersion && PlayerPrefs.GetFloat("AppVersion") != appVersion))
	{
		PlayerPrefs.SetFloat("AppVersion",appVersion);
		PlayerPrefs.DeleteAll();
	}
	if(unlockAll)
	{
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
		///////////////////////////////////////////////////////////////////// World visit variables.
		if(!PlayerPrefs.HasKey(worldName)+"PlayedOnce")
		{
			PlayerPrefs.SetInt(worldName+"PlayedOnce", 1);
		}
		if(!PlayerPrefs.HasKey(worldName)+"Beaten")
		{
			PlayerPrefs.SetInt(worldName+"Beaten", 1);
		}
	}
	PlayerPrefs.SetInt("CurrencyNumber", 1000);
}

class BasicVariables {
	var world:WorldSelect;
	var worldNameFull:String;
	var worldNameVar:String;
	var topLine:String;
	var bottomLine:String;
	var games:GameObject[];
	var bossGame:GameObject;
	var covers:GameObject[];
	var colors:Color[];
	var UI:GameObject;
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
}

class World {
	var nameOfWorld:String;
	var basic:BasicVariables;
	var text:TextVariables;
	var audio:AudioVariables;
	var unlocks:UnlockVariables;
}