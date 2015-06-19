#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var frontSprites:Sprite[];
var spaceman:GameObject;
var bar:GameObject;
var front:SpriteRenderer;

var particleThing:ParticleSystem;

@HideInInspector var barGoals:float[];
@HideInInspector var barTop:float;
@HideInInspector var spacemanSpeed:float;
@HideInInspector var launched:boolean;

function Start () {
	
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	launched = false;
	bar.transform.localScale.x = 0;
	barGoals = [14.4,16,17.6];
	barTop = 22;
	
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
	front.sprite = frontSprites[difficulty - 1];
	spacemanSpeed = 5 + (5*speed);
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
	if(Input.GetKeyDown("space"))
	{
		if(!launched)
		{
			launched = true;
			if(bar.transform.localScale.x >= barGoals[difficulty-1])
			{
				Debug.Log("hey");
				Success();
			}
			else
			{
				Debug.Log("boo");
				Failure();
			}	
		}
	}
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
			if(Finger.GetExists(i))
			{
				importantFinger = i;
			}
		}
	}
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
}

function Success() {
	particleThing.emissionRate = 300;
	while(spaceman.transform.position.x != 8 && !finished)
	{
		spaceman.transform.position.y = Mathf.Cos(spaceman.transform.position.x / 4);
		spaceman.transform.position.x = Mathf.MoveTowards(spaceman.transform.position.x,8,Time.deltaTime*spacemanSpeed * 1.3);
		yield;
	}
	Finish(true,0);
	yield;
}

function Failure() {
	particleThing.emissionRate = 300;
	while(spaceman.transform.position.x != -2 && !finished)
	{
		spaceman.transform.position.y = Mathf.Cos(spaceman.transform.position.x / 6);
		spaceman.transform.position.x = Mathf.MoveTowards(spaceman.transform.position.x,-2,Time.deltaTime*spacemanSpeed * 1.3);
		yield;
	}
	particleThing.emissionRate = 0;
	yield WaitForSeconds(.3);
	Finish(false,.8);
	while(true)
	{
		//spaceman.transform.position.y = Mathf.Cos((spaceman.transform.position.x)/ 6) - ((spaceman.transform.position.x + 2) * 2);
		//spaceman.transform.position.x = Mathf.MoveTowards(spaceman.transform.position.x,3,Time.deltaTime*spacemanSpeed);
		spaceman.transform.position.y -= Time.deltaTime * spacemanSpeed * 2.6;
		yield;
	}
}

function HitByRock() {
	Finish(false,1);
	while(true)
	{
		spaceman.transform.position.y += Time.deltaTime * spacemanSpeed * 3;
		yield;
	}
}

function Play () {
	while(true && !finished && !launched)
	{
		while(bar.transform.localScale.x != 22 && !finished && !launched)
		{
			bar.transform.localScale.x = Mathf.MoveTowards(bar.transform.localScale.x,barTop,Time.deltaTime*spacemanSpeed * 3);
			yield;
		}
		while(bar.transform.localScale.x != 0 && !finished && !launched)
		{
			bar.transform.localScale.x = Mathf.MoveTowards(bar.transform.localScale.x,0,Time.deltaTime*spacemanSpeed*3);
			yield;
		}		
		yield;
	}
	yield;
}

function Finish(completionStatus:boolean,waitTime:float) {
	if(!finished)
	{
		finished = true;
		yield WaitForSeconds(waitTime);
		GameObject.FindGameObjectWithTag("GameController").BroadcastMessage("GameComplete",completionStatus,SendMessageOptions.DontRequireReceiver);
		if(colorChange)
		{
			GameObject.FindGameObjectWithTag("GameController").BroadcastMessage("ChangeBackgroundColor", Color(0,0,0,0),SendMessageOptions.DontRequireReceiver);
		}
	}
}

function Clicked() { 
	if(!launched)
	{
		launched = true;
		if(bar.transform.localScale.x >= barGoals[difficulty-1])
		{
			Debug.Log("hey");
			Success();
		}
		else
		{
			Debug.Log("boo");
			Failure();
		}	
	}
}

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("GameController").BroadcastMessage("ChangeBackgroundColor", colorForChange,SendMessageOptions.DontRequireReceiver);
	yield;
}