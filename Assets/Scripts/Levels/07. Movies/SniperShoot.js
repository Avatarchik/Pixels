#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var clicked:boolean;

var doubleStuff:GameObject;
var train:SpriteRenderer;

var reticle:SpriteRenderer;
var dude:SpriteRenderer;

@HideInInspector var trainSpeed:float;
@HideInInspector var originalSpeed:float;
@HideInInspector var shootDistance:float;

@HideInInspector var zoomed:boolean;

var dudeSprites:Sprite[];

@HideInInspector var shot:boolean;

var button:SpriteRenderer;
var aimer:SpriteRenderer;

@HideInInspector var correctOrder:int;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = false;
	
	// Level specific variable initialization.
	zoomed = false;
	shootDistance = 2;
	shot = false;
	correctOrder = 0;
	
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
	trainSpeed = 12 + 6*speed;
	originalSpeed = trainSpeed;
	length = 20;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	if(difficulty == 3)
	{
		Walk();
	}
	Play();
}

function Update () {
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false,0);
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
		if(!clicked)
		{
			if(zoomed)
			{
				if(!shot)
				{
					Shoot();
				}
			}
			else
			{	
				Zoom();
			}
			clicked = true;
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		clicked = false;
		importantFinger = -1;
	}
	
	if(Input.GetKeyDown("space"))
	{
		if(zoomed)
		{
			if(!shot)
			{
				Shoot();
			}
		}
		else
		{	
			Zoom();
		}
	}
	
	if(!shot && dude.transform.position.x > reticle.transform.position.x + shootDistance)
	{
		Finish(false,.4);
	}
}

function Walk () {
	var which:int = 0;
	while(true)
	{
		if(which == 0)
		{
			which = 1;
		}
		else
		{
			which = 0;
		}
		if(!shot)
		{
			dude.sprite = dudeSprites[which];
		}
		dude.transform.position.x += .2;
		yield WaitForSeconds(.4);
		yield;
	}
}

function NoteWait (waitAmount:float) {
	yield WaitForSeconds(waitAmount);
	if(correctOrder == 0)
	{
		correctOrder = 1;
	}
	SendMessage("NextNotify", SendMessageOptions.DontRequireReceiver);
}
function Play () {
	var amount:float = Random.Range(1,2.9);
	train.transform.position.x -= trainSpeed * amount;
	NoteWait(amount);
	while(true)
	{
		if(zoomed)
		{
			reticle.color.a = 1;
			button.color.a = 0;
			aimer.color.a = 0;
			if(!shot)
			{
				trainSpeed *= 1 + Time.deltaTime;
			}
		}
		else
		{
			reticle.color.a = 0;
			button.color.a = 1;
			aimer.color.a = 1;
		}
		train.transform.position.x += Time.deltaTime * trainSpeed;
		yield;
	}
}

function Zoom () {
	SendMessage("NextNotify", SendMessageOptions.DontRequireReceiver);
	if(correctOrder != 1)
	{
		correctOrder = 5;
		SendMessage("NextNotify", SendMessageOptions.DontRequireReceiver);
	}
	trainSpeed *= .4;
	doubleStuff.transform.localScale = Vector3(3,3,3);
	zoomed = true;
}

function Shoot () {
	shot = true;
	if(Vector2.Distance(reticle.transform.position,dude.transform.position) < shootDistance)
	{
		trainSpeed = originalSpeed * .4;
		MoveDude();
		dude.sprite = dudeSprites[2];
		Finish(true,1.7);
	}
	else
	{
		Finish(false,1);
		trainSpeed *= 5;
	}
}

function MoveDude () {
	var amount:float = -1.5;
	while(true)
	{
		dude.transform.position -= Time.deltaTime * Vector3(10,amount,0);
		amount += Time.deltaTime * 3;
		yield;
	}
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