#pragma strict

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var darknessObject;
var darknessAmount:Color;


var diamond:GameObject;
var robot:GameObject;
var lasers:GameObject[];
var laserSprites:Sprite[];

@HideInInspector var leftRobotLimit:float;
@HideInInspector var rightRobotLimit:float;

@HideInInspector var killDistance:float;
@HideInInspector var grabDiamondDistance:float;

@HideInInspector var order1:int[];
@HideInInspector var order2:int[];
@HideInInspector var order3:int[];
@HideInInspector var thisOrder:int[];

@HideInInspector var laserSpeed:float;

@HideInInspector var importantFinger:int;
@HideInInspector var fingerDistance:float;

function Start () {
	killDistance = 1;
	grabDiamondDistance = 2.5;
	fingerDistance = 4;
	
	leftRobotLimit = -5.5;
	rightRobotLimit = 2.96;
	
	order1 = new int[4];
	order2 = new int[4];
	order3 = new int[4];
	
	order1 = [0,1,2,3];
	order2 = [0,2,1,3];
	order3 = [3,2,0,1];
	
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
	
	if(difficulty == 1)
	{
		thisOrder = order1;
	}
	else if(difficulty == 2)
	{
		thisOrder = order2;
	}
	else
	{
		thisOrder = order3;
	}
	
	for(var i:int = 0;i<lasers.length;i++)
	{
		lasers[i].GetComponent(SpriteRenderer).sprite = laserSprites[0];
	}
	laserSpeed = .2 + (.25/speed);
	length = laserSpeed * 24;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	StartCoroutine(ColorChange());
	StartCoroutine(Play());
}

function Update () {
	timer -= Time.deltaTime;
	if(timer < 0)
	{
		Finish(false);
	}
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
	else if(Finger.GetExists(importantFinger))
	{
		if(Mathf.Abs(Finger.GetPosition(importantFinger).x - robot.transform.position.x) < fingerDistance)
		{
			if(Finger.GetPosition(importantFinger).x <= leftRobotLimit)
			{
				robot.transform.position.x = Mathf.MoveTowards(robot.transform.position.x,leftRobotLimit, Time.deltaTime * 5);
			}	
			else if(Finger.GetPosition(importantFinger).x >= rightRobotLimit)
			{
				robot.transform.position.x = Mathf.MoveTowards(robot.transform.position.x,rightRobotLimit, Time.deltaTime * 5);
			}
			else
			{
				robot.transform.position.x = Mathf.MoveTowards(robot.transform.position.x,Finger.GetPosition(importantFinger).x, Time.deltaTime * 5);
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	if(Mathf.Abs(robot.transform.position.x - diamond.transform.position.x) < grabDiamondDistance)
	{
		Debug.Log("hey");
	}
}

function Play () {
	var laserMarker:int = 0;
	while(!finished)
	{
		yield WaitForSeconds(laserSpeed * 1.7);
		LaserFire(lasers[thisOrder[laserMarker]].GetComponent(SpriteRenderer));
		laserMarker ++;
		if(laserMarker >= lasers.Length)
		{
			laserMarker = 0;
		}
		yield;
	}
	yield;
}

function LaserFire (laser:SpriteRenderer) {
	laser.sprite = laserSprites[1];
	yield WaitForSeconds(laserSpeed/2);
	laser.sprite = laserSprites[2];
	yield WaitForSeconds(laserSpeed/2);
	laser.sprite = laserSprites[3];
	var tempCounter:float = laserSpeed;
	while(tempCounter > 0)
	{
		tempCounter -= Time.deltaTime;
		if(Mathf.Abs(robot.transform.position.x-laser.transform.position.x) < killDistance)
		{
			Finish(false);
		}
		yield;
	}
	laser.sprite = laserSprites[0];
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
		DarknessChange.newColor = Color(0,0,0,0);
	}
}

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	DarknessChange.newColor = darknessAmount;
	yield;
}