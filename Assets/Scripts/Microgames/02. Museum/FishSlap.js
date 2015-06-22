#pragma strict

private var speed:int;
private var difficulty:int;
private var finished:boolean;
private var length:float;
private var timer:float;

var failBack:GameObject;
var failBackMove:boolean;

var worldIntros:AudioClip[];

var darknessAmount:Color;

var fishSizeSprites:Sprite[];

var fishColors1:Color[];
var fishColors2:Color[];

var fishPrefab:GameObject;

var iconLeft:GameObject;
var iconRight:GameObject;

var barrier:GameObject;

var barrierSprites:Sprite[];
var bloodMaterial:Material;

var flowLeft:SpriteRenderer;
var flowRight:SpriteRenderer;

var flowSprites:Sprite[];

var leftCounter:SpriteRenderer;
var rightCounter:SpriteRenderer;
var countingSprites:Sprite[];
var warningSprite:Sprite;

@HideInInspector var leftCounterNumber:int = 0;
@HideInInspector var rightCounterNumber:int = 0;

@HideInInspector var barrierGoal:int;
@HideInInspector var leftFlowGoal:int;
@HideInInspector var rightFlowGoal:int;
@HideInInspector var startLocation:Vector3;
@HideInInspector var topLeft:Vector3;
@HideInInspector var topCenter:Vector3;
@HideInInspector var topRight:Vector3;
@HideInInspector var bottomLeft:Vector3;
@HideInInspector var bottomRight:Vector3;

@HideInInspector var color1:int;
@HideInInspector var color2:int;

@HideInInspector var fish:GameObject[];
@HideInInspector var leftFish:boolean[];
@HideInInspector var done:boolean[];
@HideInInspector var selection:int[];
@HideInInspector var currentFish:int;
@HideInInspector var fishDirection:boolean[];
@HideInInspector var fishMovementSpeed:float;
@HideInInspector var counted:boolean[];

@HideInInspector var importantFinger:int;
@HideInInspector var clicked:boolean;

function Start () {
	failBackMove = false;
	failBack.transform.position.y = 12;
	if(Random.Range(0,10.0) < 1.5)
	{
		AudioManager.PlaySound(worldIntros[Random.Range(0,worldIntros.length)]);
	}
	clicked = false;
	importantFinger = -1;
	startLocation = Vector3(0,6.5,3.65);
	topLeft = Vector3(-5.88,3.45,3.65);
	topCenter = Vector3(0,3.45,3.65);
	topRight = Vector3(5.88,3.45,3.65);
	bottomLeft = Vector3(-5.88,-5.19,3.65);
	bottomRight = Vector3(5.88,-5.19,3.65);
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
	fishMovementSpeed = 9 + (speed * 2);
	currentFish = 0;
	fish = new GameObject[8];
	leftFish = new boolean[fish.length];
	selection = new int[fish.length];
	done = new boolean[fish.length];
	counted = new boolean[fish.length];
	fishDirection = new boolean[fish.length];
	color1 = Random.Range(0,fishColors1.length);
	color2 = Random.Range(0,fishColors2.length);
	if(difficulty == 1)
	{
		for(var i:int = 0; i < fish.length; i++)
		{
			counted[i] = false;
			fish[i] = Instantiate(fishPrefab,startLocation,Quaternion.identity);
			fish[i].transform.parent = transform;
			fish[i].GetComponentInChildren(SpriteRenderer).sprite = fishSizeSprites[0];
			iconLeft.GetComponent(SpriteRenderer).sprite = fishSizeSprites[0];
			iconRight.GetComponent(SpriteRenderer).sprite = fishSizeSprites[0];
			iconLeft.GetComponent(SpriteRenderer).color = fishColors1[color1];
			iconRight.GetComponent(SpriteRenderer).color = fishColors2[color2];
			selection[i] = 0;
			done[i] = false;
			if(Random.Range(0,2) == 0 || (i>=2 && !leftFish[i-1] && !leftFish[i-2]))
			{
				fish[i].GetComponentInChildren(SpriteRenderer).color = fishColors1[color1];
				leftFish[i] = true;
				leftCounterNumber ++;
			}
			else
			{
				fish[i].GetComponentInChildren(SpriteRenderer).color = fishColors2[color2];
				leftFish[i] = false;
				rightCounterNumber ++;
			}
			if(i >= 2 && leftFish[i-1] && leftFish[i-2] && leftFish[i])
			{
				fish[i].GetComponentInChildren(SpriteRenderer).color = fishColors2[color2];
				leftFish[i] = false;
				leftCounterNumber --;
				rightCounterNumber ++;
			}
		}
	}
	else if(difficulty == 2)
	{
		for(i = 0; i < fish.length; i++)
		{
			counted[i] = false;
			fish[i] = Instantiate(fishPrefab,startLocation,Quaternion.identity);
			fish[i].transform.parent = transform;
			fish[i].GetComponentInChildren(SpriteRenderer).sprite = fishSizeSprites[Random.Range(0,fishSizeSprites.length)];
			iconLeft.GetComponent(SpriteRenderer).sprite = fishSizeSprites[0];
			iconRight.GetComponent(SpriteRenderer).sprite = fishSizeSprites[0];
			iconLeft.GetComponent(SpriteRenderer).color = fishColors1[color1];
			iconRight.GetComponent(SpriteRenderer).color = fishColors2[color2];
			selection[i] = 0;
			done[i] = false;
			if(Random.Range(0,2) == 0 || (i>=2 && !leftFish[i-1] && !leftFish[i-2]))
			{
				fish[i].GetComponentInChildren(SpriteRenderer).color = fishColors1[color1];
				leftFish[i] = true;
				leftCounterNumber ++;
			}
			else
			{
				fish[i].GetComponentInChildren(SpriteRenderer).color = fishColors2[color2];
				leftFish[i] = false;
				rightCounterNumber ++;
			}
			if(i >= 2 && leftFish[i-1] && leftFish[i-2] && leftFish[i])
			{
				fish[i].GetComponentInChildren(SpriteRenderer).color = fishColors2[color2];
				leftFish[i] = false;
				leftCounterNumber --;
				rightCounterNumber ++;
			}
		}
	}
	else
	{
		for(i = 0; i < fish.length; i++)
		{
			counted[i] = false;
			fish[i] = Instantiate(fishPrefab,startLocation,Quaternion.identity);
			fish[i].transform.parent = transform;
			iconLeft.GetComponent(SpriteRenderer).sprite = fishSizeSprites[0];
			iconRight.GetComponent(SpriteRenderer).sprite = fishSizeSprites[2];
			iconLeft.GetComponent(SpriteRenderer).color = fishColors1[color1];
			iconRight.GetComponent(SpriteRenderer).color = fishColors1[color1];
			selection[i] = 0;
			done[i] = false;
			if(Random.Range(0,2) == 0 || (i>=2 && !leftFish[i-1] && !leftFish[i-2]))
			{
				fish[i].GetComponentInChildren(SpriteRenderer).sprite = fishSizeSprites[0];
				fish[i].GetComponentInChildren(SpriteRenderer).color = fishColors1[color1];
				leftFish[i] = true;
				leftCounterNumber ++;
			}
			else
			{
				fish[i].GetComponentInChildren(SpriteRenderer).sprite = fishSizeSprites[2];
				fish[i].GetComponentInChildren(SpriteRenderer).color = fishColors1[color1];
				leftFish[i] = false;
				rightCounterNumber ++;
			}
			if(i >= 2 && leftFish[i-1] && leftFish[i-2] && leftFish[i])
			{
				fish[i].GetComponentInChildren(SpriteRenderer).sprite = fishSizeSprites[2];
				fish[i].GetComponentInChildren(SpriteRenderer).color = fishColors1[color1];
				leftFish[i] = false;
				rightCounterNumber ++;
				leftCounterNumber--;
			}
		}
	}
	UpdateCounters();
	length = 11 - (speed * 1);
	if(length < 7)
	{
		length = 7 - (speed *.1);
	}
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	StartCoroutine(ColorChange());
	StartCoroutine(BarrierControl());
	StartCoroutine(FlowControl());
	Play();
}

function Update () {
	if(failBackMove)
	{
		failBack.transform.position.y = Mathf.MoveTowards(failBack.transform.position.y,0,Time.deltaTime * 10);
	}
	if(importantFinger == -1)
	{
		clicked = false;
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i))
			{
				importantFinger = i;
			}
		}
	}
	if(Finger.GetExists(importantFinger))
	{
		if(Master.paused)
		{	
			clicked = true;
		}
		if(Mathf.Abs(Finger.GetPosition(importantFinger).x) < 10 && Mathf.Abs(Finger.GetPosition(importantFinger).y) < 10)
		{
			if(currentFish < fish.Length && fish[currentFish] != null && fish[currentFish].transform.position == topCenter && !clicked)
			{
				if(Finger.GetPosition(importantFinger).x < 0)
				{
					if(!leftFish[currentFish])
					{
						failBackMove = true;
					}
					clicked = true;
					barrierGoal = 6;
					fish[currentFish].transform.localScale.x = -1;
					selection[currentFish] = -1;
					fishDirection[currentFish] = false;
				}
				else
				{
					if(leftFish[currentFish])
					{
						failBackMove = true;
					}
					clicked = true;
					barrierGoal = 0;
					fishDirection[currentFish] = true;
					selection[currentFish] = 1;
				}
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	
	for(i = 0; i < fish.length; i++)
	{
		if(currentFish > i)
		{
			if(selection[i] == -1 && Mathf.Abs(fish[i].transform.position.x-topLeft.x) > .1 && !done[i])
			{
				fish[i].transform.position.x = Mathf.MoveTowards(fish[i].transform.position.x,topLeft.x,fishMovementSpeed * Time.deltaTime);
			}
			else if(selection[i] == -1 && Mathf.Abs(fish[i].transform.position.y-bottomLeft.y) > .1 && !done[i])
			{
				if(leftFish[i] && !counted[i])
				{
					counted[i] = true;
					leftCounterNumber --;
					UpdateCounters();
				}
				fish[i].transform.position.y = Mathf.MoveTowards(fish[i].transform.position.y,bottomLeft.y,fishMovementSpeed * Time.deltaTime);
			}
			else if(selection[i] == -1 && !done[i])
			{
				
				done[i] = true;
			}
			
			if(selection[i] == 1 && Mathf.Abs(fish[i].transform.position.x-topRight.x) > .1 && !done[i])
			{
				fish[i].transform.position.x = Mathf.MoveTowards(fish[i].transform.position.x,topRight.x,fishMovementSpeed * Time.deltaTime);
			}
			else if(selection[i] == 1 && Mathf.Abs(fish[i].transform.position.y-bottomRight.y) > .1 && !done[i])
			{
				if(!leftFish[i] && !counted[i])
				{
					counted[i] = true;
					rightCounterNumber --;
					UpdateCounters();
				}
				fish[i].transform.position.y = Mathf.MoveTowards(fish[i].transform.position.y,bottomRight.y,fishMovementSpeed * Time.deltaTime);
			}
			else if(selection[i] == 1 && !done[i])
			{
				done[i] = true;
			}
			
			if(done[i])
			{
				if((selection[i] == -1 && !leftFish[i]) || (selection[i] == 1 && leftFish[i]))
				{
					fish[i].GetComponent(ParticleSystemRenderer).material = bloodMaterial;
					fish[i].GetComponent(ParticleSystem).emissionRate = 10;
					fish[i].GetComponent(ParticleSystem).startSize = 1.5;
					fish[i].GetComponent(ParticleSystem).startSpeed = .4;
					leftCounter.sprite = warningSprite;
					rightCounter.sprite = warningSprite;
					EndGame(false,.8);
				}
				if(selection[i] == -1)
				{
					if(fishDirection[i])
					{
						fish[i].transform.position.x = Mathf.MoveTowards(fish[i].transform.position.x,bottomLeft.x,fishMovementSpeed * Random.Range(.8,1.2) * Time.deltaTime);
						if(Mathf.Abs(fish[i].transform.position.x - bottomLeft.x) < .1 && fishDirection[i])
						{
							fish[i].transform.localScale.x = 1;
							fishDirection[i] = false;
						}
					}
					else
					{
						fish[i].transform.position.x = Mathf.MoveTowards(fish[i].transform.position.x,bottomLeft.x + 2.5,fishMovementSpeed * Random.Range(.8,1.2) * Time.deltaTime);
						if(Mathf.Abs(fish[i].transform.position.x - (bottomLeft.x + 2.5)) < .1 && !fishDirection[i])
						{
							fish[i].transform.localScale.x = -1;
							fishDirection[i] = true;;
						}
					}
				}
				else if(selection[i] == 1)
				{
					if(fishDirection[i])
					{
						fish[i].transform.position.x = Mathf.MoveTowards(fish[i].transform.position.x,bottomRight.x - 2.5,fishMovementSpeed * Random.Range(.8,1.2) * Time.deltaTime);
						if(Mathf.Abs(fish[i].transform.position.x - (bottomRight.x - 2.5)) < .1 && fishDirection[i])
						{
							fish[i].transform.localScale.x = 1;
							fishDirection[i] = false;
						}
					}
					else
					{
						fish[i].transform.position.x = Mathf.MoveTowards(fish[i].transform.position.x,bottomRight.x,fishMovementSpeed * Random.Range(.8,1.2) * Time.deltaTime);
						if(Mathf.Abs(fish[i].transform.position.x - bottomRight.x) < .1 && !fishDirection[i])
						{
							fish[i].transform.localScale.x = -1;
							fishDirection[i] = true;;
						}
					}
				}
			}
		}
		else if(currentFish == i)
		{	
			if(selection[i] == 0)
			{
				fish[i].transform.position = Vector3.MoveTowards(fish[i].transform.position,topCenter,fishMovementSpeed * Time.deltaTime);
			}
			else
			{
				if(currentFish < fish.Length)
				{
					currentFish ++;
				}
				else
				{
					EndGame(false,.8);
				}
			}
		}
		else if(currentFish < i)
		{
			
		}
	}
	if(currentFish < fish.Length && fish[currentFish] != null && fish[currentFish].transform.position == topCenter)
	{
		if(Input.GetKeyDown("left"))
		{
			barrierGoal = 6;
			fish[currentFish].transform.localScale.x = -1;
			selection[currentFish] = -1;
			fishDirection[currentFish] = false;
		}
		else if(Input.GetKeyDown("right"))
		{
			barrierGoal = 0;
			fishDirection[currentFish] = true;
			selection[currentFish] = 1;
		}
	}
	else if(currentFish == fish.Length)
	{
		if((selection[currentFish -1] == -1 && !leftFish[currentFish -1]) || (selection[currentFish -1] == 1 && leftFish[currentFish -1]))
		{
			EndGame(false,1.2);
		}
		else
		{
			EndGame(true,1.2);
		}
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		finished = true;
		Finish(false);
	}
}

function Play () {

}

function EndGame(status:boolean,waitTime:float) {
	if(!finished)
	{
		finished = true;
		yield WaitForSeconds(waitTime);
		Finish(status);
	}
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

function BarrierControl () {
	var currentBarrier:int = 0;
	while(true)
	{
		barrier.GetComponent(SpriteRenderer).sprite = barrierSprites[currentBarrier];
		if(currentBarrier == 6)
		{
			rightFlowGoal = 0;
		}
		else
		{
			rightFlowGoal = 7;
		}
		if(currentBarrier == 0)
		{
			leftFlowGoal = 0;
		}
		else
		{
			leftFlowGoal = 7;
		}
		yield WaitForSeconds(.01);
		if(barrierGoal < currentBarrier)
		{
			currentBarrier --;
		}
		else if(barrierGoal > currentBarrier)
		{
			currentBarrier ++;
		}
		yield;
	}
	yield;
}

function FlowControl () {
	var currentLeftFlow:int = 0;
	leftFlowGoal = 0;
	var currentRightFlow:int = 7;
	rightFlowGoal = 7;
	while(true)
	{
		flowLeft.sprite = flowSprites[currentLeftFlow];
		flowRight.sprite = flowSprites[currentRightFlow];
		yield WaitForSeconds(.03);
		if(leftFlowGoal != currentLeftFlow)
		{
			currentLeftFlow ++;
		}
		if(currentLeftFlow >= flowSprites.Length)
		{
			currentLeftFlow = 0;
		}
		if(rightFlowGoal != currentRightFlow)
		{
			currentRightFlow ++;
		}
		if(currentRightFlow >= flowSprites.Length)
		{
			currentRightFlow = 0;
		}
		yield;
	}
	yield;
}

function UpdateCounters () {
	if(leftCounterNumber < 10)
	{
		leftCounter.sprite = countingSprites[leftCounterNumber];
	}
	else
	{
		leftCounter.sprite = countingSprites[10];
	}
	if(rightCounterNumber < 10)
	{
		rightCounter.sprite = countingSprites[rightCounterNumber];
	}
	else
	{
		rightCounter.sprite = countingSprites[10];
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