#pragma strict

private var speed:int;
private var difficulty:int;
private var finished:boolean;
private var length:float;
private var timer:float;

private var darknessObject;

var darknessAmount:Color;

var people:GameObject[];
@HideInInspector var peopleSpriteValue:int[];
@HideInInspector var peopleWalkValue:int[];
@HideInInspector var peopleCurrentSprite:int[];
@HideInInspector var peopleStart:float[];
@HideInInspector var peopleWalk1:float[];
@HideInInspector var peopleEnd:float[];
@HideInInspector var goal:float[];
@HideInInspector var movementSpeed:float;

var peopleSittingSprites:Sprite[];
var peopleWalkSprites1:Sprite[];
var peopleWalkSprites2:Sprite[];
var peopleStandSprites:Sprite[];

var countDownSprites:Sprite[];
var countDownObject:SpriteRenderer;

var creditsObject:GameObject;

@HideInInspector var creditsSpeed:float;
@HideInInspector var lengthOfCountdown:float;
@HideInInspector var clicked:boolean;
@HideInInspector var importantFinger:int;

var walkSound:AudioClip;

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
	var tempSpeed:float = .43;
	if(speed <= 6)
	{
		tempSpeed -= (speed * .035);
	}
	else
	{
		tempSpeed -= (6 * .035);
	}
	tempSpeed -= difficulty * .03;
	
	length = .3 + difficulty * 8 * tempSpeed;
	timer = length;
	
	lengthOfCountdown = length/2;
	
	creditsSpeed = 48/length;
	
	movementSpeed = 15 + 5 * speed;
	peopleSpriteValue = new int[people.length];
	peopleWalkValue = new int[people.length];
	peopleCurrentSprite = new int[people.length];
	peopleStart = new float[people.length];
	peopleWalk1 = new float[people.length];
	peopleEnd = new float[people.length];
	goal = new float[people.length];

	for(var i:int = 0; i < people.length; i++)
	{
		peopleSpriteValue[i] = Random.Range(0,peopleSittingSprites.length);
		peopleWalkValue[i] = 1;
		peopleCurrentSprite[i] = 0;
		peopleStart[i] = people[i].transform.position.x;
		goal[i] = peopleStart[i];
		if(people[i].transform.position.x > 0)
		{
			peopleWalk1[i] = people[i].transform.position.x + 2;
			peopleEnd[i] = 17;
		}
		else
		{
			peopleWalk1[i] = people[i].transform.position.x - 2;
			peopleEnd[i] = -17;
		}
		if(i > difficulty * 8 - 1)
		{
			peopleWalkValue[i] = 0;
			people[i].transform.position.x = peopleEnd[i];
		}
	}
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	StartCoroutine(ColorChange());
	Play();
	StartCoroutine(Walking());
}

function Update () {
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
	if(Finger.GetExists(importantFinger) && Finger.GetInGame(importantFinger) && !Master.paused && !clicked)
	{
		Clicked();
		clicked = true;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	
	creditsObject.transform.position.y += Time.deltaTime * creditsSpeed;
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
	var successCount:int = 0;
	for(i = 0; i < people.length; i++)
	{
		switch(peopleWalkValue[i])
		{
			case 1:
				goal[i] = peopleStart[i];
				break;
			case 0:
				goal[i] = peopleEnd[i];
				successCount ++;
				break;
			default:
				break;
		}
		people[i].transform.position.x = Mathf.MoveTowards(people[i].transform.position.x,goal[i],Time.deltaTime*movementSpeed);
	}
	if(successCount >= people.length && !finished)
	{
		finished = true;
		Finish(true,1);
	}
}

function Play () {
	var countDownSpriteNumber:int = 11;
	while(true)
	{
		if(timer < lengthOfCountdown && Mathf.RoundToInt((timer/lengthOfCountdown)*12)-1 >= 0)
		{
			countDownObject.sprite = countDownSprites[Mathf.RoundToInt((timer/lengthOfCountdown)*12)-1];
		}
		yield;
	}
	yield;
}

function Walking () {
	var walk1:boolean = true;
	while(true)
	{
		for(var i:int = 0; i < people.length; i ++)
		{
			if(peopleWalkValue[i] < 1 && walk1)
			{
				people[i].GetComponent(SpriteRenderer).sprite = peopleWalkSprites1[peopleSpriteValue[i]];
			}
			else if(peopleWalkValue[i] < 1 && !walk1)
			{
				people[i].GetComponent(SpriteRenderer).sprite = peopleWalkSprites2[peopleSpriteValue[i]];
			}
			else
			{
				people[i].GetComponent(SpriteRenderer).sprite = peopleSittingSprites[peopleSpriteValue[i]];
			}
		}
		yield WaitForSeconds(.2);
		walk1 = !walk1;
	}
}

function Finish(completionStatus:boolean) {
	Finish(completionStatus,0);
}

function Finish(completionStatus:boolean,waitTime) {
	UITimer.soundsOn = !completionStatus;
	yield WaitForSeconds(waitTime);
	if(Application.loadedLevelName == "MicroTester")
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(completionStatus);
	}
	else 
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).GameComplete(completionStatus);
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", Color(1,1,1,1),SendMessageOptions.DontRequireReceiver);
	finished = true;
}

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", darknessAmount,SendMessageOptions.DontRequireReceiver);
	yield;
}

function Clicked () {
	RemoveHit();
}

function RemoveHit() {
	if(Random.value < .4)
	{
		AudioManager.PlaySound(walkSound);
	}
	var randomLimit:int = 10;
	while(randomLimit > 0)
	{	
		var choice:int = Random.Range(0,people.length);
		if(peopleWalkValue[choice] > 0 && !finished)
		{
			Jump(people[choice]);
			peopleWalkValue[choice] --;
			break;
		}
		else
		{
			randomLimit --;
		}
	}
	if(randomLimit <= 0)
	{
		for(var i:int = 0; i < people.length; i++)
		{
			if(peopleWalkValue[i] > 0 && !finished)
			{
				peopleWalkValue[i] --;
				break;
			}
		}
	}
}

function Jump(object:GameObject) {
	var start:float = object.transform.position.y;
	var counter:float = 0;
	while(counter < Mathf.PI)
	{
		object.transform.position.y = start + Mathf.Sin(counter);
		counter += Time.deltaTime * 20;
		yield;
	}
}