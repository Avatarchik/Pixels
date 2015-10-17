#pragma strict

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

var treePrefab:GameObject;
private var trees:GameObject[];

var treeSprites1:Sprite[];
var treeSprites2:Sprite[];
var treeSprites3:Sprite[];
var treeSprites4:Sprite[];

private var numberOfTrees:int;
private var currentTree:int;
private var treeSpriteValues:int[];
private var treeRingValues:int[];
private var treeRingSubmitted:int[];
private var treeGoal:float[];

private var treeStartValue:Vector3;
private var goal2:float;
private var goal3:float;
private var goal4:float;
private var goalHeight:float;
private var distance:float;

private var allowable:int;

var woodParts:ParticleSystem[];
var smokeParts:ParticleSystem[];

// IMPORTANT TOUCH INFO
private var importantFinger:int;

function Start () {
	failBackMove = false;
	failBack.transform.position.y = 12;
	if(Random.Range(0,10.0) < 2.5)
	{
		AudioManager.PlaySound(worldIntros[Random.Range(0,worldIntros.length)]);
	}
	currentTree = 0;
	importantFinger = -1;
	treeStartValue = Vector3(-1.41,-4.78,2.5);
	goal2 = -4.92;
	goal3 = 0;
	goal4 = 4.92;
	goalHeight = -.57;
	distance = 2.46;
	
	
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
	numberOfTrees = 5+difficulty;
	var treeLength:float = 2 - (speed*.2);
	if(treeLength < .9)
	{
		treeLength = .9;
	}
	length = numberOfTrees * treeLength;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	
	
	
	trees = new GameObject[numberOfTrees];
	treeSpriteValues = new int[numberOfTrees];
	treeRingValues = new int[numberOfTrees];
	treeRingSubmitted = new int[numberOfTrees];
	treeGoal = new float[numberOfTrees];
	if(difficulty == 1){allowable=3;}	else if(difficulty == 2){allowable=6;}	else{allowable=treeSprites1.Length;}
	for(var i:int = 0;i < numberOfTrees;i++)
	{
		var thisTreeValue:int;
		thisTreeValue = Random.Range(0,allowable);
		trees[i] = Instantiate(treePrefab,treeStartValue + Vector3(0,0,.01 * i),Quaternion.identity);
		if(thisTreeValue == 0 || thisTreeValue == 3 || thisTreeValue == 6)
		{
			treeRingValues[i] = 2;
		}
		if(thisTreeValue == 1 || thisTreeValue == 4 || thisTreeValue == 7)
		{
			treeRingValues[i] = 3;
		}
		if(thisTreeValue == 2|| thisTreeValue == 5 || thisTreeValue == 8)
		{
			treeRingValues[i] = 4;
		}
		treeSpriteValues[i] = thisTreeValue;
		trees[i].GetComponent(SpriteRenderer).sprite = treeSprites1[thisTreeValue];
		trees[i].transform.parent = transform;
	}
	StartCoroutine(ColorChange());
	Play();
	FirstTime();
}

function Update () {
	if(failBackMove)
	{
		failBack.transform.position.y = Mathf.MoveTowards(failBack.transform.position.y,0,Time.deltaTime * 10);
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false);
	}
	else if(currentTree >= numberOfTrees && !finished)
	{
		Finish(true);
	}
	for(var i:int = 0;i < numberOfTrees;i++)
	{
		if(currentTree < i)
		{
			trees[i].GetComponent(SpriteRenderer).color = Color(.6,.6,.6,1);
		}
		else if(currentTree == i)
		{
			trees[i].GetComponent(SpriteRenderer).color = Color(1,1,1,1);
		}
		if(trees[i]!=null)
		{
			if(i<currentTree && trees[i].transform.position.x != treeGoal[i])
			{
				trees[i].transform.position.y = Mathf.MoveTowards(trees[i].transform.position.y,goalHeight,Time.deltaTime*2);
				trees[i].transform.position.x = Mathf.MoveTowards(trees[i].transform.position.x,treeGoal[i],Time.deltaTime*6);
				if(trees[i].transform.position.x == treeGoal[i])
				{
					SpriteRotate(trees[i],treeSpriteValues[i],i);
					if(treeRingValues[i] != treeRingSubmitted[i])
					{
						SmokeEmit(treeRingSubmitted[i]);
						EndGame(treeRingSubmitted[i]);
					}
					else
					{
						WoodEmit(treeRingSubmitted[i]);
					}
				}
			}
			else if(i<currentTree)
			{
				if(treeRingValues[i] == treeRingSubmitted[i])
				{
					trees[i].transform.position.y = Mathf.MoveTowards(trees[i].transform.position.y,3,Time.deltaTime*6);
				}
				else
				{
					trees[i].transform.position.y = Mathf.MoveTowards(trees[i].transform.position.y,1.12,Time.deltaTime*6);
				}
			}
		}
	}
	if(currentTree < trees.Length && trees[currentTree].transform.position.y > goalHeight)
	{
		if(Mathf.Abs(trees[currentTree].transform.position.x - goal2) < distance)
		{
			treeRingSubmitted[currentTree] = 2;
			treeGoal[currentTree] = goal2;
			currentTree++;
		}
		else if(Mathf.Abs(trees[currentTree].transform.position.x - goal3) < distance)
		{
			treeRingSubmitted[currentTree] = 3;
			treeGoal[currentTree] = goal3;
			currentTree++;
		}
		else if(Mathf.Abs(trees[currentTree].transform.position.x - goal4) < distance)
		{
			treeRingSubmitted[currentTree] = 4;
			treeGoal[currentTree] = goal4;
			currentTree++;
		}
	}
	if(importantFinger == -1)
	{
		for(i = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i) && Finger.GetInGame(i))
			{
				importantFinger = i;
				break;
			}
		}
	}
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		if(currentTree < trees.Length && Vector2.Distance(Finger.GetPosition(importantFinger),trees[currentTree].transform.position) < 2)
		{
			trees[currentTree].transform.position.x = Finger.GetPosition(importantFinger).x;
			trees[currentTree].transform.position.y = Finger.GetPosition(importantFinger).y;
			if(trees[currentTree].transform.position.x > 9)
			{
				trees[currentTree].transform.position.x = 9;
			}
			if(trees[currentTree].transform.position.x < -9)
			{
				trees[currentTree].transform.position.x = -9;
			}
			if(trees[currentTree].transform.position.y < -6)
			{
				trees[currentTree].transform.position.y = -6;
			}
			if(trees[currentTree].transform.position.y > goalHeight + .1)
			{
				trees[currentTree].transform.position.y = goalHeight + .1;
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
}

function Play () {

}

function Finish(completionStatus:boolean) {
	UITimer.soundsOn = !completionStatus;
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

function SpriteRotate(object:GameObject,sprite:int,treeNumber:int) { 
	yield WaitForSeconds(.05);
	object.GetComponent(SpriteRenderer).sprite = treeSprites2[sprite];
	yield WaitForSeconds(.1);
	object.GetComponent(SpriteRenderer).sprite = treeSprites3[sprite];
	yield WaitForSeconds(.1);
	if(treeRingValues[treeNumber] == treeRingSubmitted[treeNumber])
	{
		object.GetComponent(SpriteRenderer).sprite = treeSprites4[sprite];
		yield WaitForSeconds(.1);
		Destroy(object);
	}
}

function EndGame(lane:int) { 
	failBackMove = true;
	yield WaitForSeconds(1);
	//Stuff with particles.
	if(!finished)
	{
		finished = true;
		Finish(false);
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

function WoodEmit (which:int) {
	woodParts[which-2].emissionRate = 300;
	yield WaitForSeconds(.5);
	woodParts[which-2].emissionRate = 0;
}
function SmokeEmit (which:int) {
	smokeParts[which-2].emissionRate = 30;
	yield WaitForSeconds(1.5);
	smokeParts[which-2].emissionRate = 0;
}

function FirstTime () {
	var waitTime:float = .2;
	while(true)
	{	
		if(treeRingValues[currentTree] == 2)
		{
			MicroGameManager.choice = 0;
		}
		else if(treeRingValues[currentTree] == 3)
		{
			MicroGameManager.choice = 3;
		}
		else if(treeRingValues[currentTree] == 4)
		{
			MicroGameManager.choice = 6;
		}
		yield WaitForSeconds(waitTime);
		if(treeRingValues[currentTree] == 2)
		{
			MicroGameManager.choice = 1;
		}
		else if(treeRingValues[currentTree] == 3)
		{
			MicroGameManager.choice = 4;
		}
		else if(treeRingValues[currentTree] == 4)
		{
			MicroGameManager.choice = 7;
		}
		yield WaitForSeconds(waitTime);if(treeRingValues[currentTree] == 2)
		{
			MicroGameManager.choice = 2;
		}
		else if(treeRingValues[currentTree] == 3)
		{
			MicroGameManager.choice = 5;
		}
		else if(treeRingValues[currentTree] == 4)
		{
			MicroGameManager.choice = 8;
		}
		yield WaitForSeconds(waitTime);
		if(finished)
		{
			MicroGameManager.choice = 10;
		}
		yield;
	}
}