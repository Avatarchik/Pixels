﻿#pragma strict

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var platformPrefab:GameObject;
var objectPrefab:GameObject[];

var oreSprite:Sprite[];

@HideInInspector var stamperUp:int;
@HideInInspector var stamperDown:int;

var shards:GameObject;
var peanuts:GameObject;

var stamper:GameObject;
@HideInInspector var platforms:GameObject[];
@HideInInspector var object:GameObject[];
@HideInInspector var objectValues:int[];
@HideInInspector var currentPlatform:int;

@HideInInspector var oreCount:int;
@HideInInspector var skipTimer:float;

@HideInInspector var moving:boolean;

@HideInInspector var goal:int;

function Start () {
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
	currentPlatform = 0;
	platforms = new GameObject[2 + (difficulty * 2)];
	object = new GameObject[platforms.Length];
	objectValues = new int[platforms.Length];
	for(var i:int = 0; i < platforms.Length; i++)
	{
		var newValue:int = Random.Range(0,difficulty);
		var randomCount:int = 0;
		if(i > 1)
		{
			while(newValue == objectValues[i-1]  && newValue == objectValues[i-2] && randomCount < 9)
			{
				newValue = Random.Range(0,difficulty);
				randomCount++;
			}
		}
		platforms[i] = Instantiate(platformPrefab, transform.position - Vector3(10 + ((i * 12) + speed * 2),3.4,2), Quaternion.identity);
		object[i] = Instantiate(objectPrefab[newValue], transform.position - Vector3(10 + ((i * 12) + speed * 2),.4,1.8), Quaternion.identity);
		object[i].transform.parent = platforms[i].transform;
		objectValues[i] = newValue;
	}
	
	stamperUp = 5.25;
	stamperDown = 1.2;
	moving = false;
	oreCount = 0;
	skipTimer = 0;
	goal = platforms.Length;
	length = 4 + 2/speed + (3 * (difficulty - 1));
	for(i = 0; i < platforms.Length; i++)
	{
		if(objectValues[i] == 2)
		{	
			object[i].GetComponent(SpriteRenderer).sprite = oreSprite[oreCount];
			length += 1.5;
		}
	}
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	timer = length;
}

function Update () {
	if(Input.GetKeyDown("space"))
	{
		Clicked();
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		finished = true;
		Finish(false);
	}
	if(currentPlatform == platforms.Length)
	{
		if(!finished)
		{
			finished = true;
			Finish(true);
		}
	}
	else
	{
		for(var thing:GameObject in platforms)
		{
			thing.transform.parent = transform;
			thing.transform.parent = platforms[currentPlatform].transform;
		}
	}
	if(currentPlatform < objectValues.Length && objectValues[currentPlatform] == 1)
	{
		skipTimer += Time.deltaTime;
	}
	var skipTimerMod:float = speed * .15;
	if(skipTimerMod > .45)
	{
		skipTimerMod = .45;
	}
	if(skipTimer > 1.35 - skipTimerMod)
	{
		Stamp(false);
	}
	if(!finished && currentPlatform < platforms.Length)
	{
		platforms[currentPlatform].transform.position.x = Mathf.MoveTowards(platforms[currentPlatform].transform.position.x, 0, Time.deltaTime * (speed * 5 + 17));
	}
	else if(!finished)
	{
		if(currentPlatform > 0)
		{
			platforms[currentPlatform - 1].transform.position.x = Mathf.MoveTowards(platforms[currentPlatform-1].transform.position.x, 10, Time.deltaTime * (speed * 5 + 17));
		}
		else
		{
			platforms[currentPlatform].transform.position.x = Mathf.MoveTowards(platforms[currentPlatform].transform.position.x, 10, Time.deltaTime * (speed * 5 + 17));
		}
	}
}

function Clicked () {
	for(var i:int = 0; i < platforms.length; i++)
	{
		if(Mathf.Abs(platforms[i].transform.position.x) < .3 && !finished && objectValues[i] == 1)
		{
			finished = true;
			Finish(false);
		}
	}
	moving = true;
	while(stamper.transform.position.y > stamperDown && moving)
	{
		stamper.transform.position.y = Mathf.MoveTowards(stamper.transform.position.y,stamperDown,Time.deltaTime * (speed * 5 + 25));
		yield;
	}
	Stamp(true);
	moving = false;
	while(stamper.transform.position.y < stamperUp && !moving && !finished)
	{
		stamper.transform.position.y = Mathf.MoveTowards(stamper.transform.position.y,stamperUp,Time.deltaTime * (speed * 5 + 25));
		yield;
	}
}

function Stamp(skip:boolean) {
	if(currentPlatform < platforms.Length)
	{
		if(platforms[currentPlatform].transform.position.x > -2)
		{
			switch(objectValues[currentPlatform])
			{
				case 0:
					peanuts.GetComponent.<ParticleSystem>().Emit(10);
					if(currentPlatform != platforms.Length)
					{
						object[currentPlatform].GetComponent(SpriteRenderer).sprite = oreSprite[3];
						currentPlatform ++;
					}
					break;
				case 1:	
					if(skip)
					{
						shards.GetComponent.<ParticleSystem>().Emit(10);
						if(!finished)
						{
							finished = true;
							Finish(false);
						}
					}
					else
					{
						skipTimer = 0;
						currentPlatform ++;
					}
					break;
				case 2:
					peanuts.GetComponent.<ParticleSystem>().Emit(5);
					if(oreCount < 2)
					{
						object[currentPlatform].GetComponent(SpriteRenderer).sprite = oreSprite[oreCount+1];
						oreCount ++;
					}
					else
					{
						object[currentPlatform].GetComponent(SpriteRenderer).sprite = oreSprite[3];
						currentPlatform++;
						oreCount = 0;
					}
					break;
				default:
					break;
			}
		}
	}
}

function Finish(completionStatus:boolean) {
	GameObject.FindGameObjectWithTag("GameController").BroadcastMessage("GameComplete",completionStatus,SendMessageOptions.DontRequireReceiver);
	finished = true;
}