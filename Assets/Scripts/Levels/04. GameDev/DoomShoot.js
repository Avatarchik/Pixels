#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var leftLaneLocation:float;
@HideInInspector var centerLaneLocation:float;
@HideInInspector var rightLaneLocation:float;

@HideInInspector var leftLaneHeights:float[];
@HideInInspector var centerLaneHeights:float[];
@HideInInspector var rightLaneHeights:float[];

var normalEnemy:GameObject;
var hardEnemy:GameObject;

var normalEnemySprites:Sprite[];
var hardEnemySprites:Sprite[];

@HideInInspector var leftEnemy:GameObject;
@HideInInspector var centerEnemy:GameObject;
@HideInInspector var rightEnemy:GameObject;

@HideInInspector var leftEnemyPosition:int;
@HideInInspector var centerEnemyPosition:int;
@HideInInspector var rightEnemyPosition:int;

@HideInInspector var pauseTime:float;
@HideInInspector var movementWaitTime:float;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	leftLaneLocation = -6;
	centerLaneLocation = 0;
	rightLaneLocation = 6;
	leftLaneHeights = new float[5];
	centerLaneHeights = new float[5];
	rightLaneHeights = new float[5];
	
	leftLaneHeights = [-.5,-.85,-1.25,-1.65,-2];
	centerLaneHeights = [2,1.0,0,-1,-2];
	rightLaneHeights = leftLaneHeights;
	
	leftEnemyPosition = 0;
	centerEnemyPosition = 0;
	rightEnemyPosition = 0;
	
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
	length = 2 + .1/speed;
	length = 10;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	
	pauseTime = .3;
	movementWaitTime = .3;
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
}

function Update () {
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true,0);
	}
	// Get important finger.
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
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
}

function Play () {
	var lane0NotDone:boolean = true;
	var lane1NotDone:boolean = true;
	var lane2NotDone:boolean = true;
	while(lane0NotDone || lane1NotDone || lane2NotDone)
	{
		switch(Random.Range(0,3))
		{
			case 0:
				if(lane0NotDone)
				{
					lane0NotDone = false;
					Lane(0);
				}
				break;
			case 1:
				if(lane1NotDone)
				{
					lane1NotDone = false;
					Lane(1);
				}
				break;
			case 2:
				if(lane2NotDone)
				{
					lane2NotDone = false;
					Lane(2);
				}
				break;
			default:
				break;
		}
		yield WaitForSeconds(Random.Range(pauseTime*.6,pauseTime*1.4));
	}
}

function Lane (lane:int) {
	var counter:float;
	var sprites:Sprite[];
	var toCreate:GameObject;
	while(true)
	{
		switch(lane)
		{
			case 0:
				if(leftEnemy == null)
				{
					yield WaitForSeconds(Random.Range(pauseTime * .6, pauseTime * 1.4));
					if(difficulty == 3 && Random.Range(0,2) == 1)
					{
						toCreate = hardEnemy;
						sprites = hardEnemySprites;
					}
					else
					{
						toCreate = normalEnemy;
						sprites = normalEnemySprites;
					}
					leftEnemyPosition = 0;
					leftEnemy = Instantiate(toCreate,Vector3(leftLaneLocation,leftLaneHeights[0],transform.position.z + 1),Quaternion.identity);
					leftEnemy.transform.parent = transform;
					counter = 0;
				}
				else
				{
					counter += Time.deltaTime;
					if(counter > movementWaitTime)
					{
						if(leftEnemyPosition < 4)
						{
							leftEnemyPosition ++;
							leftEnemy.transform.position.y = leftLaneHeights[leftEnemyPosition];
							leftEnemy.GetComponent(SpriteRenderer).sprite = sprites[leftEnemyPosition];
							counter = 0;
						}
						else
						{
							Destroy(leftEnemy);
							HurtPlayer();
						}
					}
				}
				break;
			case 1:
				if(centerEnemy == null)
				{
					yield WaitForSeconds(Random.Range(pauseTime * .6, pauseTime * 1.4));
					if(difficulty == 3 && Random.Range(0,2) == 1)
					{
						toCreate = hardEnemy;
						sprites = hardEnemySprites;
					}
					else
					{
						toCreate = normalEnemy;
						sprites = normalEnemySprites;
					}
					centerEnemyPosition = 0;
					centerEnemy = Instantiate(toCreate,Vector3(centerLaneLocation,centerLaneHeights[0],transform.position.z+1),Quaternion.identity);
					centerEnemy.transform.parent = transform;
					counter = 0;
				}
				else
				{
					counter += Time.deltaTime;
					if(counter > movementWaitTime)
					{
						if(centerEnemyPosition < 4)
						{
							centerEnemyPosition ++;
							centerEnemy.transform.position.y = centerLaneHeights[centerEnemyPosition];
							centerEnemy.GetComponent(SpriteRenderer).sprite = sprites[centerEnemyPosition];
							counter = 0;
						}
						else
						{
							Destroy(centerEnemy);
							HurtPlayer();
						}
					}
				}
				break;
			case 2:
				if(rightEnemy == null)
				{
					yield WaitForSeconds(Random.Range(pauseTime * .6, pauseTime * 1.4));
					if(difficulty == 3 && Random.Range(0,2) == 1)
					{
						toCreate = hardEnemy;
						sprites = hardEnemySprites;
					}
					else
					{
						toCreate = normalEnemy;
						sprites = normalEnemySprites;
					}
					rightEnemyPosition = 0;
					rightEnemy = Instantiate(toCreate,Vector3(rightLaneLocation,rightLaneHeights[0],transform.position.z+1),Quaternion.identity);
					rightEnemy.transform.parent = transform;
					counter = 0;
				}
				else
				{
					counter += Time.deltaTime;
					if(counter > movementWaitTime)
					{
						if(rightEnemyPosition < 4)
						{
							rightEnemyPosition ++;
							rightEnemy.transform.position.y = rightLaneHeights[rightEnemyPosition];
							rightEnemy.GetComponent(SpriteRenderer).sprite = sprites[rightEnemyPosition];
							counter = 0;
						}
						else
						{
							Destroy(rightEnemy);
							HurtPlayer();
						}
					}
				}
				break;
			default:
				break;
		}
		yield;
	}
}

function HurtPlayer () {
	Debug.Log("hey: " + Time.time);
}

function Finish(completionStatus:boolean,waitTime:float) {
	if(!finished)
	{
		finished = true;
		GameObject.FindGameObjectWithTag("GameController").BroadcastMessage("GameComplete",completionStatus,SendMessageOptions.DontRequireReceiver);
		if(colorChange)
		{
			GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", Color(0,0,0,0),SendMessageOptions.DontRequireReceiver);
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