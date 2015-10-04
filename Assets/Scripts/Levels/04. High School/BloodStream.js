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

var virusSprites:Sprite[];
var virusPrefab:GameObject;
@HideInInspector var virusTop:float;
@HideInInspector var virusBottom:float;
@HideInInspector var virusZ:float;
@HideInInspector var topLimit:float;
@HideInInspector var bottomMultiplier:float;

@HideInInspector var player:GameObject;
var playerPrefab:GameObject;

@HideInInspector var playerHeight:float;
@HideInInspector var playerLimit:float;
@HideInInspector var target:float;
@HideInInspector var distanceFromPlayer:float;
@HideInInspector var dead:boolean;

@HideInInspector var viruses:GameObject[];
@HideInInspector var virusStartPositions:float[];

@HideInInspector var currentVirus:int;
@HideInInspector var virusSpeed:float;
@HideInInspector var virusWaitTime:float;

function Awake () {
	player = Instantiate(playerPrefab);
	player.transform.position = Vector3(0,-4.497,transform.position.z-3.55);
	player.transform.localScale = Vector3(1.5,1.5,1.5);
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
	virusTop = 2;
	virusBottom = -6;
	topLimit = 2.01;
	bottomMultiplier = 3;
	currentVirus = 0;
	playerHeight = -5.5;
	playerLimit = 6;
	player.GetComponent(PlayerManager).currentState = PlayerState.StandingBack;
	target = 0;
	virusZ = 5;
	distanceFromPlayer = 2.5;
	dead = false;
	
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
	viruses = new GameObject[4+difficulty*2];
	virusStartPositions = new float[viruses.length];
	virusSpeed = 4 + 1 * speed;
	virusWaitTime = .7 - (.1*speed);
	length = 2 + viruses.Length * virusWaitTime + (virusTop - virusBottom)/virusSpeed;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	if(virusWaitTime < .3)
	{
		virusWaitTime = .3;
	}
	
	for(var i:int = 0; i<viruses.length;i++)
	{
		virusStartPositions[i] = Random.Range(-topLimit,topLimit);
		viruses[i] = Instantiate(virusPrefab,Vector3(virusStartPositions[i],virusTop,virusZ),Quaternion.identity);
		viruses[i].transform.parent = transform;
		viruses[i].transform.localScale = Vector3(1,1,1);
		viruses[i].AddComponent(SpriteRenderer);
		viruses[i].GetComponent(SpriteRenderer).sprite = null;
		viruses[i].GetComponentInChildren(ParticleSystem).emissionRate = 0;
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
	for(var i:int = 0; i<viruses.length;i++)
	{
		if(i<currentVirus)
		{
			viruses[i].GetComponentInChildren(ParticleSystem).emissionRate = 50;
			if(viruses[i].transform.position.y > virusBottom)
			{
				viruses[i].transform.position = Vector3.MoveTowards(viruses[i].transform.position, Vector3(virusStartPositions[i]*bottomMultiplier,virusBottom,virusZ),Time.deltaTime*virusSpeed);
				if(viruses[i].transform.position.y > 0)
				{
					viruses[i].GetComponent(SpriteRenderer).sprite = virusSprites[0];
				}
				else if(Mathf.Floor(Mathf.Abs((viruses[i].transform.position.y)/(virusBottom)) * 6) < 6)
				{
					viruses[i].GetComponent(SpriteRenderer).sprite = virusSprites[Mathf.Floor(Mathf.Abs((viruses[i].transform.position.y)/(virusBottom)) * 6)];
				}
				else
				{
					viruses[i].GetComponent(SpriteRenderer).sprite = virusSprites[virusSprites.length-1];
				}
			}
			else
			{
				if(Mathf.Abs(viruses[i].transform.position.y - virusBottom) < .5 && Mathf.Abs(viruses[i].transform.position.x - player.transform.position.x) < distanceFromPlayer)
				{
					dead = true;
					Finish(false,1);
				}
				viruses[i].transform.position.y -= Time.deltaTime * virusSpeed * 3;
			}
		}
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true,0);
	}
	// Get important finger.
	if(importantFinger == -1)
	{
		for(i = 0; i < Finger.identity.length; i++)
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
		if(Mathf.Abs(Finger.GetPosition(importantFinger).x - player.transform.position.x) < 3 && Mathf.Abs(Finger.GetPosition(importantFinger).x) < 9 && Mathf.Abs(Finger.GetPosition(importantFinger).y) < 9)
		{
			target = Finger.GetPosition(importantFinger).x;
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	
	if(target > player.transform.position.x && Mathf.Abs(target - player.transform.position.x) > .1)
	{
		player.GetComponent(PlayerManager).currentState = PlayerState.WalkingRight;
	}
	else if(target < player.transform.position.x && Mathf.Abs(target - player.transform.position.x) > .1)
	{
		player.GetComponent(PlayerManager).currentState = PlayerState.WalkingLeft;
	}
	else
	{
		player.GetComponent(PlayerManager).currentState = PlayerState.StandingBack;
	}
	
	if(target>0)
	{
		player.transform.position.x = Mathf.Min(target, 6);
	}
	else
	{
		player.transform.position.x = Mathf.Max(target, -6);
	}
	
	if(dead)
	{
		player.transform.position.y -= Time.deltaTime * virusSpeed * 5;
	}
}

function Play () {
	while(true && currentVirus < viruses.Length)
	{
		yield WaitForSeconds(virusWaitTime);
		currentVirus ++;
	}
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
	while(timer > length)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", colorForChange,SendMessageOptions.DontRequireReceiver);
	yield;
}