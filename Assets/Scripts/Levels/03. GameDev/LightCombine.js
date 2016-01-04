#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;
@HideInInspector var importantLens:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var headers:SpriteRenderer[];
var lenses:SpriteRenderer[];

var arrows:SpriteRenderer;
var arrowSprites:Sprite[];

var completeness:SpriteRenderer;
var completenessSprites:Sprite[];

@HideInInspector var allowableHeader:SpriteRenderer[];
@HideInInspector var allowableLenses:SpriteRenderer[];

@HideInInspector var gameProgress:int;
@HideInInspector var lensesPlugged:boolean[];
@HideInInspector var numberOfLenses:int;
@HideInInspector var lensChoices:int[];
@HideInInspector var optionChoices:int[];

@HideInInspector var lensLocations:Vector3[];
@HideInInspector var lensLocationsAvailable:boolean[];

@HideInInspector var plugLocation:Vector3;

@HideInInspector var reloading:boolean;

@HideInInspector var numberToBeat:int;

var successLightThings:SpriteRenderer[];

var shuffle:AudioClip;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	gameProgress = 0;
	lensChoices = new int[2];
	importantLens = 0;
	lensesPlugged = new boolean[lenses.length];
	successLightThings[0].color.a = 0;
	successLightThings[1].color.a = 0;
	successLightThings[2].color.a = 0;
	
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
	var lengthModifier:float = .5 * speed;
	if(lengthModifier > 2)
	{
		lengthModifier = 2 + .1 * speed;
	}
	length = 3 * (5-lengthModifier);
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	reloading = false;
	if(difficulty == 3)
	{
		lensLocations = new Vector3[4];
		lensLocations[0] = Vector3(-6.03,-1.561,transform.position.z-1);
		lensLocations[1] = Vector3(-2.25,-5.48,transform.position.z-1);
		lensLocations[2] = Vector3(2.25,-5.48,transform.position.z-1);
		lensLocations[3] = Vector3(6.03,-1.561,transform.position.z-1);
	}
	else
	{
		lensLocations = new Vector3[3];
		lensLocations[0] = Vector3(-5.35,-3.45,transform.position.z-1);
		lensLocations[1] = Vector3(0,-5.48,transform.position.z-1);
		lensLocations[2] = Vector3(5.35,-3.45,transform.position.z-1);
	}
	lensLocationsAvailable = new boolean[lensLocations.length];
	optionChoices = new int[lensLocations.length];
	allowableHeader = new SpriteRenderer[3 + difficulty];
	allowableLenses = new SpriteRenderer[3 + difficulty];
	plugLocation = Vector3(0,0.85,transform.position.z-1);
	for(var i:int = 0; i < 3 + difficulty;i++)
	{
		allowableHeader[i] = headers[i];
		allowableLenses[i] = lenses[i];
	}
	numberToBeat = 3;
	
	PickNewColors();
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
}

function PickNewColors () {
	completeness.sprite = completenessSprites[gameProgress];
	for(var i:int = 0; i < lenses.length; i++)
	{
		lensesPlugged[i] = false;
		lenses[i].color.a = 0;
		lenses[i].transform.position.x = 1000;
	}
	for(i = 0; i < headers.length; i++)
	{
		headers[i].color.a = 0;
	}
	lensChoices[0] = Random.Range(0,allowableLenses.Length);
	lensChoices[1] = Random.Range(0,allowableLenses.Length);
	var hangPrevent:int = 0;
	while(lensChoices[1] == lensChoices[0] && hangPrevent < 40)
	{
		lensChoices[1] = Random.Range(0,allowableLenses.Length);
		hangPrevent ++;
	}
	
	for(i = 0; i < lensLocations.length; i++)
	{
		lensLocationsAvailable[i] = true;
	}
	var location1:int = Random.Range(0,lensLocations.length);
	var location2:int = Random.Range(0,lensLocations.length);
	var location3:int = -1;
	hangPrevent = 0;
	while(location2 == location1 && hangPrevent < 40)
	{
		location2 = Random.Range(0,lensLocations.Length);
		hangPrevent ++;
	}
	optionChoices[location1] = lensChoices[0];
	lensLocationsAvailable[location1] = false;
	optionChoices[location2] = lensChoices[1];
	lensLocationsAvailable[location2] = false;
	
	for(i = 0; i < optionChoices.length; i++)
	{
		if(lensLocationsAvailable[i])
		{
			for(var y:int = 0; y < allowableLenses.length; y++)
			{
				var doesContain:boolean = false;
				for(var p:int = 0; p < optionChoices.length; p++)
				{
					if(optionChoices[p] == y)
					{
						doesContain = true;
					}
				}
				//if(y != optionChoices[location1] && y != optionChoices[location2]) 
				if(!doesContain)
				{
					optionChoices[i] = y;
					lensLocationsAvailable[i] = false;
				}
			}
		}
	}
	
	
	// This stuff is fucked.
	for(i = 0; i < allowableLenses.length;i++)
	{
		for(y = 0; y < lensLocations.length; y++)
		{
			if(optionChoices[y] == i)
			{
				allowableLenses[i].color.a = 1;
				allowableLenses[i].transform.position = lensLocations[y];
			}
		}
	}
	for(i = 0; i < allowableHeader.length;i++)
	{
		if(i == lensChoices[0] || i == lensChoices[1])
		{
			allowableHeader[i].color.a = 1;
		}
		else
		{
			allowableHeader[i].color.a = 0;
		}
	}
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
		for(var i:int = 0; i < allowableLenses.length; i++)
		{
			if(Vector3.Distance(allowableLenses[i].transform.position,plugLocation) < 2)
			{
				lensesPlugged[i] = true;
				allowableLenses[i].transform.position = Vector3.MoveTowards(allowableLenses[i].transform.position,plugLocation,Time.deltaTime*5);
			}
			else
			{
				lensesPlugged[i] = false;
			}
		}
		for(i = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i))
			{
				importantLens = 0;
				importantFinger = i;
				for(var y:int = 0; y < allowableLenses.length; y++)
				{
					if(Vector3.Distance(allowableLenses[y].transform.position,Finger.GetPosition(i)) < Vector3.Distance(allowableLenses[importantLens].transform.position,Finger.GetPosition(i)))
					{
						importantLens = y;
					}
				}
			}
		}
	}
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		if(Vector3.Distance(allowableLenses[importantLens].transform.position,Finger.GetPosition(importantFinger)) < 10)
		{
			lensesPlugged[importantLens] = false;
			allowableLenses[importantLens].transform.position.x = Finger.GetPosition(importantFinger).x - 1;
			allowableLenses[importantLens].transform.position.y = Finger.GetPosition(importantFinger).y + 1;
		}
		else
		{
			importantFinger = -1;	
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	
	var successNumber:int = 0;
	for(i = 0; i < allowableLenses.length; i++)
	{
		if(lensesPlugged[i])
		{
			
			if(i == lensChoices[0] || i == lensChoices[1])
			{
				successNumber ++;
			}
			else
			{
				Reload(.3);
				successNumber --;
			}
		}
	}
	if(successNumber < 0)
	{
		successNumber = 0;
	}
	if(reloading)
	{
		arrows.sprite = arrowSprites[arrowSprites.Length-1];
	}
	else
	{
		arrows.sprite = arrowSprites[successNumber];
	}
	if(successNumber == 2 && !reloading)
	{
		reloading = true;
		Reload(.3);
		gameProgress ++;
		if(gameProgress >= numberToBeat)
		{
			Reload(2);
		}
		else
		{
			Reload(.3);
		}
	}
	if(gameProgress >= numberToBeat)
	{
		Finish(true,1);
	}
	for(var x:int = 0; x < successLightThings.length; x++)
	{
		if(x < gameProgress)
		{
			successLightThings[x].color.a = .27;
		}
	}
}

function Play () {
}

function Reload (counter:float) {
	AudioManager.PlaySound(shuffle,.7);
	while(counter > 0)
	{
		PickNewColors();
		counter -= Time.deltaTime;
		yield;
	}
	reloading = false;
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