	#pragma strict

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var platformPrefab:GameObject;
var objectPrefab:GameObject[];

var oreSprite:Sprite[];

@HideInInspector var stamperUp:int;
@HideInInspector var stamperDown:int;

var shards:GameObject;
var peanuts:GameObject;

var stamper:GameObject;
@HideInInspector var platforms:GameObject[];
@HideInInspector var object:GameObject[];
@HideInInspector var objectValues:int[];
@HideInInspector var currentPlatform:int;

@HideInInspector var oreCount:int;
@HideInInspector var skipTimer:float;

@HideInInspector var moving:boolean;

@HideInInspector var goal:int;

@HideInInspector var clicked:boolean;
@HideInInspector var importantFinger:int;

@HideInInspector var itemTime:float;

var tutorialNotification:GameObject;

function Start () {
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
	currentPlatform = 0;
	platforms = new GameObject[2 + (difficulty * 2)];
	object = new GameObject[platforms.Length];
	objectValues = new int[platforms.Length];
	var addedTime:float = 0;
	for(var i:int = 0; i < platforms.Length; i++)
	{
		var newValue:int = Random.Range(0,difficulty);
		var randomCount:int = 0;
		if(i > 1)
		{
			while(newValue == objectValues[i-1]  && newValue == objectValues[i-2] && randomCount < 15)
			{
				newValue = Random.Range(0,difficulty);
				randomCount++;
			}
		}
		if(newValue == 1)
		{
			addedTime += .4;
		}
		platforms[i] = Instantiate(platformPrefab, transform.position - Vector3(10 + ((i * 12) + speed * 2),3.4,2), Quaternion.identity);
		object[i] = Instantiate(objectPrefab[newValue], transform.position - Vector3(10 + ((i * 12) + speed * 2),.4,1.8), Quaternion.identity);
		object[i].transform.parent = platforms[i].transform;
		objectValues[i] = newValue;
	}
	
	stamperUp = 5.25;
	stamperDown = 1.2;
	moving = false;
	oreCount = 0;
	skipTimer = 0;
	goal = platforms.Length;
	itemTime = 1.35;
	for(var x:int = 0; x < speed; x++)
	{
		itemTime = Mathf.MoveTowards(itemTime,.2,.2);
	}	
	length = itemTime * (object.Length + 1) + addedTime;
	for(i = 0; i < platforms.Length; i++)
	{
		if(objectValues[i] == 2)
		{	
			object[i].GetComponent(SpriteRenderer).sprite = oreSprite[oreCount];
			length += 1.5;
		}
	}
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	timer = length;
}

function Update () {
	// Get important finger.
	if(importantFinger == -1)
	{
		clicked = false;
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
	if(Finger.GetExists(importantFinger) && Finger.GetInGame(importantFinger) && !Master.paused && !clicked)
	{
		Clicked();
		clicked = true;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	
	if(Input.GetKeyDown("space"))
	{
		Clicked();
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		finished = true;
		Finish(false);
	}
	if(currentPlatform == platforms.Length)
	{
		if(!finished)
		{
			finished = true;
			Finish(true);
		}
	}
	else
	{
		for(var thing:GameObject in platforms)
		{
			thing.transform.parent = transform;
			thing.transform.parent = platforms[currentPlatform].transform;
		}
	}
	if(currentPlatform < objectValues.Length && objectValues[currentPlatform] == 1)
	{
		skipTimer += Time.deltaTime;
	}
	if(skipTimer > itemTime + .4)
	{
		Stamp(false);
	}
	if(!finished && currentPlatform < platforms.Length)
	{
		platforms[currentPlatform].transform.position.x = Mathf.MoveTowards(platforms[currentPlatform].transform.position.x, 0, Time.deltaTime * (speed * 5 + 17));
	}
	else if(!finished)
	{
		if(currentPlatform > 0)
		{
			platforms[currentPlatform - 1].transform.position.x = Mathf.MoveTowards(platforms[currentPlatform-1].transform.position.x, 10, Time.deltaTime * (speed * 5 + 17));
		}
		else
		{
			platforms[currentPlatform].transform.position.x = Mathf.MoveTowards(platforms[currentPlatform].transform.position.x, 10, Time.deltaTime * (speed * 5 + 17));
		}
	}
}

function Clicked () {
	for(var i:int = 0; i < platforms.length; i++)
	{
		if(Mathf.Abs(platforms[i].transform.position.x) < .3 && !finished && objectValues[i] == 1)
		{
			finished = true;
			Finish(false);
		}
	}
	moving = true;
	while(stamper.transform.position.y > stamperDown && moving)
	{
		stamper.transform.position.y = Mathf.MoveTowards(stamper.transform.position.y,stamperDown,Time.deltaTime * (speed * 5 + 25));
		yield;
	}
	Stamp(true);
	moving = false;
	while(stamper.transform.position.y < stamperUp && !moving && !finished)
	{
		stamper.transform.position.y = Mathf.MoveTowards(stamper.transform.position.y,stamperUp,Time.deltaTime * (speed * 5 + 25));
		yield;
	}
}

function Stamp(skip:boolean) {
	if(currentPlatform < platforms.Length)
	{
		if(platforms[currentPlatform].transform.position.x > -2)
		{
			switch(objectValues[currentPlatform])
			{
				case 0:
					peanuts.GetComponent.<ParticleSystem>().Emit(10);
					if(currentPlatform != platforms.Length)
					{
						object[currentPlatform].GetComponent(SpriteRenderer).sprite = oreSprite[3];
						currentPlatform ++;
					}
					break;
				case 1:	
					if(skip)
					{
						shards.GetComponent.<ParticleSystem>().Emit(10);
						if(!finished)
						{
							finished = true;
							Finish(false);
						}
					}
					else
					{
						skipTimer = 0;
						currentPlatform ++;
					}
					break;
				case 2:
					peanuts.GetComponent.<ParticleSystem>().Emit(5);
					if(oreCount < 2)
					{
						object[currentPlatform].GetComponent(SpriteRenderer).sprite = oreSprite[oreCount+1];
						oreCount ++;
					}
					else
					{
						object[currentPlatform].GetComponent(SpriteRenderer).sprite = oreSprite[3];
						currentPlatform++;
						oreCount = 0;
					}
					break;
				default:
					break;
			}
		}
	}
}

function Finish(completionStatus:boolean) {
	if(completionStatus)
	{
		PlayerPrefs.SetInt("TutorialFor:" + transform.name,1);
	}
	else
	{
		SendTutorial();
	}
	if(Application.loadedLevelName == "MicroTester")
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(completionStatus);
	}
	else 
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).GameComplete(completionStatus);
	}
	finished = true;
}

function SendTutorial () {
	if(PlayerPrefs.HasKey("TutorialFor:" + transform.name))
	{
		PlayerPrefs.SetInt("TutorialFor:" + transform.name,PlayerPrefs.GetInt("TutorialFor:" + transform.name) + 1);
	}
	else
	{
		PlayerPrefs.SetInt("TutorialFor:" + transform.name,1);
	}
	if((PlayerPrefs.GetInt("TutorialFor:" + transform.name) > 1) && Application.loadedLevelName == "MicroGameLauncher" && PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"BeatEndPlayed") == 0 && !Master.hardMode)
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).TurnOnNotification(tutorialNotification);
	}
}