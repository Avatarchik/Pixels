#pragma strict

var selectedWorld:WorldSelect;
var initialWorldSpeed:int;
var speedIncrease:int;
var lives:int;

function Awake () {
	DontDestroyOnLoad(gameObject);
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