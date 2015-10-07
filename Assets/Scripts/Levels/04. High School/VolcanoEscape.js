#pragma strict

var colorChange:boolean;
var colorForChange:Color;

var worldIntros:AudioClip[];

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var lava:Renderer;
var floor:Renderer;
var front:Renderer;

var boulderPrefab:GameObject;

var playerPrefab:GameObject;
@HideInInspector var player:GameObject;

@HideInInspector var playerOrigin:float;
@HideInInspector var playerDistance:float;
@HideInInspector var dead:boolean; 

@HideInInspector var boulderEntrance:Vector3;
@HideInInspector var boulderCenter:float;

@HideInInspector var lavaOffset:float;
@HideInInspector var floorOffset:float;
@HideInInspector var frontOffset:float;
@HideInInspector var numberOfBoulders:float;
@HideInInspector var bouldersSent:int;
@HideInInspector var boulders:GameObject[];
@HideInInspector var boulderType:int[];

@HideInInspector var gameSpeed:float;
@HideInInspector var waitTime:float;
@HideInInspector var jumpCounter:float;
@HideInInspector var clicked:boolean;

function Awake () {
	player = Instantiate(playerPrefab);
	player.transform.position = Vector3(-5.624,-4.6257,transform.position.z-2.9);
	player.transform.localScale = Vector3(1.406,1.406,1.406);
	player.transform.parent = transform;
	player.GetComponent(PlayerManager).currentState = PlayerState.WalkingFront;
	player.GetComponent(PlayerManager).speedOverride = true;
	player.GetComponent(PlayerManager).thisSpeed = .2;
}

function Start () {
	if(Random.Range(0,10.0) < 2.5)
	{
		AudioManager.PlaySound(worldIntros[Random.Range(0,worldIntros.length)]);
	}
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	lavaOffset = 0;
	floorOffset = 0;
	frontOffset = 0;
	boulderEntrance = Vector3(14,-5.5,1);
	boulderCenter = 1;
	jumpCounter = Mathf.PI;
	playerOrigin = player.transform.position.y;
	playerDistance = 2.5;
	dead = false;
	clicked = false;
	
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
	gameSpeed = 2 + speed*.6;
	numberOfBoulders = 4 + difficulty;
	boulders = new GameObject[numberOfBoulders];
	boulderType = new int[numberOfBoulders];
	waitTime = 1;
	for(var counter:int = 0; counter < speed;counter++)
	{
		waitTime = Mathf.MoveTowards(waitTime,.5,.15);
	}
	length = 3 + numberOfBoulders * waitTime;
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
	lavaOffset += gameSpeed * Time.deltaTime * .25;
	floorOffset += gameSpeed * Time.deltaTime * .5;
	frontOffset += gameSpeed * Time.deltaTime * .1;
	
	lava.material.SetTextureOffset("_MainTex",Vector2(lavaOffset,0));
	floor.material.SetTextureOffset("_MainTex",Vector2(floorOffset,0));
	front.material.SetTextureOffset("_MainTex",Vector2(frontOffset,0));
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true,0);
	}
	for(var num:int = 0; num < boulders.length; num++)
	{
		if(boulders[num] != null)
		{
			boulders[num].transform.position.x -= gameSpeed * 5 * Time.deltaTime;
			if(boulderType[num] == 1)
			{
				var adjustedPosition:float = (boulders[num].transform.position.x - 3)/7;
				boulders[num].transform.position.y = boulderEntrance.y + (Mathf.Abs(Mathf.Sin(adjustedPosition)) * 6);
			}
			if(Vector3.Distance(boulders[num].transform.position,player.transform.position) < playerDistance)
			{
				Finish(false,1);
				dead = true;
			}
		}
	}
	
	// Get important finger.
	if(importantFinger == -1)
	{
		clicked = false;
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
	if(Finger.GetExists(importantFinger) && Finger.GetInGame(importantFinger) && !Master.paused && !clicked)
	{
		if(Mathf.Abs(jumpCounter-Mathf.PI) < .1)
		{
			jumpCounter = 0;
		}
		clicked = true;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	//Player movement stuff.
	if(Input.GetKeyDown("space") && Mathf.Abs(jumpCounter-Mathf.PI) < .1)
	{
		jumpCounter = 0;
	}
	jumpCounter = Mathf.MoveTowards(jumpCounter,Mathf.PI,Time.deltaTime * gameSpeed * 1.8);
	player.transform.position.y = playerOrigin + Mathf.Sin(jumpCounter) * 4.5;
	if(dead)
	{
		player.transform.position.x -= gameSpeed * 7 * Time.deltaTime;
	}
}

function Play () {
	while(bouldersSent < numberOfBoulders)
	{
		yield WaitForSeconds(Random.Range(waitTime*.8,waitTime*1.2));
		boulders[bouldersSent] = Instantiate(boulderPrefab,boulderEntrance,Quaternion.identity);
		boulders[bouldersSent].transform.parent = transform;
		boulders[bouldersSent].transform.localScale = Vector3(1,1,1);
		if(difficulty > 2)
		{
			boulderType[bouldersSent] = Random.Range(0,2);
		}
		bouldersSent ++;
		yield;
	}
	while(boulders[boulders.length-1].transform.position.x > player.transform.position.x-2)
	{
		yield;
	}
	Finish(true,0);
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