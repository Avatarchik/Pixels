#pragma strict

static var initialLoad:boolean;

var selectedWorld:WorldSelect;
var worldNameFull:String;
var worldNameVar:String;
var worldNameLine1:String;
var worldNameLine2:String;
var selectedWorldGames:GameObject[];
var selectedWorldCovers:GameObject[];
var selectedWorldColors:Color[];
var selectedWorldUI:GameObject;
var selectedWorldFirstTimeText:GameObject;
var selectedWorldRegularOpeningText:GameObject;
var selectedWorldBeatenText:GameObject;
var selectedWorldRegularClosingText:GameObject;
var selectedWorldTransitionIn:AudioClip;
var selectedWorldTransitionOut:AudioClip;
var selectedWorldMusic:AudioClip[];
var selectedWorldFirstTimeSong:AudioClip;
var selectedWorldRegularOpeningSong:AudioClip;
var selectedWorldBeatenSong:AudioClip;
var selectedWorldRegularClosingSong:AudioClip;
var selectedWorldSuccessSound:AudioClip;
var selectedWorldFailureSound:AudioClip;

var initialWorldSpeed:int;
var speedIncrease:int;
var lives:int;
var worldColors:Color[];

function Awake () {
	initialLoad = true;
	Application.targetFrameRate = 60;
	DontDestroyOnLoad(gameObject);
	Initialize();
	if(Application.loadedLevelName == "GameStart")
	{
		Application.LoadLevel("TitleScreen");
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
		PlayerPrefs.SetInt("Theater", 1);
	}
	///////////////////////////////////////////////////////////////////////// World visit variables.
	if(!PlayerPrefs.HasKey("PackingPeanutFactoryPlayedOnce"))
	{
		PlayerPrefs.SetInt("PackingPeanutFactoryPlayedOnce", 0);
	}
	if(!PlayerPrefs.HasKey("PackingPeanutFactoryBeaten"))
	{
		PlayerPrefs.SetInt("PackingPeanutFactoryBeaten", 0);
	}
	if(!PlayerPrefs.HasKey("MuseumPlayedOnce"))
	{
		PlayerPrefs.SetInt("MuseumPlayedOnce", 0);
	}
	if(!PlayerPrefs.HasKey("MuseumBeaten"))
	{
		PlayerPrefs.SetInt("MuseumBeaten", 0);
	}
	if(!PlayerPrefs.HasKey("TheaterPlayedOnce"))
	{
		PlayerPrefs.SetInt("TheaterPlayedOnce", 0);
	}
	if(!PlayerPrefs.HasKey("TheaterBeaten"))
	{
		PlayerPrefs.SetInt("TheaterBeaten", 0);
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
		PlayerPrefs.SetInt("TopColor", 0);
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
	
	PlayerPrefs.SetInt("PackingPeanutFactoryPlayedOnce", 0);
	PlayerPrefs.SetInt("PackingPeanutFactoryBeaten", 0);
}