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

var highlightPrefabs:GameObject[];
var crystalPrefabs:GameObject[];
var colors:Color[];

var glow:GameObject;

@HideInInspector var highlightXLimit:float;
@HideInInspector var highlightYLimit:float;
@HideInInspector var distanceAllowed:float;
@HideInInspector var grabDistance:float;
@HideInInspector var attachedCrystals:int[];
@HideInInspector var goal:int;
@HideInInspector var currentNumber:int;

@HideInInspector var crystals:GameObject[];
@HideInInspector var highlights:GameObject[];
@HideInInspector var glows:GameObject[];
@HideInInspector var crystalPositions:Vector3[];
@HideInInspector var highlightPositions:Vector3[];	
@HideInInspector var delays:float[];
@HideInInspector var touched:boolean[];
@HideInInspector var success:boolean[];

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = new boolean[5];
	clicked = [false,false,false,false,false];
	
	// Level specific variable initialization.
	highlightXLimit = 3.2;
	highlightYLimit = 4.5;
	distanceAllowed = 1.5;
	grabDistance = 3;
	attachedCrystals = new int[clicked.length];
	currentNumber = 0;
	
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
	goal = 5 + (difficulty * 3);
	length = goal * (2 - Mathf.Min(.9,speed * .18));
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	crystals = new GameObject[goal];
	highlights = new GameObject[goal];
	glows = new GameObject[goal];
	crystalPositions = new Vector3[goal];
	highlightPositions = new Vector3[goal];
	delays = new float[goal];
	touched = new boolean[goal];
	success = new boolean[goal];
	
	for(var i:int = 0; i < goal; i++)
	{
		var newRandom:int = Random.Range(0,highlightPrefabs.length);
		crystals[i] = Instantiate(crystalPrefabs[newRandom]);
		highlights[i] = Instantiate(highlightPrefabs[newRandom]);
		glows[i] = Instantiate(glow);
		crystals[i].transform.parent = transform;
		highlights[i].transform.parent = transform;
		glows[i].transform.parent = highlights[i].transform;
		glows[i].transform.localPosition = Vector3(0,0,.01);
		glows[i].transform.localScale = Vector3(1,1,1);
		glows[i].GetComponent(SpriteRenderer).color.a = 0;
		crystals[i].transform.position = Vector3(-100,0,0);
		highlights[i].transform.position = Vector3(100,0,0);
		crystalPositions[i] = Vector3(Random.Range(4,8),Random.Range(4,8),0);
		highlightPositions[i] = Vector3(Random.Range(0,highlightXLimit),Random.Range(0,highlightYLimit),0);
		crystals[i].GetComponent(SpriteRenderer).color = colors[i];
		highlights[i].GetComponent(SpriteRenderer).color = colors[i];
		crystals[i].transform.localScale = Vector3(1,1,1);
		highlights[i].transform.localScale = Vector3(1,1,1);
		if(Random.value < .5)
		{
			crystalPositions[i].x *= -1;
		}
		if(Random.value < .5)
		{
			crystalPositions[i].y *= -1;
		}
		if(Random.value < .5)
		{
			highlightPositions[i].x *= -1;
		}
		if(Random.value < .5)
		{
			highlightPositions[i].y *= -1;
		}
		delays[i] = Random.value;
		touched[i] = false;	
		success[i] = false;
	}
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
}

function Update () {
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false,0);
	}
	// Get important finger.
	for(var i:int = 0; i < Finger.identity.length; i++)
	{
		if(!Master.paused && Finger.GetExists(i) && Finger.GetInGame(i) && !finished)
		{
			var nearest:int = -1;
			var nearestDistance:float = 100;
			if(attachedCrystals[i] == -1)
			{
				for(var x:int = 0; x < goal; x++)
				{
					if(Vector3.Distance(Finger.GetPosition(i),crystals[x].transform.position) < nearestDistance && !success[x])
					{
						nearest = x;
						nearestDistance = Vector3.Distance(Finger.GetPosition(i),crystals[x].transform.position);
					}
				}
				if(nearestDistance < grabDistance)
				{
					touched[nearest] = true;
					attachedCrystals[i] = nearest;
				}
			}
			else
			{
				crystals[attachedCrystals[i]].transform.position = Finger.GetPosition(i);
			}
		}
		else
		{
			attachedCrystals[i] = -1;
		}
	}
	
	for(i = 0; i < goal; i++)
	{
		if(i < currentNumber + 3 && !success[i])
		{
			highlights[i].transform.position = highlightPositions[i];
			if(!touched[i])
			{
				crystals[i].transform.position.x = crystalPositions[i].x + Mathf.Sin(Time.deltaTime + delays[i]) * .5;
				crystals[i].transform.position.y = crystalPositions[i].y + Mathf.Sin(Time.deltaTime + delays[i]) * .25;
			}
			if(Vector3.Distance(crystals[i].transform.position,highlights[i].transform.position) < distanceAllowed && !success[i])
			{
				success[i] = true;
				SuccessAdd(i);
			}
		}
		if(success[i])
		{
			Debug.Log(i);
			crystals[i].transform.position = Vector3.MoveTowards(crystals[i].transform.position,highlights[i].transform.position,Time.deltaTime);
			highlights[i].GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(highlights[i].GetComponent(SpriteRenderer).color.a,0,Time.deltaTime);
			crystals[i].GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(crystals[i].GetComponent(SpriteRenderer).color.a,0,Time.deltaTime);
		}
		else
		{
			highlights[i].GetComponent(SpriteRenderer).color.a = .6 + Mathf.Sin(Time.time)/3;
		}
	}
	if(currentNumber >= goal)
	{
		Finish(true,.3);
	}
}

function SuccessAdd (number:int) {
	currentNumber ++;
	while(glows[number].GetComponent(SpriteRenderer).color.a != 1)
	{
		glows[number].GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(glows[number].GetComponent(SpriteRenderer).color.a,1,Time.deltaTime * 1.3);
		yield;
	}
	while(glows[number].GetComponent(SpriteRenderer).color.a != 0)
	{
		glows[number].GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(glows[number].GetComponent(SpriteRenderer).color.a,0,Time.deltaTime * 1.3);
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