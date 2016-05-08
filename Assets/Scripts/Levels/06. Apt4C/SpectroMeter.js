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

@HideInInspector var currentLocation:int;

var locations:Vector3[];

var ghost:GameObject;

var display:SpriteRenderer;
var displaySprites:Sprite[];

var meter:GameObject;
var onGlow:SpriteRenderer;

@HideInInspector var goal:int;
@HideInInspector var progress:int;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = false;
	
	// Level specific variable initialization.
	progress = 0;
	currentLocation = -1;
	
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
	goal = 3+difficulty;
	length = goal * 1.5 + 8/speed;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	currentLocation = Random.Range(0,locations.Length);
	ghost.transform.position = locations[currentLocation];
	Play();
}

function Update () {
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false,0);
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
		if(Vector2.Distance(Finger.GetPosition(importantFinger),meter.transform.position) < 4 && Finger.GetInGame(importantFinger))
		{
			meter.transform.position.x = Finger.GetPosition(importantFinger).x;
			meter.transform.position.y = Finger.GetPosition(importantFinger).y + 1;
			onGlow.color.a = Mathf.MoveTowards(onGlow.color.a,1,Time.deltaTime * 4);
		}
		if(!clicked)
		{
			clicked = true;
		}
		ghost.GetComponent(SpriteRenderer).color.a = 1 - (Vector2.Distance(meter.transform.position + Vector2(0,2),ghost.transform.position) * .33);
	}
	else if(!Finger.GetExists(importantFinger))
	{
		onGlow.color.a = Mathf.MoveTowards(onGlow.color.a,0,Time.deltaTime * 4);
		ghost.GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(ghost.GetComponent(SpriteRenderer).color.a,0,Time.deltaTime);
		clicked = false;
		importantFinger = -1;
	}
	
	display.sprite = displaySprites[Mathf.Clamp(0,displaySprites.length-1,Mathf.Round(Vector2.Distance(ghost.transform.position,meter.transform.position + Vector2(0,2))))];
}

function Play () {
	var counter:float = .25;
	while(progress < goal)
	{
		ghost.transform.position = Vector3.MoveTowards(ghost.transform.position,locations[currentLocation],Time.deltaTime * 15);
		if(Vector2.Distance(meter.transform.position + Vector2(0,2),ghost.transform.position) < .5 && ghost.transform.position == locations[currentLocation])
		{
			counter -= Time.deltaTime;
			ghost.transform.localScale += Time.deltaTime * Vector3(3,3,3);
		}
		if(counter < 0)
		{
			counter = .25;
			var lastLocation:int = currentLocation;
			while(currentLocation == lastLocation)
			{
				currentLocation = Random.Range(0,locations.length);
				yield;
			}
			progress++;
			if(progress < goal)
			{
				ghost.transform.localScale = Vector3.one;
			}
		}
		yield;
	}
	Finish(true,1);
	GhostDie();
}

function GhostDie () {
	while(true)
	{
		ghost.GetComponent(SpriteRenderer).color.a = 6 - ghost.transform.localScale.x * .3;
		ghost.transform.localScale += Time.deltaTime * Vector3(3,3,3);
		yield;
	}
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