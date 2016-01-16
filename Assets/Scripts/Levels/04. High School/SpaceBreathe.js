#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var colorChange:boolean;
var colorForChange:Color;

var worldIntros:AudioClip[];

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var asteroidPrefab:GameObject;
var spaceman:GameObject[];
var bar:GameObject;

@HideInInspector var currentSpaceman:int;

var particleThing:ParticleSystem[];

@HideInInspector var asteroids:GameObject[];
@HideInInspector var barGoals:float[];
@HideInInspector var barTop:float;
@HideInInspector var spacemanSpeed:float;
@HideInInspector var launched:boolean;
@HideInInspector var limit:float;

var light1:SpriteRenderer;
var light2:SpriteRenderer;

var greenLightSprites:Sprite[];
var greenLight:SpriteRenderer;

var clicked:boolean;


function Start () {
	if(Random.Range(0,10.0) < 2.5)
	{
		AudioManager.PlayCutscene(worldIntros[Random.Range(0,worldIntros.length)]);
	}
	currentSpaceman = 0;
	light1.color.a = 0;
	light2.color.a = 0;
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = false;
	
	// Level specific variable initialization.
	launched = false;
	bar.transform.localScale.x = 22;
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
	length = 4 + 3/speed;
	timer = length;
	
	
	asteroids = new GameObject[difficulty];
	var randomNum:int = Random.Range(5,14);
	for(var i:int = 0; i < asteroids.length;i++)
	{
		asteroids[i] = Instantiate(asteroidPrefab,Vector3(0,-randomNum - (6*i),3),Quaternion.identity);
		asteroids[i].transform.parent = transform;
		if(i>0)
		{
			asteroids[i].transform.parent = asteroids[0].transform;
		}
	}
	
	spacemanSpeed = 5 + (7*speed);
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	
	for(i = 0; i<asteroids.length;i++)
	{
		for(var thisPart:ParticleSystem in asteroids[i].GetComponentsInChildren(ParticleSystem))
		{
			thisPart.startSpeed = 1 - (9*speed);
		}
	}
	greenLight.sprite = null;
	switch(difficulty)
	{
		case 1:
			limit = 12;
			break;
		case 2:
			limit = 15;
			break;
		case 3:
			limit = 19;
			break;
		default:
			break;
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
	if(currentSpaceman > 0)
	{
		greenLight.sprite = greenLightSprites[currentSpaceman-1];
	}
	if(currentSpaceman < 3 && currentSpaceman > 0)
	{
		spaceman[currentSpaceman].transform.position.x = Mathf.MoveTowards(spaceman[currentSpaceman].transform.position.x,-7.873,Time.deltaTime*spacemanSpeed);
	}
	if(Input.GetKeyDown("space"))
	{
		Clicked();
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false,0);
	}
	// Get important finger.
	if(importantFinger == -1)
	{
		clicked = false;
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
	if(Finger.GetExists(importantFinger) && !Master.paused && !clicked)
	{
		Clicked();
		clicked = true;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	
	for(i = 0; i<asteroids.length; i++)
	{
		if(currentSpaceman > 0 && Vector2.Distance(spaceman[currentSpaceman-1].transform.position,asteroids[i].transform.position) < 2.5)
		{
			HitByRock();
		}
	}
	if(asteroids.Length > 0)
	{
		asteroids[0].transform.position.y += Time.deltaTime * spacemanSpeed * 2;
		if(asteroids[0].transform.position.y > limit)
		{
			asteroids[0].transform.position.y = -14;
		}
	}
}

function Success() {
	particleThing[currentSpaceman].emissionRate = 300;
	currentSpaceman ++;
	while(spaceman[currentSpaceman-1].transform.position.x != 8 && !finished)
	{
		spaceman[currentSpaceman-1].transform.position.y = Mathf.Cos(spaceman[currentSpaceman-1].transform.position.x / 4);
		spaceman[currentSpaceman-1].transform.position.x = Mathf.MoveTowards(spaceman[currentSpaceman-1].transform.position.x,8,Time.deltaTime*spacemanSpeed * 2);
		yield;
	}
	if(currentSpaceman == 3)
	{
		Finish(true,0);
	}
	
	yield;
}

function Failure() {
	particleThing[currentSpaceman].emissionRate = 300;
	while(spaceman[currentSpaceman].transform.position.x != -2 && !finished)
	{
		spaceman[currentSpaceman].transform.position.y = Mathf.Cos(spaceman[currentSpaceman].transform.position.x / 6);
		spaceman[currentSpaceman].transform.position.x = Mathf.MoveTowards(spaceman[currentSpaceman].transform.position.x,-2,Time.deltaTime*spacemanSpeed * 2);
		yield;
	}
	particleThing[currentSpaceman].emissionRate = 0;
	yield WaitForSeconds(.3);
	Finish(false,.8);
	while(true)
	{
		spaceman[currentSpaceman].transform.position.y -= Time.deltaTime * spacemanSpeed * 2.6;
		yield;
	}
}

function HitByRock() {
	Finish(false,1);
	while(true)
	{
		light1.color.a = Mathf.Abs(Mathf.Sin(Time.time * 6));
		light2.color.a = Mathf.Abs(Mathf.Sin(Time.time * 6));
		spaceman[currentSpaceman-1].transform.position.y += Time.deltaTime * spacemanSpeed * 3;
		spaceman[currentSpaceman-1].transform.position.x += Time.deltaTime;
		yield;
	}
}

function Play () {
}

function Finish(completionStatus:boolean,waitTime:float) {
	UITimer.soundsOn = !completionStatus;
	if(!finished)
	{
		finished = true;
		yield WaitForSeconds(waitTime);
		GameObject.FindGameObjectWithTag("GameController").BroadcastMessage("GameComplete",completionStatus,SendMessageOptions.DontRequireReceiver);
		if(colorChange)
		{
			GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", Color(0,0,0,0),SendMessageOptions.DontRequireReceiver);
		}
	}
}

function Clicked() { 
	if(!launched)
	{
		if(currentSpaceman > 0 && spaceman[currentSpaceman-1].transform.position.x >= 7)
		{
			launched = true;
			if(bar.transform.localScale.x >= barGoals[difficulty-1])
			{
				Success();
			}
			else
			{
				Failure();
			}	
			if(currentSpaceman != 3)
			{
				launched = false;
			}
		}
		else if(currentSpaceman == 0)
		{
			launched = true;
			if(bar.transform.localScale.x >= barGoals[difficulty-1])
			{
				Success();
			}
			else
			{
				Failure();
			}	
			if(currentSpaceman != 3)
			{
				launched = false;
			}
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