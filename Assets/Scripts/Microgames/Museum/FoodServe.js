#pragma strict

private var speed:int;
private var difficulty:int;
private var finished:boolean;
private var length:float;
private var timer:float;

private var darknessObject;
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

function Start () {
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
	plateFullness = new int[plates.length];
	plateSpeed = new float[plates.length];
	plateFoodType = new int[plates.length];
	for(var i:int = 0;i<plates.length;i++)
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
	else if(Finger.GetExists(importantFinger))
	{
		var nearestNum:float = 1000;
		var rightPlate:int = -1;
		for(i = 0; i < plates.length; i++)
		{
			if(Vector2.Distance(Finger.GetPosition(importantFinger),plates[i].transform.position) < nearestNum)
			{
				nearestNum = Vector2.Distance(Finger.GetPosition(importantFinger),plates[i].transform.position);
				rightPlate = i;
			}
		}
		if(Vector2.Distance(Finger.GetPosition(importantFinger),plates[rightPlate].transform.position) < distance && !clicked)
		{
			Debug.Log(rightPlate);
			clicked = true;
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
			Finish(false);
		}
	}
	else
	{
		plateFoodType[thisPlate] = Random.Range(0,4);
		plateFullness[thisPlate] = 3;
		plateSpeed[thisPlate] = Random.Range(1.5,2.5) + (Random.Range(.3,.6) * speed);
	}
}

function FoodServe(thisPlate:int) {
	while(true && !finished)
	{
		var counter:float = 3;
		while(counter > 0)
		{
			counter -= plateSpeed[thisPlate] * Time.deltaTime;
			yield;
		}
		if(plateFullness[thisPlate]>0)
		{
			plateFullness[thisPlate]--;
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
	DarknessChange.newColor = Color(0,0,0,0);
	finished = true;
}

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	DarknessChange.newColor = darknessAmount;
	yield;
}