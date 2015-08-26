#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var player:GameObject;

var people:GameObject[];

@HideInInspector var movementSpeed:float;
@HideInInspector var newSpeed:float;
@HideInInspector var distanceTouch:float;
@HideInInspector var playerDistance:float;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	distanceTouch = 2;
	playerDistance = 4;
	
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
	length = 5;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	movementSpeed = 3;
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	SpeedStuff();
	Play();
}

function SpeedStuff() {
	var initial:float = movementSpeed;
	while(true)
	{
		yield WaitForSeconds(.5);
		newSpeed = Random.Range(initial * .5, initial * 1.5);
		yield;
	}
}

function Update () {
	movementSpeed = Mathf.MoveTowards(movementSpeed,newSpeed,Time.deltaTime * 2);
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
	player.GetComponent(PlayerManager).currentState = PlayerState.StandingFront;
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		if(Mathf.Abs(Finger.GetPosition(importantFinger).x-player.transform.position.x) < playerDistance)
		{
			player.transform.position.x = Mathf.MoveTowards(player.transform.position.x, Finger.GetPosition(importantFinger).x, Time.deltaTime * 5);
			if(Finger.GetPosition(importantFinger).x > player.transform.position.x && Mathf.Abs(Finger.GetPosition(importantFinger).x - player.transform.position.x) > 0)
			{
				player.GetComponent(PlayerManager).currentState = PlayerState.WalkingRight;
			}
			else if(Finger.GetPosition(importantFinger).x < player.transform.position.x && Mathf.Abs(Finger.GetPosition(importantFinger).x - player.transform.position.x) > 0)
			{
				player.GetComponent(PlayerManager).currentState = PlayerState.WalkingLeft;
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
}

function Play () {
	yield WaitForSeconds(.5);
	if(difficulty == 3)
	{	
		var counter:float = Random.Range(0,1.5);
		while(true)
		{
			if(counter > 0)
			{
				for(var i:int = 0; i < people.length; i++)
				{
					people[i].transform.position.x += Time.deltaTime * movementSpeed;
				}
				counter -= Time.deltaTime;
			}
			else if (counter < -1)
			{
				counter = Random.Range(.5,2.5);
			}
			yield;
		}
	}
	else
	{
		while(true)
		{
			for(i = 0; i < people.length; i++)
			{
				people[i].transform.position.x += Time.deltaTime * movementSpeed;
			}
			yield;
		}
	}
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