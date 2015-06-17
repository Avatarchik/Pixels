#pragma strict

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var darknessObject;

var failBack:GameObject;
var failBackMove:boolean;

var worldIntros:AudioClip[];

var darknessAmount:Color;


var diamond:GameObject;
var robot:GameObject;
var lasers:GameObject[];
var laserSprites:Sprite[];

var gotDiamondSprite:Sprite;

var robotNot:SpriteRenderer;

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

@HideInInspector var positions:float[];
@HideInInspector var goal:int;

function Start () {
	failBackMove = false;
	failBack.transform.position.y = 12;
	if(Random.Range(0,10) < 3)
	{
		AudioManager.PlaySound(worldIntros[Random.Range(0,worldIntros.length)]);
	}
	positions = new float[5];
	goal = 0;
	killDistance = 1;
	grabDiamondDistance = 2.5;
	fingerDistance = 6;
	
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
	positions[0] = robot.transform.position.x;
	positions[1] = lasers[0].transform.position.x;
	positions[2] = lasers[1].transform.position.x;
	positions[3] = lasers[2].transform.position.x;
	positions[4] = rightRobotLimit;
	StartCoroutine(ColorChange());
	StartCoroutine(Play());
}

function Update () {
	if(failBackMove)
	{
		failBack.transform.position.y = Mathf.MoveTowards(failBack.transform.position.y,0,Time.deltaTime * 10);
	}
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
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		
		if(Mathf.Abs(Finger.GetPosition(importantFinger).x) < 9.5 && Mathf.Abs(Finger.GetPosition(importantFinger).y) < 9.5)
		{
			if(robot.transform.position.x >= positions[goal]-.1)
			{
				goal = Mathf.MoveTowards(goal,positions.Length-1,1);
			}
			robotNot.color.a = 1;
		}
		else
		{
			robotNot.color.a = 0;
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		robotNot.color.a = 0;
		importantFinger = -1;
	}
	if(!finished)
	{
		robot.transform.position.x = Mathf.MoveTowards(robot.transform.position.x,positions[goal], Time.deltaTime * (3 + speed*2));
	}
	if(Mathf.Abs(robot.transform.position.x - diamond.transform.position.x) < grabDiamondDistance)
	{
		diamond.transform.parent = robot.transform;
		if(!finished)
		{
			Finish(true);
			diamond.GetComponent(SpriteRenderer).sprite = gotDiamondSprite;
		}
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
	if(!finished)
	{
		while(tempCounter > 0)
		{
			tempCounter -= Time.deltaTime;
			if(Mathf.Abs(robot.transform.position.x-laser.transform.position.x) < killDistance && !finished)
			{
				robot.GetComponent(ParticleSystem).emissionRate = 200;
				failBackMove = true;
				Finish(false);
			}
			yield;
		}
	}
	laser.sprite = laserSprites[0];
}
function Finish(completionStatus:boolean) {
	if(!finished)
	{
		finished = true;
		if(completionStatus)
		{
			yield WaitForSeconds(.5);
		}
		else
		{
			yield WaitForSeconds(.8);
		}
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

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", darknessAmount,SendMessageOptions.DontRequireReceiver);
	yield;
}