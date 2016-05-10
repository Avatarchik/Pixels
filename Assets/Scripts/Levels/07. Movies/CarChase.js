#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var clicked:boolean;

var enemyCarPrefab:GameObject;
var enemyTruckPrefab:GameObject;
var explosionPrefab:GameObject;

var roads:GameObject[];
@HideInInspector var enemyCars:GameObject[];
@HideInInspector var enemyTrucks:GameObject[];
var player:GameObject;
@HideInInspector var currentPlayerLane:int;

@HideInInspector var carHitDistance:float;
@HideInInspector var truckHitDistance:float;

@HideInInspector var lane0Location:float;
@HideInInspector var lane1Location:float;
@HideInInspector var lane2Location:float;

@HideInInspector var carSpeed:float;
@HideInInspector var numberOfVehicles:int;

@HideInInspector var distanceBetweenCars:float;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = false;
	
	// Level specific variable initialization.
	lane0Location = -4.5;
	lane1Location = 0;
	lane2Location = 4.5;
	distanceBetweenCars = 20;
	currentPlayerLane = 1;
	carHitDistance = 4;
	truckHitDistance = 5;
	
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
	numberOfVehicles = 15 + difficulty * 3;
	carSpeed = 20 + speed * 5;
	
	var trucksLeft:int = 0;
	enemyCars = new GameObject[numberOfVehicles];
	enemyTrucks = new GameObject[0];
	if(difficulty == 3)
	{	
		enemyCars = new GameObject[numberOfVehicles-5];
		enemyTrucks = new GameObject[5];
		trucksLeft = 5;
	}
	var trucks:int = 0;
	var cars:int = 0;
	for(var i:int = 0; i < numberOfVehicles; i++)
	{
		var randomness:int = Random.Range(0,3);
		var randomNumber:float = Random.value;
		if(cars >= enemyCars.length)
		{
			randomNumber = .01;
		}
		if((randomNumber < .3 && trucksLeft > 0))
		{
			trucksLeft --;
			enemyTrucks[trucks] = Instantiate(enemyTruckPrefab,Vector3(0,15+(distanceBetweenCars*i)),Quaternion.identity);
			enemyTrucks[trucks].transform.parent = transform;
			enemyTrucks[trucks].transform.localScale = Vector3(1,1,1);
			if(randomness == 0)
			{
				enemyTrucks[trucks].transform.position.x = -4.5;
			}
			if(randomness == 1)
			{
				if(Random.value < .5)
				{	
					enemyTrucks[trucks].transform.position.x = -4.5;
				}
				else
				{
					enemyTrucks[trucks].transform.position.x = 4.5;
				}
			}
			if(randomness == 2)
			{
				enemyTrucks[trucks].transform.position.x = 4.5;
			}
			trucks++;
		}
		else
		{
			enemyCars[cars] = Instantiate(enemyCarPrefab,Vector3(0,carSpeed+(distanceBetweenCars*i)),Quaternion.identity);
			enemyCars[cars].transform.parent = transform;
			enemyCars[cars].transform.localScale = Vector3(1,1,1);
			if(randomness == 0)
			{
				enemyCars[cars].transform.position.x = -4.5;
			}
			if(randomness == 2)
			{
				enemyCars[cars].transform.position.x = 4.5;
			}
			cars++;
		}
	}
	
	length = (enemyCars[enemyCars.length-1].transform.position.y + 10)/(carSpeed* .6);
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
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
		if(!clicked)
		{
			if(Finger.GetPosition(importantFinger).x < -2.3)
			{
				currentPlayerLane = 0;
			}
			else if(Finger.GetPosition(importantFinger).x > 2.3)
			{
				currentPlayerLane = 2;
			}
			else
			{
				currentPlayerLane = 1;
			}
			//clicked = true;
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		clicked = false;
		importantFinger = -1;
	}
	var moveSpeed:float = 10;
	var goal:float = player.transform.position.x;
	if(currentPlayerLane == 0)
	{
		goal = lane0Location;
	}
	else if(currentPlayerLane == 1)
	{
		goal = lane1Location;
	}
	else if(currentPlayerLane == 2)
	{
		goal = lane2Location;
	}
	if(goal < player.transform.position.x - .3)
	{
		player.transform.rotation = Quaternion.Lerp(player.transform.rotation,Quaternion.Euler(0,0,20),Time.deltaTime * 11);
	}
	else if(goal > player.transform.position.x + .3)
	{
		player.transform.rotation = Quaternion.Lerp(player.transform.rotation,Quaternion.Euler(0,0,-20),Time.deltaTime * 11);
	}
	else
	{
		player.transform.rotation = Quaternion.Lerp(player.transform.rotation,Quaternion.Euler(0,0,0),Time.deltaTime * 11);
	}
	player.transform.position.x = Mathf.MoveTowards(player.transform.position.x,goal,Time.deltaTime * 30);
	if(Input.GetKeyDown("1"))
	{
		currentPlayerLane = 0;
	}
	if(Input.GetKeyDown("2"))
	{
		currentPlayerLane = 1;
	}
	if(Input.GetKeyDown("3"))
	{
		currentPlayerLane = 2;
	}
	for(i = 0; i < roads.length; i++)
	{
		roads[i].transform.position.y -= Time.deltaTime * carSpeed;
		if(roads[i].transform.position.y < -35.7)
		{
			roads[i].transform.position.y += 71.4248;
		}
	}
	for(i = 0; i < enemyTrucks.length; i++)
	{
		if(enemyTrucks[i].transform.position.y > 11.5)
		{
			enemyTrucks[i].transform.position.y -= Time.deltaTime * carSpeed * .6;
		}
		else
		{
			enemyTrucks[i].transform.position.y -= Time.deltaTime * carSpeed * .45;
		}
		if(Mathf.Abs(enemyTrucks[i].transform.position.x-player.transform.position.x) < truckHitDistance * .45 && Mathf.Abs(enemyTrucks[i].transform.position.y-player.transform.position.y) < truckHitDistance)
		{
			Die();
		}
	}
	for(i = 0; i < enemyCars.length; i++)
	{
		enemyCars[i].transform.position.y -= Time.deltaTime * carSpeed * .6;
		if(Mathf.Abs(enemyCars[i].transform.position.x-player.transform.position.x) < carHitDistance * .65 && Mathf.Abs(enemyCars[i].transform.position.y-player.transform.position.y) < carHitDistance)
		{
			Die();
		}
	}
}

function Play () {

}

function Die () {
	if(!finished)
	{
		Finish(false,1);
		var newExplosion:GameObject;
		newExplosion = Instantiate(explosionPrefab,player.transform.position - Vector3(0,0,.1),Quaternion.identity);
		newExplosion.transform.parent = transform;
		newExplosion.transform.localScale = Vector3(1.5,1.5,1.5);
		newExplosion.transform.localPosition.z = -.38;
		newExplosion.GetComponent(SpriteRotate).waitTime = .07;
		while(true)
		{
			player.transform.position.y -= Time.deltaTime*30;
			player.transform.Rotate(Vector3(0,0,20) * Time.deltaTime * 40);
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