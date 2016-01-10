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

var demonArms:SpriteRenderer[];
var demonSprites:Sprite[];
var demonAltSprites:Sprite[];

var lasers:SpriteRenderer[];
@HideInInspector var currentSprites:Sprite[];
@HideInInspector var demonArmSpeed:float[];
@HideInInspector var demonArmProgress:float[];
@HideInInspector var touchDistance:float;

@HideInInspector var clicked:boolean;

var flash:SpriteRenderer;

var shotgunSound:AudioClip;

function Start () {
	if(Random.Range(0,10.0) < 2.5)
	{
		AudioManager.PlayCutscene(worldIntros[Random.Range(0,worldIntros.length)]);
	}
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	demonArmProgress = new float[demonArms.length];
	demonArmSpeed = new float[demonArms.length];
	currentSprites = demonSprites;
	clicked = false;
	touchDistance = 2;
	
	// Speed and difficulty information.
	if(Application.loadedLevelName == "MicroTester")
	{
		speed = MicroTester.timeMultiplier;
		difficulty = MicroTester.difficulty;
	}
	else
	{
		speed = GameManager.bossDifficulty;
		difficulty = GameManager.bossDifficulty;
	}
	length = 8;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	for(var i:int = 0; i < demonArms.length; i++)
	{
		Play(demonArms[i],i);
		Sprites();
	}
}

function Update () {
	flash.color.a = Mathf.MoveTowards(flash.color.a,0,Time.deltaTime * 10);
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
		
	}
	else if(!Finger.GetExists(importantFinger))
	{
		clicked = false;
		importantFinger = -1;
	}
}

function Play (arm:SpriteRenderer,number:int) {
	demonArmProgress[number] = 0;
	demonArmSpeed[number] = Random.Range(.7,1.2) + Random.Range(.2,1.6) * (.7 + (.3 * speed));
	while(true && !finished)
	{
		if(Finger.GetExists(importantFinger) && !Master.paused && !clicked && Mathf.Abs(Finger.GetPosition(importantFinger).x-arm.transform.position.x) < touchDistance)
		{
			AudioManager.PlaySound(shotgunSound,.4,Random.Range(.2,.4));
			flash.color = Color.red;
			flash.color.a = 1;
			clicked = true;
			if(demonArmProgress[number] > 3)
			{
				LaserFire(number);
				demonArmProgress[number] = 0;
				demonArmSpeed[number] = Random.Range(.7,1.2	) + Random.Range(.2,1.6) * speed;
			}
		}
		demonArmProgress[number] = Mathf.MoveTowards(demonArmProgress[number], 8,Time.deltaTime * demonArmSpeed[number]);
		arm.sprite = currentSprites[Mathf.Min(Mathf.Floor(demonArmProgress[number]),5.5)];
		if(demonArmProgress[number] > 7)
		{
			Finish(false,.5);
		}
		yield;
	}
}

function LaserFire (which:int) {
	lasers[which].enabled = true;
	yield WaitForSeconds(.5);
	lasers[which].enabled = false;
}

function Sprites () {
	while(true)
	{
		currentSprites = demonSprites;
		yield WaitForSeconds(.3);
		currentSprites = demonAltSprites;
		yield WaitForSeconds(.1);
		yield;
	}
}

function Finish(completionStatus:boolean,waitTime:float) {
	if(!finished)
	{
		if(!completionStatus)
		{
			Redness();
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

function Redness () {
	while(true)
	{
		GetComponent(SpriteRenderer).color = Color.Lerp(GetComponent(SpriteRenderer).color,Color.red,Time.deltaTime);
		yield;
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