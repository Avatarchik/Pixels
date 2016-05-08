#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var clicked:boolean[];

var tentacles:Tentacle[];

var person:GameObject;
@HideInInspector var shakeAmount:float;

@HideInInspector var startLocation:float;
@HideInInspector var endLocation:float;
@HideInInspector var allowableDistance:float;	

@HideInInspector var tentacleSpeed:float;
@HideInInspector var life:float;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = new boolean[5];
	clicked = [false,false,false,false,false];
	
	// Level specific variable initialization.
	startLocation = 1.2;
	endLocation = .25;
	allowableDistance = 3;
	shakeAmount = 0;
	
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
	length = 7 + 3 * difficulty;
	tentacleSpeed = .24 + (.06 * speed);
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	
	for(var i:int = 0; i < tentacles.length; i++)
	{
		tentacles[i].randomAmount = Random.Range(.5,1.5);
		tentacles[i].progress = 0;
		tentacles[i].shootable = false;
	}
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
	Shake();
}

function Update () {
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true,0);
	}
	// Get important finger.
	for(var i:int = 0; i < Finger.identity.length; i++)
	{
		if(!Master.paused && Finger.GetExists(i) && Finger.GetInGame(i) && !clicked[i] && !finished)
		{
			var distance:float = 1000;
			var closest:int = -1;
			for(var x:int = 0; x < tentacles.length; x++)
			{
				if(Vector2.Distance(Finger.GetPosition(i),tentacles[x].shotMark.transform.position) < distance)
				{
					distance = Vector2.Distance(Finger.GetPosition(i),tentacles[x].shotMark.transform.position);
					closest = x;
				}
			}
			if(closest != -1)
			{
				if(Vector2.Distance(Finger.GetPosition(i),tentacles[closest].shotMark.transform.position) < allowableDistance && tentacles[closest].shootable && !finished)
				{
					tentacles[closest].progress = 0;
				}
			}
			clicked[i] = true;
		}
		else if(!Finger.GetExists(i) || !Finger.GetInGame(i))
		{
			clicked[i] = false;
		}
	}
}

function Play () {
	var uhOh:float = .3;
	while(true)
	{
		var dying:boolean;
		var shake:boolean = false;
		for(var i:int = 0; i < tentacles.length; i++)
		{
			tentacles[i].progress = Mathf.MoveTowards(tentacles[i].progress,1,tentacleSpeed * tentacles[i].randomAmount * Time.deltaTime);
			tentacles[i].tentacle.transform.localPosition.y = Mathf.Lerp(startLocation,endLocation,tentacles[i].progress);
			tentacles[i].shotMark.color.a = -14 + (tentacles[i].progress * 20);
			if(tentacles[i].progress > .7)
			{
				tentacles[i].shootable = true;
				shake = true;
			}
			else
			{
				tentacles[i].shootable = false;
			}
			if(tentacles[i].progress >= 1)
			{
				tentacles[i].tentacle.GetComponent(SpriteRenderer).color = Color.Lerp(tentacles[i].tentacle.GetComponent(SpriteRenderer).color, Color.red,Time.deltaTime*2);
				dying = true;
			}
			else
			{
				tentacles[i].tentacle.GetComponent(SpriteRenderer).color = Color.Lerp(tentacles[i].tentacle.GetComponent(SpriteRenderer).color, Color.white,Time.deltaTime*3);
			}
		}
		if(shake)
		{
			shakeAmount = .2;
		}
		else
		{
			shakeAmount = 0;
		}
		if(dying)
		{
			uhOh -= Time.deltaTime;
		}
		else
		{
			uhOh = .3;
		}
		if(uhOh < 0)
		{
			Finish(false,1);
		}
		yield;
	}
}

function Shake () {
	var origin:Vector3 = person.transform.localPosition;
	while(true)
	{
		var difference:float = shakeAmount * .01;
		person.transform.localPosition = Vector3(Random.Range(origin.x-difference,origin.x+difference),Random.Range(origin.y-difference,origin.y+difference),origin.z);
		yield WaitForSeconds(.01);
	}
	transform.position = origin;
}

class Tentacle {
	var tentacle:SpriteRenderer;
	var shotMark:SpriteRenderer;
	@HideInInspector var progress:float;
	@HideInInspector var randomAmount:float;
	@HideInInspector var shootable:boolean;
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