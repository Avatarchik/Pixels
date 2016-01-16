#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var colorChange:boolean;
var colorForChange:Color;

var worldIntros:AudioClip[];

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var heights:float[];
@HideInInspector var sharks:GameObject[];
@HideInInspector var speeds:float[];
@HideInInspector var isShark:boolean[];
@HideInInspector var leftSide:float;
@HideInInspector var rightSide:float;
@HideInInspector var sharkLimit:float;
@HideInInspector var sharkExists:boolean;
@HideInInspector var defaultSharkSpeed:float;
@HideInInspector var deathDistance:float;

@HideInInspector var choices:int[];

@HideInInspector var playerDest:float;
@HideInInspector var playerStart:float;

var sharkPrefab:GameObject;
var rockPrefab:GameObject;
@HideInInspector var player:GameObject;
var playerPrefab:GameObject;

var bubbles:GameObject;

@HideInInspector var clicked:boolean[];

function Awake () {
	player = Instantiate(playerPrefab);
	player.transform.position = Vector3(0.154,-7.4919,transform.position.z+2.27);
	player.transform.localScale = Vector3(.56,.56,.56);
	player.transform.parent = transform;
	player.GetComponent(PlayerManager).currentState = PlayerState.WalkingFront;
	player.GetComponent(PlayerManager).speedOverride = true;
	player.GetComponent(PlayerManager).thisSpeed = .2;
	bubbles.transform.parent = player.transform;
	bubbles.transform.position.x = player.transform.position.x;
	bubbles.transform.position.y = player.transform.position.y;
}

function Start () {
	if(Random.Range(0,10.0) < 2.5)
	{
		AudioManager.PlayCutscene(worldIntros[Random.Range(0,worldIntros.length)]);
	}
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	heights = [-5.5,-3,-.5,2,4.5];
	leftSide = -3;
	rightSide = 3;
	sharkLimit = 7.5;
	sharkExists = false;
	choices = new int[heights.length];
	player.GetComponent(PlayerManager).currentState = PlayerState.WalkingBack;
	clicked = new boolean[5];
	clicked = [false,false,false,false,false];
	playerStart = -7.5;
	playerDest = playerStart;
	deathDistance = 1.2;
	
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
	length = (3.6) - (speed * .3) + (difficulty * 1.5);
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	defaultSharkSpeed = 9 + speed * 2;
	
	for(var i:int = 0; i < heights.length; i++)
	{
		//var tempObject:GameObject;
		var randomNumber:int = Random.Range(0,difficulty);
		if(sharkExists && difficulty < 3)
		{
			Instantiate(rockPrefab,Vector3(Random.Range(leftSide*.8,leftSide*1.2),heights[i],transform.position.z-1),Quaternion.identity).transform.parent = transform;
			Instantiate(rockPrefab,Vector3(Random.Range(rightSide*.8,rightSide*1.2),heights[i],transform.position.z-1),Quaternion.identity).transform.parent = transform;
			choices[i] = 0;
		}
		else if(randomNumber > 0)
		{
			if(i == 2 && choices[i-1] == 1)
			{
				Instantiate(rockPrefab,Vector3(Random.Range(leftSide*.8,leftSide*1.2),heights[i],transform.position.z-1),Quaternion.identity).transform.parent = transform;
				Instantiate(rockPrefab,Vector3(Random.Range(rightSide*.8,rightSide*1.2),heights[i],transform.position.z-1),Quaternion.identity).transform.parent = transform;
				choices[i] = 0;
			}
			else
			{
				var tempArray:GameObject[];
				tempArray = new GameObject[sharks.length];
				for(var y:int = 0; y < sharks.length; y++)
				{
					tempArray[y] = sharks[y];
				}
				sharks = new GameObject[sharks.length+1];
				for(y = 0; y < tempArray.length; y++)
				{
					sharks[y] = tempArray[y];
				}
				sharks[sharks.length-1] = Instantiate(sharkPrefab,Vector3(Random.Range(-sharkLimit,sharkLimit),heights[i],transform.position.z-1),Quaternion.identity);
				sharks[sharks.length-1].transform.parent = transform;
				sharkExists = true;
				choices[i] = 1;
			}
		}
		else
		{
			Instantiate(rockPrefab,Vector3(Random.Range(leftSide*.8,leftSide*1.2),heights[i],transform.position.z-1),Quaternion.identity).transform.parent = transform;
			Instantiate(rockPrefab,Vector3(Random.Range(rightSide*.8,rightSide*1.2),heights[i],transform.position.z-1),Quaternion.identity).transform.parent = transform;
			choices[i] = 0;
		}	
	}
	speeds = new float[sharks.length];
	for(i=0;i<speeds.length;i++)
	{
		speeds[i] = Random.Range(defaultSharkSpeed*.7,defaultSharkSpeed*1.15);
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
		if(player.transform.position.y < 7.5)
		{
			Finish(false,0);
		}
		else
		{
			Finish(true,0);
		}
	}
	for(var i:int = 0; i < Finger.identity.length; i++)
	{
		if(Finger.GetExists(i) && Finger.GetInGame(i) && !clicked[i] && !finished)
		{
			clicked[i] = true;
			Clicked();
			break;
		}
		else if(!Finger.GetExists(i) || !Finger.GetInGame(i))
		{
			clicked[i] = false;
		}
	}
	
	for(var spot:int = 0; spot < sharks.length; spot++)
	{
		if(sharks[spot].transform.position.x + Time.deltaTime*speeds[spot] > sharkLimit || sharks[spot].transform.position.x + Time.deltaTime*speeds[spot] < -sharkLimit)
		{
			speeds[spot] = -speeds[spot];
		}
		if(speeds[spot] > 0)
		{
			sharks[spot].transform.localScale.x = -1;
		}
		else
		{
			sharks[spot].transform.localScale.x = 1;
		}
		sharks[spot].transform.position.x += speeds[spot] * Time.deltaTime;
		if(Mathf.Abs((sharks[spot].transform.position.y-.4)-player.transform.position.y) < deathDistance * .7 && Mathf.Abs(sharks[spot].transform.position.x-player.transform.position.x) < deathDistance)
		{
			player.transform.parent = sharks[spot].transform;
			Finish(false,0);
		}
	}
	player.GetComponent(PlayerManager).currentState = PlayerState.WalkingBack;
	
	if(Input.GetKeyDown("space"))
	{
		Clicked();
	}
	player.GetComponent(PlayerManager).currentState = PlayerState.WalkingBack;
	if(!finished)
	{
		playerDest = Mathf.MoveTowards(playerDest,playerStart,Time.deltaTime * (1 + .1 * speed));
		player.transform.position.y = Mathf.MoveTowards(player.transform.position.y,playerDest,Time.deltaTime* (10 +speed * 2));
	}
	
	if(player.transform.position.y > 7.5)
	{
		player.transform.position.y = Mathf.MoveTowards(player.transform.position.y,20,Time.deltaTime* (10 +speed * 2));
		Finish(true,0);
	}
}

function Clicked() {
	playerDest += 1;
}	

function Play () {

}

function Finish(completionStatus:boolean,waitTime:float) {
	UITimer.soundsOn = !completionStatus;
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