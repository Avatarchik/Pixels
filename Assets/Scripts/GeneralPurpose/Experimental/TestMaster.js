#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var selectedWorld:WorldSelect;
var initialWorldSpeed:int;
var speedIncrease:int;
var lives:int;

function Awake () {
	Screen.SetResolution(30,240, true);
	DontDestroyOnLoad(gameObject);
}

function Update () {
	if(Input.deviceOrientation == DeviceOrientation.LandscapeLeft || Input.deviceOrientation == DeviceOrientation.LandscapeRight) 
	{
		GetComponent.<Camera>().orthographicSize = 9;
	}
	else if(Input.deviceOrientation == DeviceOrientation.Portrait || Input.deviceOrientation == DeviceOrientation.PortraitUpsideDown) 
	{
		GetComponent.<Camera>().orthographicSize = 16;
	}
}