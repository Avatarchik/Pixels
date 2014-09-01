#pragma strict

var selectedWorld:WorldSelect;
var worldNameFull:String;
var worldNameLine1:String;
var worldNameLine2:String;
var selectedWorldGames:GameObject[];
var selectedWorldCovers:GameObject[];
var selectedWorldColors:Color[];
var selectedWorldUI:GameObject;

var initialWorldSpeed:int;
var speedIncrease:int;
var lives:int;
var worldColors:Color[];

function Awake () {
	Application.targetFrameRate = 60;
	DontDestroyOnLoad(gameObject);
	if(Application.loadedLevelName == "GameStart")
	{
		Application.LoadLevel("WorldSelect");
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