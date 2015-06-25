#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var headers:SpriteRenderer[];
var lenses:SpriteRenderer[];

@HideInInspector var allowableHeader:SpriteRenderer[];
@HideInInspector var allowableLenses:SpriteRenderer[];

@HideInInspector var gameProgress:int;
@HideInInspector var lensesPlugged:boolean[];
@HideInInspector var numberOfLenses:int;
@HideInInspector var lensChoices:int[];
@HideInInspector var optionChoices:int[];

@HideInInspector var lensLocations:Vector3[];
@HideInInspector var lensLocationsAvailable:boolean[];

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	gameProgress = 0;
	lensChoices = new int[2];
	
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
	length = 3 + 5/speed;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	if(difficulty == 3)
	{
		lensLocations = new Vector3[4];
		lensLocations[0] = Vector3(-8.28,.689,transform.position.z);
		lensLocations[1] = Vector3(-5,-3.23,transform.position.z);
		lensLocations[2] = Vector3(.5,-3.23,transform.position.z);
		lensLocations[3] = Vector3(3.78,.689,transform.position.z);
	}
	else
	{
		lensLocations = new Vector3[3];
		lensLocations[0] = Vector3(-7.6,-1.2,transform.position.z);
		lensLocations[1] = Vector3(-2.25,-3.23,transform.position.z);
		lensLocations[2] = Vector3(3.1,-1.2,transform.position.z);
	}
	lensLocationsAvailable = new boolean[lensLocations.length];
	optionChoices = new int[lensLocations.length];
	allowableHeader = new SpriteRenderer[3 + difficulty];
	allowableLenses = new SpriteRenderer[3 + difficulty];
	for(var i:int = 0; i < 3 + difficulty;i++)
	{
		allowableHeader[i] = headers[i];
		allowableLenses[i] = lenses[i];
	}
	
	PickNewColors();
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
}

function PickNewColors () {
	for(var i:int = 0; i < lenses.length; i++)
	{
		lenses[i].color.a = 0;
		lenses[i].transform.position.x = 1000;
	}
	for(i = 0; i < headers.length; i++)
	{
		headers[i].color.a = 0;
	}
	lensChoices[0] = Random.Range(0,allowableLenses.Length);
	lensChoices[1] = Random.Range(0,allowableLenses.Length);
	var hangPrevent:int = 0;
	while(lensChoices[1] == lensChoices[0] && hangPrevent < 40)
	{
		lensChoices[1] = Random.Range(0,allowableLenses.Length);
		hangPrevent ++;
	}
	
	for(i = 0; i < lensLocations.length; i++)
	{
		lensLocationsAvailable[i] = true;
	}
	var location1:int = Random.Range(0,lensLocations.length);
	var location2:int = Random.Range(0,lensLocations.length);
	hangPrevent = 0;
	while(location2 == location1 && hangPrevent < 40)
	{
		location2 = Random.Range(0,lensLocations.Length);
		hangPrevent ++;
	}
	optionChoices[location1] = lensChoices[0];
	lensLocationsAvailable[location1] = false;
	optionChoices[location2] = lensChoices[1];
	lensLocationsAvailable[location2] = false;
	
	for(i = 0; i < optionChoices.length; i++)
	{
		if(lensLocationsAvailable[i])
		{
			for(var y:int = 0; y < allowableLenses.length; y++)
			{
				if(y != optionChoices[location1] && y != optionChoices[location2]) 
				{
					optionChoices[i] = y;
					lensLocationsAvailable[i] = false;
				}
			}
		}
	}
	
	
	// This stuff is fucked.
	for(i = 0; i < allowableLenses.length;i++)
	{
		for(y = 0; y < lensLocations.length; y++)
		{
			if(optionChoices[y] == i)
			{
				allowableLenses[i].color.a = 1;
				allowableLenses[i].transform.position = lensLocations[y];
			}
		}
	}
	for(i = 0; i < allowableHeader.length;i++)
	{
		if(i == lensChoices[0] || i == lensChoices[1])
		{
			allowableHeader[i].color.a = 1;
		}
		else
		{
			allowableHeader[i].color.a = 0;
		}
	}
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
			if(Finger.GetExists(i))
			{
				importantFinger = i;
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

}

function Finish(completionStatus:boolean,waitTime:float) {
	if(!finished)
	{
		finished = true;
		yield WaitForSeconds(waitTime);
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