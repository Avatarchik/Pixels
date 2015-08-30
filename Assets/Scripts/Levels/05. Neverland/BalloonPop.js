#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var frontSprites:Sprite[];
var balloonSprites:Sprite[];
var headPrefab:GameObject;
var difficulty1Spots:Vector3[];
var difficulty2Spots:Vector3[];
var difficulty3Spots:Vector3[];
var difficulty1People:Sprite[];
var difficulty2People:Sprite[];
var difficulty3People:Sprite[];
var shotSprites:Sprite[];

@HideInInspector var faceSpots:Vector3[];
@HideInInspector var faceSprites:Sprite[];
@HideInInspector var balloons:boolean[];
@HideInInspector var balloonObjects:GameObject[];

var front:SpriteRenderer;
var shots:SpriteRenderer;

@HideInInspector var shotsLeft:int;

@HideInInspector var CEOLocations:int[];

@HideInInspector var gameFaces:GameObject[];

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	CEOLocations = new int[3];
	CEOLocations = [-1,-1,-1];
	
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
	front.sprite = frontSprites[difficulty-1];
	switch(difficulty)
	{
		case 1:
			faceSpots = difficulty1Spots;
			faceSprites = difficulty1People;
			break;
		case 2:
			faceSpots = difficulty2Spots;
			faceSprites = difficulty2People;
			break;
		case 3:
			faceSpots = difficulty3Spots;
			faceSprites = difficulty3People;
			break;
		default:
			break;
	}
	PickCeoLocations();
	balloons = new boolean[faceSpots.length];
	gameFaces = new GameObject[faceSpots.length];
	balloonObjects = new GameObject[faceSpots.length];
	for(var i:int = 0; i < balloons.length; i++)
	{
		balloons[i] = false;
	}
	switch(difficulty)
	{
		case 1:
			break;
		case 2:
			balloons[CEOLocations[0]] = true;
			AddBalloons(5);
			break;
		case 3:
			balloons[CEOLocations[0]] = true;
			balloons[CEOLocations[0]] = true;
			balloons[CEOLocations[0]] = true;
			AddBalloons(10);
			break;
		default:
			break;
	}
	for(i = 0; i < faceSpots.length; i++)
	{
		gameFaces[i] = Instantiate(headPrefab,faceSpots[i],Quaternion.identity);
		if(i == CEOLocations[0] || i == CEOLocations[1] || i == CEOLocations[2])
		{
			gameFaces[i].GetComponent(SpriteRenderer).sprite = faceSprites[0];
		}
		else
		{
			gameFaces[i].GetComponent(SpriteRenderer).sprite = faceSprites[Random.Range(1,faceSprites.length)];
		}
		if(balloons[i])
		{
			balloonObjects[i] = Instantiate(headPrefab,faceSpots[i] - Vector3(0,0,.1),Quaternion.identity);
			balloonObjects[i].GetComponent(SpriteRenderer).sprite = balloonSprites[difficulty-1];
			balloonObjects[i]. transform.parent = transform;
		}
		gameFaces[i].transform.parent = transform;
	}
	
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

function PickCeoLocations () {
	var retries:int = 0;
	var spot1:int = -1;
	var spot2:int = -2;
	var spot3:int = -3;
	while((CEOLocations[0] == CEOLocations[1] || CEOLocations[0] == CEOLocations[2] || CEOLocations[1] == CEOLocations[2]) && retries < 100)
	{
		spot1 = Random.Range(0,faceSpots.Length);
		spot2 = Random.Range(0,faceSpots.Length);
		spot3 = Random.Range(0,faceSpots.Length);
		retries ++;
	}
	CEOLocations[0] = spot1;
	CEOLocations[1] = spot2;
	CEOLocations[2] = spot3;
}

function AddBalloons (howMany:int) {
	var numberAdded:int = 0;
	while(numberAdded < howMany)
	{
		balloons[Random.Range(0,balloons.length)] = true;
		numberAdded++;
	}
}

function Play () {

}

function Finish(completionStatus:boolean) {
	Finish(completionStatus,0);
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