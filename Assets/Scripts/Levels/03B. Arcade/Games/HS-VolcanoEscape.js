#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var colorChange:boolean;
var colorForChange:Color;

var worldIntros:AudioClip[];

@HideInInspector var importantFinger:int;

@HideInInspector var speed:float;
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

@HideInInspector var score:float;

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
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	lavaOffset = 0;
	floorOffset = 0;
	frontOffset = 0;
	boulderEntrance = Vector3(12,-5.5,1);
	boulderCenter = 1;
	jumpCounter = Mathf.PI;
	playerOrigin = player.transform.position.y;
	playerDistance = 2.3;
	dead = false;
	clicked = false;
	score = 0;
	
	// Speed and difficulty information.
	speed = 1;
	gameSpeed = 2 + speed*.6;
	numberOfBoulders = 100000;
	boulders = new GameObject[numberOfBoulders];
	boulderType = new int[numberOfBoulders];
	waitTime = 1;
	for(var counter:int = 0; counter < speed;counter++)
	{
		waitTime = Mathf.MoveTowards(waitTime,.5,.15);
	}
	
	// If The game doesn't just run in Update.
	Play();
}

function Update () {
	if(!finished)
	{
		score += Time.deltaTime;
		ArcadeTimer.currentTime = score;
		speed += Time.deltaTime * .2;
		gameSpeed = 2 + speed*.6;
		waitTime = 1;
		for(var counter:int = 0; counter < speed;counter++)
		{
			waitTime = Mathf.MoveTowards(waitTime,.5,.15);
		}
	}
	lavaOffset += gameSpeed * Time.deltaTime * .25;
	floorOffset += gameSpeed * Time.deltaTime * .5;
	frontOffset += gameSpeed * Time.deltaTime * .1;
	
	lava.material.SetTextureOffset("_MainTex",Vector2(lavaOffset,0));
	floor.material.SetTextureOffset("_MainTex",Vector2(floorOffset,0));
	front.material.SetTextureOffset("_MainTex",Vector2(frontOffset,0));
	for(var num:int = Mathf.Max(0,bouldersSent - 10); num < bouldersSent + 10; num++)
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
				Finish();
				dead = true;
			}
			if(boulders[num].transform.position.x < -11)
			{
				Destroy(boulders[num]);
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
		boulderType[bouldersSent] = Random.Range(0,3);
		bouldersSent ++;
		yield;
	}
	while(boulders[boulders.length-1].transform.position.x > player.transform.position.x-2)
	{
		yield;
	}
}

function Finish() {
	if(!finished)
	{
		finished = true;
		GameObject.FindGameObjectWithTag("ArcadeManager").GetComponent(ArcadeManager).FinishGame(score);
	}
}