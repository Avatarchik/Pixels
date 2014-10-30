#pragma strict

var fallingObject:GameObject;
var crate:GameObject;
var objectsOnScreen:GameObject[];
var objectsOnScreenTarget:boolean[];

var speed:int;
var difficulty:int;
var finished:boolean;
var length:float;
var timer:float;
var newPosition:float;

var button:ButtonSquare;

function Awake () {
	GyroDetection.delay = .3;
	GyroDetection.automatic = true;
}

function Start () {
	if(Application.loadedLevelName == "MicroTester")
	{
		speed = MicroTester.timeMultiplier;
		difficulty = MicroTester.difficulty;
	}
	else
	{
		speed = GameManager.timeMultiplier;
		difficulty = GameManager.difficulty;
	}
	finished = false;
	length = 3 + 5/speed;
	timer = length;
	newPosition = 0;
	button = GetComponent(ButtonSquare);
	StartCoroutine(Deployment());
}

function Update () {
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true);
	}
	for(var i:int = 0; i < objectsOnScreen.length; i++)
	{
		if(objectsOnScreen[i] != null)
		{
			objectsOnScreen[i].transform.parent = transform;
			if(objectsOnScreen[i].transform.position.y <= -10 && !finished)
			{
				Finish(false);
			}
			else if(objectsOnScreen[i].transform.position.y < -2.5 && objectsOnScreen[i].transform.position.y > -4 && !objectsOnScreenTarget[i])
			{
				if(Mathf.Abs(objectsOnScreen[i].transform.position.x-crate.transform.position.x) < 4)
				{
					objectsOnScreenTarget[i] = true;
					objectsOnScreen[i].particleSystem.Emit(15);
				}
			}
			if(!objectsOnScreenTarget[i])
			{
				objectsOnScreen[i].transform.position.y -= Time.deltaTime * (5 + speed * 5);
			}
			else
			{
				objectsOnScreen[i].transform.position = Vector3.MoveTowards(objectsOnScreen[i].transform.position, Vector3(crate.transform.position.x,crate.transform.position.y, objectsOnScreen[i].transform.position.z), Time.deltaTime * (10));
				objectsOnScreen[i].transform.parent = crate.transform;
			}
		}
	}
	//newPosition = GyroDetection.rotation.x;
	if(button.importantFinger!=-1)
	{
		if(Vector2.Distance(button.location,crate.transform.position) < 5)
		{
			newPosition = button.location.x;
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
	while(timer > 1)
	{
		yield WaitForSeconds(length/(5*difficulty));
		objectsOnScreen = AddObject(objectsOnScreen, Instantiate(fallingObject, Vector3(Random.Range(-8.5, 8.5),10,4.8), Quaternion.identity));
		objectsOnScreenTarget = AddBoolean(objectsOnScreenTarget, false);
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

function Finish(completionStatus) {
	if(Application.loadedLevelName == "MicroTester")
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(completionStatus);
	}
	else 
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).GameComplete(completionStatus);
	}
	finished = true;
}