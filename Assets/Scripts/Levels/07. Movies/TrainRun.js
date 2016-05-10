#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var clicked:boolean[];

var buildingsBack:Material;
var buildingsFront:Material;
var tracks:Material;

var laserWarning:SpriteRenderer;
var laser:SpriteRenderer;

var player:SpriteRenderer;
var playerSprites:Sprite[];
var hitSprite:Sprite;
@HideInInspector var currentSprite:int;

@HideInInspector var regularHeight:float;
@HideInInspector var jumpHeight:float;

@HideInInspector var gameSpeed:float;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = new boolean[5];
	clicked = [false,false,false,false,false];
	
	// Level specific variable initialization.
	
	// Speed and difficulty information.
	if(Application.loadedLevelName == "MicroTester")
	{
		speed = MicroTester.timeMultiplier;
		difficulty = MicroTester.difficulty;
	}
	else
	{
		speed = GameManager.speed;
		difficulty = GameManager.difficulty;
	}
	length = 3 + 5/speed;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
}

function Update () {
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true,0);
	}
	// Get important finger.
	for(var i:int = 0; i < Finger.identity.length; i++)
	{
		if(!Master.paused)
		{
			clicked[i] = true;
		}
		if(Finger.GetExists(i) && Finger.GetInGame(i) && !clicked[i] && !finished)
		{
			clicked[i] = true;
		}
		else if(!Finger.GetExists(i) || !Finger.GetInGame(i))
		{
			clicked[i] = false;
		}
	}
}

function Play () {

}

function Finish(completionStatus:boolean,waitTime:float) {
	if(!finished)
	{
		finished = true;
		GameObject.FindGameObjectWithTag("GameController").BroadcastMessage("GameComplete",completionStatus,SendMessageOptions.DontRequireReceiver);
		if(colorChange)
		{
			GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", Color(0,0,0,0),SendMessageOptions.DontRequireReceiver);
		}
	}
}

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", colorForChange,SendMessageOptions.DontRequireReceiver);
	yield;
}