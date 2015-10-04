#pragma strict

var fallingObject:GameObject;
var crate:GameObject;
var objectsOnScreen:GameObject[];
var objectsOnScreenTarget:boolean[];

@HideInInspector var speed:float;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var newPosition:float;

@HideInInspector var importantFinger:int;

var tutorialNotification:GameObject;

@HideInInspector var score:float;
@HideInInspector var waitTime:float;

function Start () {
	waitTime = 2.5;
	speed = 1;
	difficulty = 1;
	finished = false;
	newPosition = 0;
	
	score = 0;
	
	StartCoroutine(Deployment());
}

function Update () {
	if(finished)
	{
	
	}
	else
	{
		
		score += Time.deltaTime;
		ArcadeTimer.currentTime = score;
		if(waitTime > .3)
		{
			speed += Time.deltaTime * .04;
		}
		else
		{
			speed += Time.deltaTime * .075;
		}
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
	if(Finger.GetExists(importantFinger) && Finger.GetInGame(importantFinger) && !Master.paused)
	{
		if(Vector2.Distance(Finger.GetPosition(importantFinger),crate.transform.position) < 5)
		{
			newPosition = Finger.GetPosition(importantFinger).x;
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	for(i = 0; i < objectsOnScreen.length; i++)
	{
		if(objectsOnScreen[i] != null && !finished)
		{
			objectsOnScreen[i].transform.parent = transform;
			if(objectsOnScreen[i].transform.position.y <= -10 && !finished)
			{
				Finish();
			}
			else if(objectsOnScreen[i].transform.position.y < -2.5 && objectsOnScreen[i].transform.position.y > -4 && !objectsOnScreenTarget[i])
			{
				if(Mathf.Abs(objectsOnScreen[i].transform.position.x-crate.transform.position.x) < 4)
				{
					objectsOnScreenTarget[i] = true;
					objectsOnScreen[i].GetComponent.<ParticleSystem>().Emit(15);
				}
			}
			if(!objectsOnScreenTarget[i])
			{
				objectsOnScreen[i].transform.position.y -= Time.deltaTime * (5 + speed * 5);
			}
			else
			{
				if(i < objectsOnScreen.Length - 10)
				{
					if(objectsOnScreen[i] != null)
					{
						Destroy(objectsOnScreen[i]);
					}
				}
				objectsOnScreen[i].transform.position = Vector3.MoveTowards(objectsOnScreen[i].transform.position, Vector3(crate.transform.position.x,crate.transform.position.y, objectsOnScreen[i].transform.position.z), Time.deltaTime * (10));
				objectsOnScreen[i].transform.parent = crate.transform;
			}
		}
	}
	

	if(newPosition > 7)
	{
		newPosition = 7;
	}
	if(newPosition < -7)
	{
		newPosition = -7;
	}
	crate.transform.position.x = newPosition / 1;
}

// Create object.
function Deployment () {
	while(true)
	{
		if(!finished)
		{
			objectsOnScreen = AddObject(objectsOnScreen, Instantiate(fallingObject, Vector3(Random.Range(-8.5, 8.5),10,4.8), Quaternion.identity));
		}
		objectsOnScreenTarget = AddBoolean(objectsOnScreenTarget, false);
		waitTime *= .94;
		if(waitTime < .3)
		{
			waitTime = .3;
		}
		yield WaitForSeconds(waitTime);
		yield;
	}
	yield;
}

// Add an object to an array.
function AddObject (original:GameObject[],addition:GameObject):GameObject[] {
	var finalArray:GameObject[] = new GameObject[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

// Add a boolean to an array.
function AddBoolean (original:boolean[],addition:boolean):boolean[] {
	var finalArray:boolean[] = new boolean[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function Finish() {
	finished = true;
	for(var i:int = 0; i < objectsOnScreen.length; i++)
	{
		Destroy(objectsOnScreen[i]);
	}	
	GameObject.FindGameObjectWithTag("ArcadeManager").GetComponent(ArcadeManager).FinishGame(score);
}