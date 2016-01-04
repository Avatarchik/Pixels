#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var cage:GameObject;
var CEO:SpriteRenderer;
var peanut:GameObject;

var sneakingSprites:Sprite[];
var runningSprites:Sprite[];

@HideInInspector var walking:boolean;
@HideInInspector var escaping:boolean;

@HideInInspector var startLocation:Vector3;
@HideInInspector var peanutLocation:Vector3;
@HideInInspector var runLocation:Vector3;

@HideInInspector var walkSpeed:float;

@HideInInspector var drop:boolean;
@HideInInspector var caught:boolean;
@HideInInspector var cageGoal:float;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	startLocation = Vector3(-6.77,-4.3,CEO.transform.position.z);
	peanutLocation = Vector3(.23,-2.35,CEO.transform.position.z);
	runLocation = Vector3(12.65,-13.1,0);
	walking = false;
	escaping = false;
	drop = false;
	cageGoal = -2.5;
	caught = false;
	
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
	length = 10;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	walkSpeed = 3 + speed * 2.5;
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
	Flow();
}

function Update () {
	if(Input.GetKey("space"))
	{
		drop = true;
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false,0);
	}
	
	if(walking || caught)
	{
		CEO.transform.position = Vector3.MoveTowards(CEO.transform.position,peanutLocation,Time.deltaTime * walkSpeed);
	}
	else if(escaping && !caught)
	{
		CEO.transform.position = Vector3.MoveTowards(CEO.transform.position,runLocation,Time.deltaTime * walkSpeed * 2);
	}
	if(escaping)
	{	
		
		Finish(false,.7);
	}
	// Get important finger.
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i) && Finger.GetInGame(i))
			{
				drop = true;
				importantFinger = i;
				break;
			}
		}
	}
	if(drop)
	{
		cage.transform.position.y = Mathf.MoveTowards(cage.transform.position.y,cageGoal,Time.deltaTime * 20);
		if(Mathf.Abs(cage.transform.position.x-CEO.transform.position.x) < 1.4 && Mathf.Abs(cage.transform.position.y-cageGoal) < .5 && Mathf.Abs(CEO.transform.position.y - peanutLocation.y) < 1)
		{
			caught = true;
			Finish(true,.5);
		}
		else if(Mathf.Abs(cage.transform.position.y-cageGoal) < .5)
		{
			walking = false;
			escaping = true;
			CEO.transform.position.z = 0;
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
}

function Flow () {
	yield WaitForSeconds(.4);
	while(Vector3.Distance(CEO.transform.position,peanutLocation) > .1 && !escaping)
	{
		walking = true;
		if(difficulty == 3)
		{
			var counter:float = 0;
			var goal:float = Random.Range(.1,.3);
			while(counter < goal && !escaping)
			{
				counter += Time.deltaTime;
				yield;
			}
			walking = false;
			counter = 0;
			goal = Random.Range(.8,1.6);
			while(counter < goal && !escaping)
			{
				counter += Time.deltaTime;
				yield;
			}
		}
		yield;
	}
	if(Vector3.Distance(CEO.transform.position,peanutLocation) < .1)
	{
		peanut.transform.parent = CEO.transform;
		peanut.transform.position.y = CEO.transform.position.y + 1;
	}
	walking = false;	
	if(difficulty == 1)
	{
		yield WaitForSeconds(1.4);
	}
	else
	{
		yield WaitForSeconds(1.1);
	}
	escaping = true;
}
function Play () {
	var spriteNum:int = 0;
	while(true)
	{
		if(walking)
		{
			if(spriteNum >= sneakingSprites.Length)
			{
				spriteNum = 0;
			}
			CEO.sprite = sneakingSprites[spriteNum];
			spriteNum ++;
			yield WaitForSeconds(.2);
		}
		else if(escaping)
		{
			if(spriteNum >= runningSprites.Length)
			{
				spriteNum = 0;
			}
			CEO.sprite = runningSprites[spriteNum];
			spriteNum ++;
			yield WaitForSeconds(.1);
		}
		yield;
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
			GameObject.FindGameObjectWithTag("GameController").BroadcastMessage("ChangeBackgroundColor", Color(0,0,0,0),SendMessageOptions.DontRequireReceiver);
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