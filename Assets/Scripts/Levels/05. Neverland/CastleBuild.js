#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var shuttle:GameObject;
@HideInInspector var shuttleLeftLimit:float;
@HideInInspector var shuttleRightLimit:float;
@HideInInspector var shuttleSpeed:float;

var castlePieces:Sprite[];
var castleLocations:SpriteRenderer[];

var castlePrefab:GameObject;

var firstTime:GameObject;

@HideInInspector var currentPiece:int;

@HideInInspector var finishedPieces:GameObject[];
@HideInInspector var success:int[];
@HideInInspector var distanceAllowed:float;

@HideInInspector var drop:boolean;

@HideInInspector var clicked:boolean;

var firework:ParticleSystem;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	shuttleLeftLimit = -7.5;
	shuttleRightLimit = 7.5;
	currentPiece = 0;
	distanceAllowed = 1;
	drop = false;
	clicked = false;
	finishedPieces = new GameObject[castlePieces.length];
	success = new int[castlePieces.length];
	for(var i:int = 0; i < success.length; i++)
	{
		success[i] = 0;
	}
	
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
	length = 15 - difficulty * 2;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	shuttleSpeed = 8 + 4.5*speed;
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
	Shuttle();
}

function Update () {
	if(firstTime != null)
	{
		if(currentPiece < castleLocations.Length && gameObject.GetComponent(MicroGameManager).firstTime)
		{
			firstTime.transform.position.x = castleLocations[currentPiece].transform.position.x;
		}
		else
		{
			firstTime.transform.position.x = 100;
		}
	}
	if(Input.GetKeyDown("space"))
	{
		drop = true;
		if(currentPiece < castleLocations.Length)
		{
			if(finishedPieces[currentPiece]!= null)
			{
				finishedPieces[currentPiece].transform.parent = transform;
			}
		}
	}
	for(var piece:int = 0; piece < castleLocations.length; piece++)
	{
		if(piece == currentPiece)
		{
			castleLocations[piece].color.a = Mathf.Abs(Mathf.Sin(Time.time * 2) * .3) + .1;
		}
		else
		{
			castleLocations[piece].color.a = 0;
		}
		if(finishedPieces[piece] != null)
		{
			if(success[piece] == 1)
			{
				finishedPieces[piece].transform.position = Vector3.MoveTowards(finishedPieces[piece].transform.position,castleLocations[piece].transform.position + Vector3(0,0,-.1),Time.deltaTime * 20);
			}
			else if(success[piece] == 2)
			{
				finishedPieces[piece].transform.position.y -= Time.deltaTime * 20;
				finishedPieces[piece].transform.rotation.eulerAngles.z += Time.deltaTime * 20;
				Finish(false,.4);
			}
		}
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false,0);
	}
	// Get important finger.
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i) && Finger.GetInGame(i))
			{
				if(currentPiece < castleLocations.Length)
				{
					drop = true;
					if(finishedPieces[currentPiece]!= null)
					{
						finishedPieces[currentPiece].transform.parent = transform;
					}
					importantFinger = i;
					break;
				}
			}
		}
	}
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	if(Finger.GetExists(importantFinger) && !Master.paused && !clicked)
	{
		drop = true;
		clicked = true;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
		clicked = false;
	}
}

function Play () {
	while(currentPiece < castlePieces.Length)
	{
		drop = false;
		finishedPieces[currentPiece] = Instantiate(castlePrefab,shuttle.transform.position + Vector3(0,0,.01 * currentPiece),Quaternion.identity);
		finishedPieces[currentPiece].transform.parent = shuttle.transform;
		finishedPieces[currentPiece].GetComponent(SpriteRenderer).sprite = castlePieces[currentPiece];
		while(!drop)
		{
			yield;
		}
		if(Mathf.Abs(finishedPieces[currentPiece].transform.position.x - castleLocations[currentPiece].transform.position.x) < 2)
		{
			success[currentPiece] = 1;
		}	
		else
		{
			success[currentPiece] = 2;
		}
		currentPiece ++;
		if(currentPiece == finishedPieces.Length)
		{
			Finish(true,1);
		}
		yield;
	}
}

function Shuttle () {
	while(true)
	{
		while(Mathf.Abs(shuttle.transform.position.x - shuttleLeftLimit) > .1)
		{
			while(drop)
			{
				yield;
			}
			shuttle.transform.position.x = Mathf.MoveTowards(shuttle.transform.position.x,shuttleLeftLimit,Time.deltaTime * shuttleSpeed);
			yield;
		}
		while(Mathf.Abs(shuttle.transform.position.x - shuttleRightLimit) > .1)
		{
			while(drop)
			{
				yield;
			}
			shuttle.transform.position.x = Mathf.MoveTowards(shuttle.transform.position.x,shuttleRightLimit,Time.deltaTime * shuttleSpeed);
			yield;
		}
		yield;
	}
}

function Finish(completionStatus:boolean) {
	Finish(completionStatus,0);
}

function Finish(completionStatus:boolean,waitTime:float) {
	UITimer.soundsOn = !completionStatus;
	if(!finished)
	{
		finished = true;
		if(completionStatus)
		{
			firework.Emit(4);
		}
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