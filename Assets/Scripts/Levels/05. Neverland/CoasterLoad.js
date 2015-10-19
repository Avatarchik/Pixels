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

var alert:SpriteRenderer;
var alertSprites:Sprite[];

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
	length = 6;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	carSpeed = 15 + (35 * speed);
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
		if(projection > 100)
		{
			alert.sprite = alertSprites[3];
		}
		else if(projection > 30)
		{
			alert.sprite = alertSprites[2];
		}
		else if(projection > -10)
		{
			alert.sprite = alertSprites[1];
		}
		else
		{
			alert.sprite = alertSprites[0];
		}
	}
	currentSpeed = Mathf.Lerp(carSpeed,0,speedAmount);
	car.transform.position.x += currentSpeed * Time.deltaTime;
	distanceMarker.sprite = distanceSprites[Mathf.Max(0,Mathf.Min(Mathf.Floor((car.transform.position.x + totalDistance)/20),distanceSprites.Length-1))];
	if(Input.GetKey("space"))
	{
		speedAmount = Mathf.Lerp(speedAmount,1,Time.deltaTime * variance);
		speedAmount = Mathf.MoveTowards(speedAmount,1,Time.deltaTime * variance);
	}
	distanceText.text = Mathf.Round(Mathf.Abs(car.transform.position.x)).ToString();
	speedText.text = Mathf.Round(currentSpeed).ToString();
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		if(currentSpeed < 15 && Mathf.Abs(car.transform.position.x) < 12)
		{
			speedAmount = 1;
			Finish(true,1);
		}
		else
		{
			Finish(false,.4);
		}
	}
	if(!done && currentSpeed * timer < car.transform.position.x * -1)
	{
		// TOO SLOW
		done = true;
		Finish(false,.4);
	}
	if(!done && Mathf.Round(currentSpeed) == 0)
	{
		done = true;
		if(Mathf.Abs(car.transform.position.x) < 12)
		{
			Finish(true,1);
		}
		else
		{
			Finish(false,.4);
		}
	}
	if(!done && car.transform.position.x > failureLocation)
	{
		alert.sprite = alertSprites[3];
		Debug.Log("hey");
		Finish(false,.4);
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
		speedAmount = Mathf.Lerp(speedAmount,1,Time.deltaTime * variance);
		speedAmount = Mathf.MoveTowards(speedAmount,1,Time.deltaTime * variance);
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
}

function Play () {

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

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", colorForChange,SendMessageOptions.DontRequireReceiver);
	yield;
}