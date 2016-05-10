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

var possibleCredits:TextMesh[];
var startHeights:float[];

var credits:GameObject;

@HideInInspector var endHeight:float;

@HideInInspector var scrollSpeed:float;

@HideInInspector var momentum:float;

@HideInInspector var lastPosition:float;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = false;
	
	// Level specific variable initialization.
	endHeight = 3.2;
	momentum = 0;
	lastPosition = -100;
	
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
	length = 4 * (.8 + .2 * difficulty);
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	scrollSpeed = Mathf.Max(.6,1.2 - (.15*speed));
	credits.transform.localPosition.y = startHeights[difficulty-1];
	
	for(var i:int = 0; i < possibleCredits.length; i++)
	{
		if(i != difficulty-1)
		{
			possibleCredits[i].text = "";
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
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		if(!clicked)
		{
			clicked = true;
		}
		if(lastPosition != -100)
		{
			if((Finger.GetPosition(importantFinger).y - lastPosition) * scrollSpeed > momentum * .8)
			{
				momentum = (Finger.GetPosition(importantFinger).y - lastPosition) * scrollSpeed;
			}
		}
		lastPosition = Finger.GetPosition(importantFinger).y;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		clicked = false;
		lastPosition = -100;
		importantFinger = -1;
	}
	momentum = Mathf.MoveTowards(momentum,0,Time.deltaTime * 10);
	credits.transform.localPosition.y += momentum * Time.deltaTime;
	if(credits.transform.localPosition.y > endHeight)
	{
		Finish(true,0);
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