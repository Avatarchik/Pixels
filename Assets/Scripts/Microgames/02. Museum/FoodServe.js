﻿#pragma strict

private var speed:int;
private var difficulty:int;
private var finished:boolean;
private var length:float;
private var timer:float;

private var darknessObject;

var failBack:GameObject;
var failBackMove:boolean;

var worldIntros:AudioClip[];
var darknessAmount:Color;

var plates:GameObject[];

var food0Sprites:Sprite[];
var food1Sprites:Sprite[];
var food2Sprites:Sprite[];
var food3Sprites:Sprite[];

var overfillSprite:Sprite;

@HideInInspector var plateFullness:int[];
@HideInInspector var plateSpeed:float[];
@HideInInspector var plateFoodType:int[];

@HideInInspector var clicked:boolean;

@HideInInspector var importantFinger:int;

@HideInInspector var distance:float;

var people:GameObject[];
@HideInInspector var peopleSpeed:float[];

@HideInInspector var firstNotify:boolean;

@HideInInspector var clickWait:float;

function Start () {
	failBackMove = false;
	failBack.transform.position.y = 12;
	if(Random.Range(0,10.0) < 1.5)
	{
		AudioManager.PlaySound(worldIntros[Random.Range(0,worldIntros.length)]);
	}
	clickWait = .1;
	firstNotify = false;
	distance = 5;
	clicked = false;
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
	peopleSpeed = new float[people.length];
	for(var i:int = 0; i < peopleSpeed.length; i++)
	{
		peopleSpeed[i] = Random.Range(2.5,10.5);
		if(people[i].transform.position.x > 0)
		{
			peopleSpeed[i] = -peopleSpeed[i];
		}
	}
	plateFullness = new int[plates.length];
	plateSpeed = new float[plates.length];
	plateFoodType = new int[plates.length];
	for(i = 0;i<plates.length;i++)
	{
		plateFullness[i] = 1;
		plateSpeed[i] = 1;
		plateFoodType[i] = Random.Range(0,food1Sprites.Length);
	}
	length = 5 + 2 * difficulty;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	StartCoroutine(ColorChange());
	Play();
}

function Update () {
	if(failBackMove)
	{
		failBack.transform.position.y = Mathf.MoveTowards(failBack.transform.position.y,0,Time.deltaTime * 10);
	}
	clickWait -= Time.deltaTime;
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		finished = true;
		Finish(true);
	}
	for(var i:int = 0;i<plates.length;i++)
	{
		if(!finished)
		{
			if(plateFoodType[i] == 0)
			{
				plates[i].GetComponent(SpriteRenderer).sprite = food0Sprites[plateFullness[i]];
			}
			if(plateFoodType[i] == 1)
			{
				plates[i].GetComponent(SpriteRenderer).sprite = food1Sprites[plateFullness[i]];
			}
			if(plateFoodType[i] == 2)
			{
				plates[i].GetComponent(SpriteRenderer).sprite = food2Sprites[plateFullness[i]];
			}
			if(plateFoodType[i] == 3)
			{
				plates[i].GetComponent(SpriteRenderer).sprite = food3Sprites[plateFullness[i]];
			}
		}
	}
	for(i = 0; i < peopleSpeed.length; i++)
	{
		if(Mathf.Abs(people[i].transform.position.x + (peopleSpeed[i] * Time.deltaTime)) > 9)
		{
			people[i].transform.localScale.x = people[i].transform.localScale.x * -1;
			peopleSpeed[i] = -peopleSpeed[i];
		}
		else
		{
			people[i].transform.position.x += peopleSpeed[i] * Time.deltaTime;
		}
	}
	if(importantFinger == -1)
	{
		clicked = false;
		for(i = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i))
			{
				importantFinger = i;
			}
		}
	}
	if(importantFinger != i && Finger.GetExists(importantFinger) && Finger.GetInGame(importantFinger) && !Master.paused)
	{
		
		var nearestNum:float = 1000;
		var rightPlate:int = -1;
		for(i = 0; i < plates.length; i++)
		{
			if(Mathf.Abs(Finger.GetPosition(importantFinger).x - plates[i].transform.position.x) < nearestNum)
			{
				nearestNum = Mathf.Abs(Finger.GetPosition(importantFinger).x - plates[i].transform.position.x);
				rightPlate = i;
			}
		}
		if(Mathf.Abs(Finger.GetPosition(importantFinger).x) < 9 && !clicked && clickWait < 0)
		{
			clicked = true;
			clickWait = .1;
			ClickPlate(rightPlate);
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
}

function Play () {
	ClickPlate(0);
	ClickPlate(1);
	ClickPlate(2);
	ClickPlate(3);
	yield WaitForSeconds(.4);
	FoodServe(0);
	FoodServe(1);
	FoodServe(2);
	FoodServe(3);
}

function ClickPlate(thisPlate:int) {
	if(plateFullness[thisPlate] > 1)
	{
		if(!finished)
		{
			plates[thisPlate].GetComponent(SpriteRenderer).sprite = overfillSprite;
			finished = true;
			failBackMove = true;
			yield WaitForSeconds(1.2);
			Finish(false);
		}
	}
	else
	{
		plateFoodType[thisPlate] = Random.Range(0,4);
		plateFullness[thisPlate] = 3;
		plateSpeed[thisPlate] = Random.Range(1.7,3.1) + (Random.Range(.4,.9) * speed);
	}
}

function FoodServe(thisPlate:int) {
	while(true && !finished)
	{
		var counter:float = 2.5;
		while(counter > 0)
		{
			counter -= plateSpeed[thisPlate] * Time.deltaTime;
			yield;
		}
		if(plateFullness[thisPlate]>0)
		{
			plateFullness[thisPlate]--;
			if(plateFullness[thisPlate] < 2 && !firstNotify)
			{
				firstNotify = true;
				transform.BroadcastMessage("NextNotify",SendMessageOptions.DontRequireReceiver);
			}
		}
		else if(!finished)
		{
			Finish(false);
		}
	}
	yield;
}		

function Finish(completionStatus:boolean) {
	if(Application.loadedLevelName == "MicroTester")
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(completionStatus);
	}
	else 
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).GameComplete(completionStatus);
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", Color(0,0,0,0),SendMessageOptions.DontRequireReceiver);
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