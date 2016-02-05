#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var bottles:GameObject[];
var bunches:GameObject[];

var difficulty1Bottles:boolean[];
var difficulty2Bottles:boolean[];
var difficulty3Bottles:boolean[];

@HideInInspector var bottlesExist:boolean[];
@HideInInspector var groupsExist:boolean[];
@HideInInspector var marker:int;
@HideInInspector var running:boolean;

@HideInInspector var movementSpeed:float;

var CEO:GameObject;

var CEOStandingSprite:Sprite;
var CEORunningSprites:Sprite[];

var bottleSprites:Sprite[];

@HideInInspector var bottleHit:boolean[];

@HideInInspector var CEOLeftLimit:float;
@HideInInspector var CEORightLimit:float;
@HideInInspector var CEOZ1:float;
@HideInInspector var CEOZ2:float;
@HideInInspector var CEOZ3:float;
@HideInInspector var CEOHeight1:float;
@HideInInspector var CEOHeight2:float;
@HideInInspector var CEOHeight3:float;

@HideInInspector var clicked:boolean[];

var crashSound:AudioClip;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	CEOLeftLimit = -8.3;
	CEORightLimit = 8.3;
	CEOZ1 = 3.599;
	CEOZ2 = 6.1;
	CEOZ3 = 15;
	CEOHeight1 = -6.46;
	CEOHeight2 = -4.22;
	CEOHeight3 = -1.96;
	clicked = new boolean[5];
	clicked = [false,false,false,false,false];
	groupsExist = new boolean[bunches.length];
	movementSpeed = 20;
	marker = 0;
	CEO.transform.position.y = CEOHeight1;
	CEO.transform.position.x = CEOLeftLimit;
	CEO.transform.position.z = CEOZ1;
	running = false;
	bottleHit = new boolean[69];
	
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
	length = 7;
	for(var time:int = 0; time < speed;time ++)
	{
		length = Mathf.MoveTowards(length,5,.4);
	}
	length += difficulty;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	switch(difficulty)
	{
		case 1:
			bottlesExist = difficulty1Bottles;
			break;
		case 2:
			bottlesExist = difficulty2Bottles;
			break;
		case 3:
			bottlesExist = difficulty3Bottles;
			break;
		default:
			break;
	}
	for(var i:int = 0; i < bottles.length; i++)
	{
		bottleHit[i] = false;
	}
	CheckGroups(true);
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
	CEOMovement();
	CEOAnimate();
	for(i = 0; i < bottles.length; i++)
	{
		BottleAnimate(i);
	}
}

function Update () {
	if(Input.GetKeyDown("space"))
	{
		if(marker < groupsExist.Length)
		{
			groupsExist[marker] = false;
		}
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false,0);
	}
	// Get important finger.
	for(var i:int = 0; i < Finger.identity.length; i++)
	{
		if(Finger.GetExists(i) && !Master.paused && !clicked[i])
		{
			clicked[i] = true;
			var distance:float = 1000;
			var closest:int = -1;
			for(var group:int = 0; group < bunches.length; group++)
			{
				if(Finger.GetPosition(i).y < 2 && Vector3.Distance(Finger.GetPosition(i),Vector3(bunches[group].transform.position.x,bunches[group].transform.position.y,0)) < distance)
				{
					distance = Vector3.Distance(Finger.GetPosition(i),Vector3(bunches[group].transform.position.x,bunches[group].transform.position.y,0));
					closest = group;
				}			
			}
			if(closest != -1)
			{
				bottlesExist[closest * 3] = false;
				bottlesExist[(closest * 3)+1] = false;
				bottlesExist[(closest * 3)+2] = false;
				bottleHit[closest * 3] = true;
				bottleHit[(closest * 3)+1] = true;
				bottleHit[(closest * 3)+2] = true;
			}
			CheckGroups(false);
		}
		else if(!Finger.GetExists(i) || !Finger.GetInGame(i))
		{
			clicked[i] = false;
		}
	}
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	
}

function CheckGroups (clean:boolean) {
	for(var group:int = 0; group < bunches.length; group++)
	{
		if(!bottlesExist[group * 3] && !bottlesExist[(group * 3)+1] && !bottlesExist[(group * 3)+2])
		{
			if(groupsExist[group])
			{	
				groupsExist[group] = false;
			}
			if(clean)
			{
				bottles[group*3].GetComponent(SpriteRenderer).color.a = 0;
				bottles[(group * 3)+1].GetComponent(SpriteRenderer).color.a = 0;
				bottles[(group * 3)+2].GetComponent(SpriteRenderer).color.a = 0;
				
				bottleHit[group * 3] = true;
				bottleHit[(group * 3)+1] = true;
				bottleHit[(group * 3)+2] = true;
			}
		}
		else
		{
			groupsExist[group] = true;
		}
	}
}

function Play () {
	
	while(marker < groupsExist.length)
	{
		while(groupsExist[marker])
		{
			yield;
		}
		marker ++;
		yield;
	}
}

function CEOMovement () {
	while(true)
	{
		if(marker < 8)
		{
			CEO.transform.position.x = Mathf.MoveTowards(CEO.transform.position.x,bunches[marker].transform.position.x + .5,Time.deltaTime * movementSpeed);
			if(Mathf.Abs(CEO.transform.position.x - (bunches[marker].transform.position.x + .5)) > .1)
			{
				running = true;
			}
			else
			{
				running = false;
			}
		}
		else if(marker < 15)
		{
			if(Mathf.Abs(CEO.transform.position.y - CEOHeight1) < .1)
			{
				if(Mathf.Abs(CEO.transform.position.x - CEORightLimit) > .01)
				{
					running = true;
					CEO.transform.position.x = Mathf.MoveTowards(CEO.transform.position.x,CEORightLimit, Time.deltaTime * movementSpeed);
				}
				else
				{
					
					CEO.transform.position.x = CEOLeftLimit;
					CEO.transform.position.y = CEOHeight2;
					CEO.transform.position.z = CEOZ2;
				}
			}
			else
			{
				CEO.transform.position.x = Mathf.MoveTowards(CEO.transform.position.x,bunches[marker].transform.position.x + .5,Time.deltaTime * movementSpeed);
				if(Mathf.Abs(CEO.transform.position.x - (bunches[marker].transform.position.x + .5)) > .1)
				{
					running = true;
				}
				else
				{
					running = false;
				}
			}
		}
		else if(marker < bunches.Length)
		{
			if(Mathf.Abs(CEO.transform.position.y - CEOHeight2) < .1)
			{
				if(Mathf.Abs(CEO.transform.position.x - CEORightLimit) > .01)
				{
					CEO.transform.position.x = Mathf.MoveTowards(CEO.transform.position.x,CEORightLimit, Time.deltaTime * movementSpeed);
				}
				else
				{
					CEO.transform.position.x = CEOLeftLimit;
					CEO.transform.position.y = CEOHeight3;
					CEO.transform.position.z = CEOZ3;
				}
			}
			else
			{
				CEO.transform.position.x = Mathf.MoveTowards(CEO.transform.position.x,bunches[marker].transform.position.x + .5,Time.deltaTime * movementSpeed);
			}
		}
		else
		{
			running = true;
			Finish(true, .5);
		}
		yield;
	}
}

function CEOAnimate () {
	var count:int = 0;
	while(true)
	{
		yield WaitForSeconds(.05);
		count ++;
		if(running)
		{
			if(count >= CEORunningSprites.Length)
			{
				count = 0;
			}
			CEO.GetComponent(SpriteRenderer).sprite = CEORunningSprites[count];
		}
		else
		{
			CEO.GetComponent(SpriteRenderer).sprite = CEOStandingSprite;
		}
	}
	
}

function Finish(completionStatus:boolean) {
	Finish(completionStatus,0);
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

function BottleAnimate (thisBottle:int) {
	if(!bottleHit[thisBottle])
	{
		while(!bottleHit[thisBottle])
		{
			yield;
		}
		AudioManager.PlaySound(crashSound,.03,Random.Range(.7,1.3));
		BottleFly(bottles[thisBottle].transform);
		bottles[thisBottle].GetComponent(SpriteRenderer).sprite = bottleSprites[0];
		yield WaitForSeconds(.05);
		bottles[thisBottle].GetComponent(SpriteRenderer).sprite = bottleSprites[1];
		yield WaitForSeconds(.05);
		bottles[thisBottle].GetComponent(SpriteRenderer).sprite = bottleSprites[2];
		yield WaitForSeconds(.05);
		bottles[thisBottle].GetComponent(SpriteRenderer).sprite = bottleSprites[3];
		yield WaitForSeconds(.05);
		bottles[thisBottle].GetComponent(SpriteRenderer).sprite = bottleSprites[4];
		yield WaitForSeconds(.05);
		bottles[thisBottle].GetComponent(SpriteRenderer).sprite = bottleSprites[5];
		yield WaitForSeconds(.05);
		bottles[thisBottle].GetComponent(SpriteRenderer).sprite = bottleSprites[6];
	}
}

function BottleFly (bottle:Transform) {
	var originHeight:float = bottle.position.y;
	var counter:float = 0;
	while(counter < Mathf.PI)
	{
		counter += Time.deltaTime * 9;
		bottle.position.y = originHeight + Mathf.Sin(counter);
		yield;
	}
	bottle.GetComponent(SpriteRenderer).color.a = 0;
}

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", colorForChange,SendMessageOptions.DontRequireReceiver);
	yield;
}