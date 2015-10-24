#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var brickPrefab:GameObject;
var cloudPrefab:GameObject;
var groundPrefab:GameObject;
var badGuyPrefab:GameObject;
var markerPrefab:GameObject;
@HideInInspector var player:GameObject;

@HideInInspector var deathMovement:float;

@HideInInspector var distanceBetweenBlocks:float;
@HideInInspector var groundHeight:float;
@HideInInspector var enemyHeight:float;
@HideInInspector var platformHeight:float;
@HideInInspector var cloudHeightMinimum:float;
@HideInInspector var cloudHeightMaximum:float;
@HideInInspector var firstBlock:float;
@HideInInspector var numberOfBlocks:int;

@HideInInspector var floors:GameObject[];
@HideInInspector var clouds:GameObject[];
@HideInInspector var enemies:GameObject[];
@HideInInspector var platforms:GameObject[];
@HideInInspector var markers:GameObject[];

@HideInInspector var nearestBlock:int;
@HideInInspector var bottom:float;

@HideInInspector var velocity:float;
@HideInInspector var canJump:boolean;
@HideInInspector var badEnd:boolean;

@HideInInspector var clicked:boolean;

@HideInInspector var movementSpeed:float;

@HideInInspector var endLocation:float;

var playerPrefab:GameObject;
var customMaterial:Material;

function Awake () {
	player = Instantiate(playerPrefab);
	player.transform.position = Vector3(-5.624,-5.639,transform.position.z-1.406);
	player.transform.localScale = Vector3(1.406,1.406,1.406);
	player.transform.parent = transform;
	player.AddComponent(ChangeHue);
	player.GetComponent(ChangeHue).hueMaterial = customMaterial;
	player.GetComponent(ChangeHue).hue = .6;
	player.GetComponent(ChangeHue).saturation = .9;
	player.GetComponent(ChangeHue).doToChildren = true;
	player.GetComponent(ChangeHue).Instant();
	player.GetComponent(PlayerManager).currentState = PlayerState.WalkingFront;
	player.GetComponent(PlayerManager).speedOverride = true;
	player.GetComponent(PlayerManager).thisSpeed = .2;
}

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	distanceBetweenBlocks = 4.5;
	groundHeight = -10;
	enemyHeight = -6.2;
	platformHeight = -5.5;
	cloudHeightMinimum = 4;
	cloudHeightMaximum = 7.6;
	firstBlock = -9;
	numberOfBlocks = 50;
	nearestBlock = 0;
	bottom = groundHeight + 4.376;
	velocity = 0;
	deathMovement = 30;
	canJump = true;
	badEnd = false;
	floors = new GameObject[numberOfBlocks];
	clouds = new GameObject[numberOfBlocks];
	enemies = new GameObject[numberOfBlocks];
	platforms = new GameObject[numberOfBlocks];
	markers = new GameObject[numberOfBlocks];
	clicked = false;
	endLocation = 0;
	
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
	length = 10 + 5/speed;
	length = 8;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	var previousRandomNumber:int = 0;
	var previousPreviousRandomNumber:int = 0;
	for(var i:int = 0; i < numberOfBlocks; i++)
	{
		var location:float = firstBlock + (i*distanceBetweenBlocks);
		markers[i] = Instantiate(markerPrefab,Vector3(location,0,transform.position.z),Quaternion.identity);
		markers[i].transform.parent = transform;
		markers[i].transform.name = "Space: " + i;
		var randomNumber:int = Random.Range(0,difficulty+1);
		if(i>5 && previousRandomNumber == 3 && Random.Range(0,1) == 0 && difficulty == 3)
		{
			randomNumber = 4;
		}
		else if(i > 5 && difficulty == 1 && previousRandomNumber == 0 && previousPreviousRandomNumber == 0)
		{
			randomNumber = 1;
		}
		else if(i < 4 || previousRandomNumber != 0)
		{
			randomNumber = 0;
		}
		switch(randomNumber)
		{
			case 0:
				floors[i] = Instantiate(groundPrefab,Vector3(location,groundHeight,transform.position.z),Quaternion.identity);
				if(Random.value > .5)
				{
					clouds[i] = Instantiate(cloudPrefab,Vector3(location,Random.Range(cloudHeightMinimum,cloudHeightMaximum),transform.position.z),Quaternion.identity);
				}
				else
				{
					clouds[i] = null;
				}
				enemies[i] = null;
				platforms[i] = null;
				break;
			case 1:
				floors[i] = Instantiate(groundPrefab,Vector3(location,groundHeight,transform.position.z),Quaternion.identity);
				if(Random.value > .5)
				{
					clouds[i] = Instantiate(cloudPrefab,Vector3(location,Random.Range(cloudHeightMinimum,cloudHeightMaximum),transform.position.z),Quaternion.identity);
				}
				else
				{
					clouds[i] = null;
				}
				enemies[i] = Instantiate(badGuyPrefab,Vector3(location,enemyHeight,transform.position.z),Quaternion.identity);
				platforms[i] = null;
				break;
			case 2:
				floors[i] = null;
				if(Random.value > .5)
				{
					clouds[i] = Instantiate(cloudPrefab,Vector3(location,Random.Range(cloudHeightMinimum,cloudHeightMaximum),transform.position.z),Quaternion.identity);
				}
				else
				{
					clouds[i] = null;
				}
				enemies[i] = null;
				platforms[i] = null;
				break;
			case 3:
				floors[i] = null;
				if(Random.value > .5)
				{
					clouds[i] = Instantiate(cloudPrefab,Vector3(location,Random.Range(cloudHeightMinimum,cloudHeightMaximum),transform.position.z),Quaternion.identity);
				}
				else
				{
					clouds[i] = null;
				}
				enemies[i] = null;
				platforms[i] = Instantiate(brickPrefab,Vector3(location,platformHeight,transform.position.z),Quaternion.identity);
				break;
			case 4:
				floors[i] = null;
				if(Random.value > .5)
				{
					clouds[i] = Instantiate(cloudPrefab,Vector3(location,Random.Range(cloudHeightMinimum,cloudHeightMaximum),transform.position.z),Quaternion.identity);
				}
				else
				{
					clouds[i] = null;
				}
				enemies[i] = null;
				platforms[i] = null;
				break;
			default:
				break;
		}
		if(floors[i]!= null)
		{
			floors[i].transform.parent = markers[i].transform;
		}
		if(clouds[i]!= null)
		{
			clouds[i].transform.parent = markers[i].transform;
		}
		if(enemies[i]!= null)
		{
			enemies[i].transform.parent = markers[i].transform;
		}
		if(platforms[i]!= null)
		{
			platforms[i].transform.parent = markers[i].transform;
		}
		previousPreviousRandomNumber = previousRandomNumber;
		previousRandomNumber = randomNumber;
	}
	//movementSpeed = 8.5 + (speed * 1.5);
	movementSpeed = 12 + speed * 1;
	
	//movementSpeed = 16 at 5
	//movement = 13 at 1
	// If The game doesn't just run in Update.
	Play();
}

function Update () {
	for(var space:int = 0; space < markers.length; space ++)
	{	
		if(!finished)
		{
			markers[space].transform.position.x -= movementSpeed * Time.deltaTime;
		}
		if(Mathf.Abs(markers[space].transform.position.x - player.transform.position.x + .5) < distanceBetweenBlocks/2)
		{
			nearestBlock = space;
		}
	}
	if(player.transform.position.y >= platformHeight+4 && platforms[nearestBlock] != null)
	{
		bottom = platformHeight+4.376;
	}
	else if(platforms[nearestBlock] != null)
	{
		Finish(false,1);
		Debug.Log("Platform");
	}
	else
	{
		if(floors[nearestBlock]!= null || Mathf.Abs(player.transform.position.x-markers[nearestBlock].transform.position.x) > 1.5)
		{
			bottom = groundHeight+4.376;
		}
		else
		{
			bottom = -30;
		}
	}
	
	if(enemies[nearestBlock] != null)
	{
		if(Mathf.Abs(player.transform.position.x-enemies[nearestBlock].transform.position.x) < 1.5)
		{
			if(player.transform.position.y < enemies[nearestBlock].transform.position.y + 2)
			{
				Finish(false,1);
				Debug.Log("Enemy");
			}
			else if( player.transform.position.y < enemies[nearestBlock].transform.position.y + 3.5)
			{
				Destroy(enemies[nearestBlock]);
				enemies[nearestBlock] = null;
				if(velocity < 0)
				{
					velocity = 30 + speed * 2.5;
					
					//velocity = 40 at 5
					//velocity = 30 at 1
				}
			}
		}
	}
	
	velocity = Mathf.MoveTowards(velocity,-movementSpeed * 4,movementSpeed * 22 * Time.deltaTime);
	
	if(!Input.GetKey("space") && !Finger.GetExists(0) &&  velocity > 0)
	{
		velocity = Mathf.MoveTowards(velocity,0,movementSpeed * 22 * Time.deltaTime);
	}
	
	if(Input.GetKeyDown("space") && canJump && !finished)
	{
		velocity = 59.5 + 1.5*speed;
		// velocity = 67 at 5
		// velocity = 61 at 1
	}
	if(finished && badEnd)
	{
		velocity = 0;
		player.GetComponent(PlayerManager).currentState = PlayerState.Cutscene;
		player.GetComponent(PlayerManager).SetSongSprite(3);
		player.transform.position.y += deathMovement * Time.deltaTime;
		player.transform.Rotate(0,0,50*Time.deltaTime);
		deathMovement -= Time.deltaTime * 80;
	}
	if(player.transform.position.y + (velocity * Time.deltaTime) < bottom && !finished)
	{
		player.transform.position.y = bottom;
		velocity = 0;
	}
	else
	{
		canJump = false;
		player.transform.position.y += velocity * Time.deltaTime;
	}
	if(Mathf.Abs(player.transform.position.y - bottom) < .6)
	{
		canJump = true;
	}
	else
	{
		canJump = false;
	}	
	if(player.transform.position.y < groundHeight + 3.5)
	{
		Finish(false,1);
	}
	//Debug.Log("bottom: " + bottom + " position: " + player.transform.position.y);
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
	if(Finger.GetExists(importantFinger) && !Master.paused && !clicked && canJump && !finished)
	{	
		clicked = true;
		velocity = 59.5 + 1.5*speed;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		clicked = false;
		importantFinger = -1;
	}
	if(finished && !badEnd)
	{
		player.transform.position.y = endLocation;
	}
}

function Play () {

}

function Finish(completionStatus:boolean,waitTime:float) {
	if(!finished)
	{
		endLocation = player.transform.position.y;
		badEnd = !completionStatus;
		finished = true;
		Debug.Log(completionStatus);
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