#pragma strict

var colorChange:boolean;
var colorForChange:Color;

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

@HideInInspector var choices:int[];

@HideInInspector var playerDest:float;
@HideInInspector var playerStart:float;

var sharkPrefab:GameObject;
var rockPrefab:GameObject;
var player:GameObject;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	heights = [-5.5,-3,-.5,2,4.5];
	leftSide = -3;
	rightSide = 3;
	sharkLimit = 7.5;
	sharkExists = false;
	choices = new int[heights.length];
	
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
	defaultSharkSpeed = 8 + speed * 3;
	
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
			sharks[sharks.length-1] = Instantiate(sharkPrefab,Vector3(Random.Range(-sharkLimit,sharkLimit),heights[i],transform.position.x-1),Quaternion.identity);
			sharks[sharks.length-1].transform.parent = transform;
			sharkExists = true;
			choices[i] = 1;
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
		speeds[i] = Random.Range(defaultSharkSpeed*.7,defaultSharkSpeed*1.3);
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
			if(Finger.GetExists(i))
			{
				importantFinger = i;
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
	}
}

function Play () {

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