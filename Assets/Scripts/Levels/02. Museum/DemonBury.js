#pragma strict

private var speed:int;
private var difficulty:int;
private var finished:boolean;
private var length:float;
private var timer:float;

private var darknessObject;
var darknessAmount:Color;

@HideInInspector var importantFinger:int;

var boardBase:GameObject;

var boards:SpriteRenderer[];
var fire:SpriteRenderer[];

var candles1:GameObject[];
var candles2:GameObject[];
var candles3:GameObject[];

var board1Sprites:Sprite[];
var board2Sprites:Sprite[];
var board3Sprites:Sprite[];

var highlight:GameObject;

var demon:SpriteRenderer;
var demonSprites:Sprite[];
@HideInInspector var demonSpriteCount:int;

@HideInInspector var movementSpeed:float;

@HideInInspector var upPosition:float;
@HideInInspector var downPosition:float;

@HideInInspector var candles1Pressed:boolean[];
@HideInInspector var candles2Pressed:boolean[];
@HideInInspector var candles3Pressed:boolean[];

@HideInInspector var candles1Counter:int;
@HideInInspector var candles2Counter:int;
@HideInInspector var candles3Counter:int;

@HideInInspector var clickCounter:float;
@HideInInspector var maxDistance:float;

function Start () {
	demonSpriteCount = 0;
	clickCounter = .2;
	maxDistance = 3;
	movementSpeed = 17;
	upPosition = 0;
	downPosition = -9.5;
	boardBase.transform.position.y = downPosition;
	if(Application.loadedLevelName == "MicroTester")
	{
		speed = MicroTester.timeMultiplier;
		difficulty = MicroTester.difficulty;
	}
	else
	{
		speed = GameManager.bossDifficulty;
		difficulty = GameManager.bossDifficulty;
	}
	candles1Counter = 0;
	candles2Counter = 0;
	candles3Counter = 0;
	candles1Pressed = new boolean[candles1.length];
	candles2Pressed = new boolean[candles2.length];
	candles3Pressed = new boolean[candles3.length];
	
	for(var i:int = 0; i < candles1.length; i++)
	{
		candles1Pressed[i] = false;
		candles1[i].GetComponent(SpriteRenderer).color.a = 0;
	}
	for(i = 0; i < candles2.length; i++)
	{
		candles2Pressed[i] = false;
		candles2[i].GetComponent(SpriteRenderer).color.a = 0;
	}
	for(i = 0; i < candles3.length; i++)
	{
		candles3Pressed[i] = false;
		candles3[i].GetComponent(SpriteRenderer).color.a = 0;
	}
	for(i = 0; i < boards.length; i++)
	{
		boards[i].color.a = 0;
		fire[i].color.a = 0;
	}
	var speedMod:int;
	speedMod = 6-speed;
	if(speedMod < 3)
	{
		speedMod = 3;
	}
	length = 15 + speedMod;
	timer = length - .5;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	StartCoroutine(ColorChange());
	StartCoroutine(Play());
}

function Update () {
	demon.sprite = demonSprites[demonSpriteCount];
	if(Input.GetKeyDown("space"))
	{
		AddOne();
	}
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
	if(Finger.GetExists(importantFinger))
	{
		if(clickCounter <= 0 && Vector2.Distance(Finger.GetPosition(importantFinger),highlight.transform.position) < maxDistance)
		{
			AddOne();
			clickCounter = .2;
		}
		else if(clickCounter > 0)
		{
			clickCounter -= Time.deltaTime;
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		clickCounter = 0;
		importantFinger = -1;
	}
	
	if(candles1Counter<candles1.Length)
	{
		highlight.transform.position.x = candles1[candles1Counter].transform.position.x;
		highlight.transform.position.y = candles1[candles1Counter].transform.position.y - 1.8;
	}
	else if(candles1Counter==candles1.Length)
	{
		highlight.transform.position.x = candles1[0].transform.position.x;
		highlight.transform.position.y = candles1[0].transform.position.y - 1.8;
	}
	else if(candles2Counter<candles2.Length)
	{
		highlight.transform.position.x = candles2[candles2Counter].transform.position.x;
		highlight.transform.position.y = candles2[candles2Counter].transform.position.y - 1.8;
	}
	else if(candles2Counter==candles2.Length)
	{
		highlight.transform.position.x = candles2[0].transform.position.x;
		highlight.transform.position.y = candles2[0].transform.position.y - 1.8;
	}
	else if(candles3Counter<candles3.Length)
	{
		highlight.transform.position.x = candles3[candles3Counter].transform.position.x;
		highlight.transform.position.y = candles3[candles3Counter].transform.position.y - 1.8;
	}
	else if(candles3Counter==candles3.Length)
	{
		highlight.transform.position.x = candles3[0].transform.position.x;
		highlight.transform.position.y = candles3[0].transform.position.y - 1.8;
	}
	
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false);
	}
}

function Play () {
	var waitTime:float = .5;
	boards[0].color.a = 1;
	yield WaitForSeconds(waitTime);
	while(Mathf.Abs(boardBase.transform.position.y - upPosition) > .1)
	{
		boardBase.transform.position.y = Mathf.MoveTowards(boardBase.transform.position.y, upPosition, Time.deltaTime * movementSpeed);
		yield;
	}
	while(candles1Counter <= candles1.Length)
	{
		yield;
	}
	highlight.GetComponent(SpriteRenderer).color.a = 0;
	while(fire[0].color.a != 1)
	{
		fire[0].color.a = Mathf.MoveTowards(fire[0].color.a,1,Time.deltaTime * 5);
		yield;
	}
	demonSpriteCount ++;
	yield WaitForSeconds(waitTime);
	while(Mathf.Abs(boardBase.transform.position.y - downPosition) > .1)
	{
		boardBase.transform.position.y = Mathf.MoveTowards(boardBase.transform.position.y, downPosition, Time.deltaTime * movementSpeed);
		yield;
	}
	TurnOff();
	yield WaitForSeconds(.2);
	boards[1].color.a = 1;
	while(Mathf.Abs(boardBase.transform.position.y - upPosition) > .1)
	{
		boardBase.transform.position.y = Mathf.MoveTowards(boardBase.transform.position.y, upPosition, Time.deltaTime * movementSpeed);
		yield;
	}
	while(candles2Counter <= candles2.Length)
	{
		yield;
	}
	highlight.GetComponent(SpriteRenderer).color.a = 0;
	while(fire[1].color.a != 1)
	{
		fire[1].color.a = Mathf.MoveTowards(fire[1].color.a,1,Time.deltaTime * 5);
		yield;
	}
	demonSpriteCount ++;
	yield WaitForSeconds(waitTime);
	while(Mathf.Abs(boardBase.transform.position.y - downPosition) > .1)
	{
		boardBase.transform.position.y = Mathf.MoveTowards(boardBase.transform.position.y, downPosition, Time.deltaTime * movementSpeed);
		yield;
	}
	TurnOff();
	yield WaitForSeconds(.2);
	boards[2].color.a = 1;
	while(Mathf.Abs(boardBase.transform.position.y - upPosition) > .1)
	{
		boardBase.transform.position.y = Mathf.MoveTowards(boardBase.transform.position.y, upPosition, Time.deltaTime * movementSpeed);
		yield;
	}
	while(candles3Counter <= candles3.Length)
	{
		yield;
	}
	highlight.GetComponent(SpriteRenderer).color.a = 0;
	while(fire[2].color.a != 1)
	{
		fire[2].color.a = Mathf.MoveTowards(fire[2].color.a,1,Time.deltaTime * 5);
		yield;
	}
	demonSpriteCount ++;
	yield WaitForSeconds(waitTime);
	while(Mathf.Abs(boardBase.transform.position.y - downPosition) > .1)
	{
		boardBase.transform.position.y = Mathf.MoveTowards(boardBase.transform.position.y, downPosition, Time.deltaTime * movementSpeed);
		yield;
	}
	while(demonSpriteCount < demonSprites.length-1 && !finished)
	{
		yield WaitForSeconds(waitTime);
		demonSpriteCount ++;
	}
	Finish(true);
}

function Finish(completionStatus:boolean) {
	if(!finished)
	{
		finished = true;
		if(Application.loadedLevelName == "MicroTester")
		{
			GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(completionStatus);
		}
		else 
		{
			GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).GameComplete(completionStatus);
		}
		GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", Color(0,0,0,0),SendMessageOptions.DontRequireReceiver);
	}
}

function AddOne () {
	if(candles1Counter<=candles1.Length)
	{
		if(candles1Counter<candles1.Length)
		{
			candles1[candles1Counter].GetComponent(SpriteRenderer).color.a = 1;
		}
		boards[0].sprite = board1Sprites[candles1Counter];
		candles1Counter ++;
	}
	else if(candles2Counter<=candles2.Length)
	{
		if(candles2Counter<candles2.Length)
		{
			candles2[candles2Counter].GetComponent(SpriteRenderer).color.a = 1;
		}
		boards[1].sprite = board2Sprites[candles2Counter];
		candles2Counter ++;
	}
	else if(candles3Counter<=candles3.Length)
	{
		if(candles3Counter<candles3.Length)
		{
			candles3[candles3Counter].GetComponent(SpriteRenderer).color.a = 1;
		}
		boards[2].sprite = board3Sprites[candles3Counter];
		candles3Counter ++;
	}
}

function TurnOff () {
	for(var i:int = 0; i < candles1.length; i++)
	{
		candles1[i].GetComponent(SpriteRenderer).color.a = 0;
	}
	for(i = 0; i < candles2.length; i++)
	{
		candles2[i].GetComponent(SpriteRenderer).color.a = 0;
	}
	for(i = 0; i < candles3.length; i++)
	{
		candles3[i].GetComponent(SpriteRenderer).color.a = 0;
	}
	for(i = 0; i < boards.length; i++)
	{
		boards[i].color.a = 0;
		fire[i].color.a = 0;
	}
	highlight.GetComponent(SpriteRenderer).color.a = 1;
}
function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", darknessAmount,SendMessageOptions.DontRequireReceiver);
	yield;
}