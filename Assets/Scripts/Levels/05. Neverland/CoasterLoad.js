#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var car:GameObject;
@HideInInspector var successLocation:float;
@HideInInspector var failureLocation:float;

@HideInInspector var carSpeed:float;
@HideInInspector var currentSpeed:float;
@HideInInspector var speedAmount:float;

var distanceMarker:SpriteRenderer;
var distanceSprites:Sprite[];

var distanceText:TextMesh;
var speedText:TextMesh;

@HideInInspector var done:boolean;

@HideInInspector var totalDistance:float;

@HideInInspector var projection:float;

@HideInInspector var variance:float;

@HideInInspector var difficultyMultiplier:float;

var alert:SpriteRenderer;
var alertSprites:Sprite[];

var indicator:SpriteRenderer;
var indicatorSprites:Sprite[];

var lever:SpriteRenderer;
var leverSprites:Sprite[];
@HideInInspector var defaultNumber:int;

@HideInInspector var leftLevelLimit:float;
@HideInInspector var rightLevelLimit:float;

@HideInInspector var currentLeverSpriteNumber:int;

@HideInInspector var goodEnd:boolean;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	successLocation = 0;
	failureLocation = 12;
	speedAmount = 0;
	totalDistance = distanceSprites.Length * 20;
	car.transform.position.x = successLocation - totalDistance;
	done = false;
	projection = 0;
	defaultNumber = 6;
	currentLeverSpriteNumber = 6;
	leftLevelLimit = -5;
	rightLevelLimit = 5;
	goodEnd = false;
	
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
	length = 8;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	carSpeed = 40 + (10 * speed);
	difficultyMultiplier = .85 + (.15 * speed);
	variance = Mathf.Max(.35 - (.03 * speed),.25);
	car.transform.position.x = successLocation - Mathf.Min(carSpeed * 3,totalDistance);
	currentSpeed = carSpeed;
	if(difficulty == 3)
	{
		alert.color.a = .4;
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
	projection = car.transform.position.x + currentSpeed * timer;
	if(!done)
	{
		if(car.transform.position.x > 10)
		{
			alert.sprite = alertSprites[3];
			indicator.sprite = indicatorSprites[3];
		}
		else
		{
			if(projection > 100)
			{
				alert.sprite = alertSprites[3];
				indicator.sprite = indicatorSprites[3];
			}
			else if(projection > 30)
			{
				alert.sprite = alertSprites[2];
				indicator.sprite = indicatorSprites[2];
			}
			else if(projection > -10)
			{
				alert.sprite = alertSprites[1];
				indicator.sprite = indicatorSprites[1];
			}
			else
			{
				alert.sprite = alertSprites[0];
				indicator.sprite = indicatorSprites[0];
			}
		}
	}
	if(finished)
	{
		currentSpeed = Mathf.MoveTowards(currentSpeed,0, Time.deltaTime * 30);
		if(goodEnd)
		{
			car.transform.position.x = Mathf.MoveTowards(car.transform.position.x,0,Time.deltaTime * 10);
		}
	}
	currentSpeed += Time.deltaTime * speedAmount;
	car.transform.position.x += currentSpeed * Time.deltaTime;
	distanceMarker.sprite = distanceSprites[Mathf.Max(0,Mathf.Min(Mathf.Floor((car.transform.position.x + totalDistance)/20),distanceSprites.Length-1))];
	distanceText.text = Mathf.Round(Mathf.Abs(car.transform.position.x)).ToString();
	speedText.text = Mathf.Round(currentSpeed).ToString();
	timer -= Time.deltaTime;
	if((timer < 0 || car.transform.position.x > 14) && !finished)
	{
		if(currentSpeed < 20 && Mathf.Abs(car.transform.position.x) < 12)
		{
			Finish(true,1);
		}
		else
		{
			Finish(false,.4);
		}
	}
	if(currentSpeed < 10 && Mathf.Abs(car.transform.position.x) < 12)
	{
		Finish(true,1);
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
		variance = .3;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
}

function Play () {
	var speed:float = 0;
	Reset();
	while(true)
	{
		if(Finger.GetExists(importantFinger) && !Master.paused)
		{
			if(Finger.GetPosition(importantFinger).x < leftLevelLimit)
			{
				currentLeverSpriteNumber = 0;
			}
			else if(Finger.GetPosition(importantFinger).x > rightLevelLimit)
			{
				currentLeverSpriteNumber = leverSprites.length-1;
			}
			else if(Finger.GetPosition(importantFinger).x < 0)
			{
				currentLeverSpriteNumber = defaultNumber + Mathf.Floor(Finger.GetPosition(importantFinger).x - 1);
			}
			else if(Finger.GetPosition(importantFinger).x > 0)
			{
				currentLeverSpriteNumber = defaultNumber + Mathf.Floor(Finger.GetPosition(importantFinger).x + 1);
			}
		}
		speed = (currentLeverSpriteNumber-6) * .1 * difficultyMultiplier;
		if(finished)
		{
			speed = 0;
		}
		speedAmount = speed * 40;
		lever.sprite = leverSprites[currentLeverSpriteNumber];
		yield;
	}
}

function Reset () {
	while(true)
	{
		yield WaitForSeconds(.1);
		if(importantFinger == -1)
		{
			currentLeverSpriteNumber = Mathf.MoveTowards(currentLeverSpriteNumber,defaultNumber,1);
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
		if(completionStatus)
		{
			goodEnd = true;
		}
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