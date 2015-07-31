#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var dollarEmitter:ParticleSystem;
var cover:SpriteRenderer;
var creditsDisplay:GameObject;
var inDisplay:TextMesh;
var neededDisplay:TextMesh;
var button:GameObject;

var allow:boolean;

@HideInInspector var amountIn:int;
@HideInInspector var amountNeeded:int;
@HideInInspector var clicked:boolean;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	amountIn = 0;
	cover.color.a = 0;
	creditsDisplay.transform.position.x += 100;
	inDisplay.transform.position.x += 100;
	neededDisplay.transform.position.x += 100;
	button.transform.position.x += 100;
	
	allow = false;
	clicked = false;
	
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
	var speedMod:float = .3;
	for(var i:int = 0; i < speed; i ++)
	{
		speedMod = Mathf.MoveTowards(speedMod,.12,.03);
	}
	length = (5 + difficulty * 5) * speedMod + 1.3;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	amountNeeded = 3 + difficulty * 2;
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	
	// If The game doesn't just run in Update.
	Play();
}

function Update () {
	inDisplay.text = amountIn.ToString();
	neededDisplay.text = amountNeeded.ToString();
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false,0);
	}
	if(amountIn >= amountNeeded && !finished)
	{
		Finish(true,.2);
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
	if(Input.GetKeyDown("space") && allow && !finished)
	{
		dollarEmitter.Emit(10);
		amountIn ++;
	}
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	if(Finger.GetExists(importantFinger) && !Master.paused && !clicked && !finished)
	{
		clicked = true;
		if(allow)
		{
			dollarEmitter.Emit(10);
			amountIn ++;
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		clicked = false;
		importantFinger = -1;
	}
	if(allow)
	{
		
		
	}
	else
	{
	
	}
}

function Play () {
	yield WaitForSeconds(1.3);
	cover.color.a = 1;
	creditsDisplay.transform.position.x -= 100;
	inDisplay.transform.position.x -= 100;
	neededDisplay.transform.position.x -= 100;
	button.transform.position.x -= 100;
	allow = true;
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