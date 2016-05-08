#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var clicked:boolean;

@HideInInspector var smallAmount:float;
@HideInInspector var largeAmount:float;

var earth:GameObject;
var moon:GameObject;

var earthSuccess:SpriteRenderer;
var moonSuccess:SpriteRenderer;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = false;
	
	// Level specific variable initialization.
	smallAmount = 40;
	largeAmount = 60;
	
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
	length = 5 + 5/speed;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	
	var random1:int = Random.Range(1,5);
	var random2:int = Random.Range(2,8);
	if(Random.value < .5)
	{
		for(var x:int = 0; x < random1; x ++)
		{
			BottomLeft(true);
		}
	}
	else
	{
		for(x = 0; x < random1; x ++)
		{
			BottomRight(true);
		}
	}
	if(Random.value < .5)
	{
		for(x = 0; x < random2; x ++)
		{
			TopLeft(true);
		}
	}
	else
	{
		for(x = 0; x < random2; x ++)
		{
			TopRight(true);
		}
	}
	
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
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i) && Finger.GetInGame(i))
			{
				importantFinger = i;
				break;
			}
		}
	}
	Debug.Log(Mathf.Abs(earth.transform.localRotation.eulerAngles.z));
	if(earth.transform.localRotation.eulerAngles.z == 0)
	{
		earthSuccess.color.a = Mathf.MoveTowards(earthSuccess.color.a,1,Time.deltaTime);
		if(Mathf.Abs(moon.transform.localRotation.eulerAngles.z) < 10)
		{
			moonSuccess.color.a = Mathf.MoveTowards(moonSuccess.color.a,1,Time.deltaTime);
		}
		else
		{
			moonSuccess.color.a = Mathf.MoveTowards(moonSuccess.color.a,0,Time.deltaTime);
		}
	}
	else
	{
		earthSuccess.color.a = Mathf.MoveTowards(earthSuccess.color.a,0,Time.deltaTime);
		moonSuccess.color.a = Mathf.MoveTowards(moonSuccess.color.a,0,Time.deltaTime);
	}
	
	if(moonSuccess.color.a == 1 && earthSuccess.color.a == 1)
	{
		Finish(true,0);
	}
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		if(!clicked)
		{
			if(Finger.GetPosition(importantFinger).x < -4 && Finger.GetPosition(importantFinger).y < -4)
			{
				BottomLeft(false);
			}
			if(Finger.GetPosition(importantFinger).x < -4 && Finger.GetPosition(importantFinger).y > 4)
			{
				TopLeft(false);
			}
			if(Finger.GetPosition(importantFinger).x > 4 && Finger.GetPosition(importantFinger).y < -4)
			{
				BottomRight(false);
			}
			if(Finger.GetPosition(importantFinger).x > 4 && Finger.GetPosition(importantFinger).y > 4)
			{
				TopRight(false);
			}
			clicked = true;
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		clicked = false;
		importantFinger = -1;
	}
}

function BottomLeft (now:boolean) {
	if(difficulty == 3)
	{
		Rotate(moon.transform,100,-smallAmount);
		Rotate(earth.transform,100,-largeAmount);
	}
	else
	{
		Rotate(earth.transform,100,-largeAmount);
	}
}
function TopLeft (now:boolean) {
	Rotate(moon.transform,100,-smallAmount);
}
function BottomRight (now:boolean) {
	if(difficulty == 3)
	{
		Rotate(moon.transform,100,smallAmount);
		Rotate(earth.transform,100,largeAmount);
	}
	else
	{
		Rotate(earth.transform,100,largeAmount);
	}
}
function TopRight (now:boolean) {
	Rotate(moon.transform,100,smallAmount);
}

function Rotate (object:Transform,speed:float,amount:float) {
	object.Rotate(Vector3.forward,amount);
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