#pragma strict

static var initialLoad:boolean;

var selectedWorld:WorldSelect;
var worldNameFull:String;
var worldNameLine1:String;
var worldNameLine2:String;
var selectedWorldGames:GameObject[];
var selectedWorldCovers:GameObject[];
var selectedWorldColors:Color[];
var selectedWorldUI:GameObject;
var selectedWorldOpeningText:GameObject;
var selectedWorldEndingText:GameObject;

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
	if(Input.deviceOrientation == DeviceOrientation.LandscapeLeft || Input.deviceOrientation == DeviceOrientation.LandscapeRight) 
	{
		camera.orthographicSize = 9;
	}
	else if(Input.deviceOrientation == DeviceOrientation.Portrait || Input.deviceOrientation == DeviceOrientation.PortraitUpsideDown) 
	{
		camera.orthographicSize = 16;
	}
}

function Initialize () {
	// World unlock variables.
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
	if(!PlayerPrefs.HasKey("Sound"))
	{
		PlayerPrefs.SetInt("Sound", 1);
	}
	if(!PlayerPrefs.HasKey("Music"))
	{
		PlayerPrefs.SetInt("Music", 1);
	}
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
}