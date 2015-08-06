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

var laser:SpriteRenderer;
var laserSprites:Sprite[];
var asteroidPrefab:GameObject;
var missilePrefab:GameObject;
var explosion:GameObject;
var bar:GameObject;
var white:SpriteRenderer;
var mushroom:SpriteRenderer;

@HideInInspector var gameMissiles:GameObject[];
@HideInInspector var asteroid:GameObject;

@HideInInspector var asteroidStartLocation:Vector3;
@HideInInspector var asteroidGoal:Vector3;
@HideInInspector var missileStart:Vector3[];
@HideInInspector var missileGoal:Vector3[];

@HideInInspector var missileAllowance:int;
@HideInInspector var missileCountdown:float;
@HideInInspector var missileSpeed:float;
@HideInInspector var asteroidSpeed:float;
@HideInInspector var asteroidsLeft:int;

@HideInInspector var barTop:float;
@HideInInspector var counterTop:float;


function Start () {
	if(Random.Range(0,10.0) < 1.5)
	{
		AudioManager.PlaySound(worldIntros[Random.Range(0,worldIntros.length)]);
	}
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	asteroidStartLocation = Vector3(9.5,7.1,3.8);
	asteroidGoal = Vector3(-4,-3.7,3.8);
	missileStart = new Vector3[3];
	missileGoal = new Vector3[3];
	
	missileStart[2] = Vector3(6.184,-3.233,3.8);
	missileGoal[2] = Vector3(-2.812,8.576,3.8);
	missileStart[1] = Vector3(5.624,-3.515,3.8);
	missileGoal[1] = Vector3(-3.374,8.3,3.8);
	missileStart[0] = Vector3(5.06,-3.8,3.8);
	missileGoal[0] = Vector3(-3.93,8.01,3.8);
	
	missileCountdown = 0;
	white.color.a = 0;
	mushroom.color.a = 0;
	
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
	missileAllowance = 4 - difficulty;
	gameMissiles = new GameObject[missileAllowance];
	missileSpeed = 10 + speed*4;
	asteroidSpeed = 5 + speed*3;
	if(speed > 3)
	{
		asteroidSpeed -= difficulty *1.5;
	}
	asteroidsLeft = 3;
	laser.sprite = laserSprites[difficulty-1];
	
	barTop = bar.transform.localScale.y;
	counterTop = .7 - .1*speed;
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	
	// If The game doesn't just run in Update.
	Play();
}

function Update () {
	white.color.a -= Time.deltaTime * .13;
	bar.transform.localScale.y = Mathf.Lerp(0,barTop,1-(missileCountdown/counterTop));
	if(missileCountdown <= 0)
	{
		bar.GetComponent(SpriteRenderer).color = Color.green;
	}
	else
	{
		bar.GetComponent(SpriteRenderer).color = Color.red;
	}
	if(!finished)
	{
		missileCountdown = Mathf.MoveTowards(missileCountdown,0,Time.deltaTime);
	}
	if(Input.GetKeyDown("space"))
	{
		Clicked();
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true,0);
	}
	if(asteroidsLeft == 0)
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
		if(Mathf.Abs(Finger.GetPosition(importantFinger).x) < 9 && Mathf.Abs(Finger.GetPosition(importantFinger).y) < 9)
		{
			Clicked();
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
}

function Play () {
	yield WaitForSeconds(.5);
	while(true && asteroidsLeft > 0)
	{
		if(asteroid == null)
		{
			yield WaitForSeconds(.3);
			asteroid = Instantiate(asteroidPrefab,asteroidStartLocation,Quaternion.identity);
			asteroid.transform.parent = transform;
		}
		else
		{
			asteroid.transform.position = Vector3.MoveTowards(asteroid.transform.position,asteroidGoal,Time.deltaTime * asteroidSpeed);
		}
		if(Vector3.Distance(asteroid.transform.position,asteroidGoal) < .2 && !finished)
		{
			mushroom.color.a = 1;
			white.color.a = 1;
			Finish(false,1.5);
		}
		yield;
	}
}

function Clicked() {
	if(missileCountdown <= 0)
	{
		missileCountdown = counterTop;
		if(missileCountdown < .3)
		{
			missileCountdown = .3;
		}
		for(var i:int = 0; i < missileAllowance; i++)
		{
			Fire(Instantiate(missilePrefab,missileStart[i],Quaternion.identity),missileGoal[i]);
		}
	}
}

function Fire(thisMissile:GameObject,thisGoal:Vector3) {
	thisMissile.transform.parent = transform;
	while(thisMissile.transform.position != thisGoal)
	{
		if(asteroid!= null)
		{
			if(Vector2.Distance(thisMissile.transform.position,asteroid.transform.position) < 1)
			{
				
				Destroy(thisMissile);
				Explode();
				break;
			}
		}
		thisMissile.transform.position = Vector3.MoveTowards(thisMissile.transform.position, thisGoal,Time.deltaTime * missileSpeed);
		yield;
	}
}

function Explode () {
	Instantiate(explosion,asteroid.transform.position, Quaternion.identity);
	asteroidsLeft--;
	Destroy(asteroid);
	asteroid = null;
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