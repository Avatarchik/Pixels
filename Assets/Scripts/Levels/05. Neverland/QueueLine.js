#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var playerPrefab:GameObject;
@HideInInspector var player:GameObject;

var people:GameObject[];

@HideInInspector var touchedSomeone:boolean;

@HideInInspector var peopleTouched:boolean[];

@HideInInspector var movementSpeed:float;
@HideInInspector var newSpeed:float;
@HideInInspector var distanceTouch:float;
@HideInInspector var playerDistance:float;

var firstTimeNotifier:GameObject;

function Awake () {
	player = Instantiate(playerPrefab);
	player.transform.position = Vector3(-5.1,-2.42,transform.position.z);
	player.transform.localScale = Vector3(1,1,1);
	player.transform.parent = transform;
	player.GetComponent(PlayerManager).currentState = PlayerState.StandingFront;
	player.GetComponent(PlayerManager).speedOverride = true;
	player.GetComponent(PlayerManager).thisSpeed = .2;
	firstTimeNotifier.transform.parent = player.transform;
	firstTimeNotifier.transform.localPosition.x = 0;
}

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	distanceTouch = .5;
	playerDistance = 4;
	peopleTouched = new boolean[people.length];
	for(var i:int = 0; i < people.length; i++)
	{
		peopleTouched[i] = false;
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
	length = 5;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	movementSpeed = 2 + 1 * speed;
	
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
	if((timer < 0 || player.transform.position.x > 6.2) && !finished)
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
	if(Finger.GetExists(importantFinger) && !Master.paused && !touchedSomeone)
	{
		if(Mathf.Abs(Finger.GetPosition(importantFinger).x-player.transform.position.x) < playerDistance)
		{
			player.transform.position.x = Mathf.MoveTowards(player.transform.position.x, Finger.GetPosition(importantFinger).x, Time.deltaTime * 15);
			if(Finger.GetPosition(importantFinger).x > player.transform.position.x && Mathf.Abs(Finger.GetPosition(importantFinger).x - player.transform.position.x) > 0)
			{
				player.GetComponent(PlayerManager).currentState = PlayerState.WalkingFront;
			}
			else if(Finger.GetPosition(importantFinger).x < player.transform.position.x && Mathf.Abs(Finger.GetPosition(importantFinger).x - player.transform.position.x) > 0)
			{
				player.GetComponent(PlayerManager).currentState = PlayerState.WalkingFront;
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	for(i = 0; i < people.length; i ++)
	{
		if(Mathf.Abs(player.transform.position.x - people[i].transform.position.x) < distanceTouch)
		{
			peopleTouched[i] = true;
			touchedSomeone = true;
			Finish(false,1);
			KnockOver(i);
		}
		if(peopleTouched[i])
		{
			if(i < 4)
			{
				people[i].transform.position.x -= Time.deltaTime * 3;
				people[i].transform.position.y = Mathf.MoveTowards(people[i].transform.position.y, -3.5, Time.deltaTime * 3);
				people[i].transform.rotation.eulerAngles.z = Mathf.MoveTowards(people[i].transform.rotation.eulerAngles.z,90,Time.deltaTime * 180);
			}
			else
			{
				people[i].transform.position.x += Time.deltaTime * 3;
				people[i].transform.position.y = Mathf.MoveTowards(people[i].transform.position.y, -3.5, Time.deltaTime * 3);
				people[i].transform.rotation.eulerAngles.z = Mathf.MoveTowards(people[i].transform.rotation.eulerAngles.z,-90,Time.deltaTime * 180);
			}
		}
	}
}

function Play () {
	yield WaitForSeconds(.7);
	if(difficulty == 3)
	{	
		var counter:float = Random.Range(0,1.5);
		while(true && !touchedSomeone)
		{
			if(counter > 0)
			{
				for(var i:int = 0; i < people.length; i++)
				{
					people[i].transform.position.x += Time.deltaTime * movementSpeed;
				}
			}
			else if (counter < -.5)
			{
				counter = Random.Range(.5,2.5);
			}
			counter -= Time.deltaTime;
			yield;
		}
	}
	else
	{
		while(true && !touchedSomeone)
		{
			for(i = 0; i < people.length; i++)
			{
				people[i].transform.position.x += Time.deltaTime * movementSpeed;
			}
			yield;
		}
	}
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

function KnockOver(person:int) {
	var counter:int = person;
	if(person < 4)
	{
		while(counter >= 0)
		{
			peopleTouched[counter] = true;
			yield WaitForSeconds(.2);
			counter --;
			yield;
		}
	}
	else
	{
		while(counter < people.Length)
		{
			peopleTouched[counter] = true;
			yield WaitForSeconds(.2);
			counter ++;
			yield;
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