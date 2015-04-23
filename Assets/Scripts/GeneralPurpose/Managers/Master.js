#pragma strict

static var initialLoad:boolean;

static var selectedWorld:WorldSelect;
static var worldNameFull:String;
static var worldNameVar:String;
static var worldNameLine1:String;
static var worldNameLine2:String;
static var selectedWorldGames:GameObject[];
static var selectedWorldBossGame:GameObject;
static var selectedWorldCovers:GameObject[];
static var selectedWorldColors:Color[];
static var selectedWorldUI:GameObject;

static var selectedWorldMusic:AudioClip[];
static var selectedWorldTransitionIn:AudioClip;
static var selectedWorldTransitionOut:AudioClip;
static var selectedWorldSpeedUp:AudioClip;
static var selectedWorldFailSound:AudioClip;
static var selectedWorldSuccessSound:AudioClip;
static var selectedWorldBossGameSounds:AudioClip[];

static var selectedWorldFirstOpening:GameObject;
static var selectedWorldRegularOpening:GameObject;
static var selectedWorldEnd1:GameObject;
static var selectedWorldEnd2:GameObject;
static var selectedWorldEnd3:GameObject;
static var selectedWorldEnd4:GameObject;
static var selectedWorldBeatEnd:GameObject;

static var selectedWorldFirstOpeningSong:AudioClip;
static var selectedWorldRegularOpeningSong:AudioClip;
static var selectedWorldEnd1Song:AudioClip;
static var selectedWorldEnd2Song:AudioClip;
static var selectedWorldEnd3Song:AudioClip;
static var selectedWorldEnd4Song:AudioClip;
static var selectedWorldBeatEndSong:AudioClip;

static var selectedWorldUnlocksLevel1:String[];
static var selectedWorldUnlocksLevel2:String[];
static var selectedWorldUnlocksLevel3:String[];
static var selectedWorldUnlockNotificationsLine1:String[];
static var selectedWorldUnlockNotificationsLine2:String[];

static var initialWorldSpeed:int;
static var speedIncrease:int;
static var lives:int;
//var worldColors:Color[];

static var lastScore:int;
static var needToNotify:boolean;

static var unlockLevels:float[];

static var demoMode:boolean;
static var unlockAll:boolean;
static var resetAll:boolean;

function Awake () {
	demoMode = false;
	unlockAll = false;
	resetAll = true;
	
	// Sets initial variables for worlds.
	unlockLevels = new float[6];
	selectedWorldColors = [Color(.6,.8,1,1),Color(0,.5,1,1)];
	lives = 3;
	initialWorldSpeed = 1;
	speedIncrease = 1;
	needToNotify = false;
	initialLoad = true;
	
	// Set iOS device settings, including framerate and permitted orientations.
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
		if(PlayerPrefs.GetInt("TutorialFinished") == 0 && !unlockAll)
		{
			Application.LoadLevel("TutorialTitleScreen");
		}
		else
		{
			Application.LoadLevel("TitleScreen");
		}
	}
}

function Update () {
	if(Input.deviceOrientation == DeviceOrientation.LandscapeLeft || Input.deviceOrientation == DeviceOrientation.LandscapeRight || Input.deviceOrientation == DeviceOrientation.FaceDown) 
	{
		GetComponent.<Camera>().orthographicSize = 9;
	}
	else if(Input.deviceOrientation == DeviceOrientation.Portrait || Input.deviceOrientation == DeviceOrientation.PortraitUpsideDown) 
	{
		GetComponent.<Camera>().orthographicSize = 16;
	}
}

function Initialize () {
	// Testing information.
	if(demoMode)
	{
		unlockLevels = [0.0,5,10,15,20,100];
	}
	else
	{
		unlockLevels = [0.0,15,30,45,70,100];
	}
	if(resetAll)
	{
		PlayerPrefs.DeleteAll();
	}
	if(unlockAll)
	{
		UnlockAllOptions();
	}
	
	///////////////////////////////////////////////////////////////////////// World unlock variables.
	if(!PlayerPrefs.HasKey("PackingPeanutFactory"))
	{
		PlayerPrefs.SetInt("PackingPeanutFactory", 1);
	}
	if(!PlayerPrefs.HasKey("Museum"))
	{
		PlayerPrefs.SetInt("Museum", 0);
	}
	if(!PlayerPrefs.HasKey("Theater"))
	{
		PlayerPrefs.SetInt("Theater", 0);
	}
	///////////////////////////////////////////////////////////////////////// World reward variables.
	if(!PlayerPrefs.HasKey("PackingPeanutFactoryUnlocks"))
	{
		PlayerPrefs.SetInt("PackingPeanutFactoryUnlocks", 0);
	}
	if(!PlayerPrefs.HasKey("MuseumUnlocks"))
	{
		PlayerPrefs.SetInt("MuseumUnlocks", 0);
	}
	if(!PlayerPrefs.HasKey("TheaterUnlocks"))
	{
		PlayerPrefs.SetInt("TheaterUnlocks", 0);
	}
	///////////////////////////////////////////////////////////////////////// World visit variables.
	if(!PlayerPrefs.HasKey("PackingPeanutFactoryPlayedOnce"))
	{
		PlayerPrefs.SetInt("PackingPeanutFactoryPlayedOnce", 0);
	}
	if(!PlayerPrefs.HasKey("MuseumPlayedOnce"))
	{
		PlayerPrefs.SetInt("MuseumPlayedOnce", 0);
	}
	if(!PlayerPrefs.HasKey("TheaterPlayedOnce"))
	{
		PlayerPrefs.SetInt("TheaterPlayedOnce", 0);
	}
	///////////////////////////////////////////////////////////////////////// Overall status variables.
	if(!PlayerPrefs.HasKey("LastWorldVisited"))
	{
		PlayerPrefs.SetString("LastWorldVisited", "Theater");
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
	PlayerPrefs.SetInt("PackingPeanutFactory", 1);
	PlayerPrefs.SetInt("Museum", 1);
	PlayerPrefs.SetInt("Theater", 1);
	PlayerPrefs.SetInt("PackingPeanutFactoryUnlocks", 3);
	PlayerPrefs.SetInt("MuseumUnlocks", 3);
	PlayerPrefs.SetInt("TheaterUnlocks", 3);
	PlayerPrefs.SetInt("CurrencyNumber", 1000);
}