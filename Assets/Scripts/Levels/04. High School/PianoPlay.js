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
@HideInInspector var keysAllowed:float;

var keys:GameObject[];
var lights:GameObject[];

var keyUpSprites:Sprite[];
var keyDownSprites:Sprite[];

var page1Sprites:Sprite[];
var page2Sprites:Sprite[];
var page3Sprites:Sprite[];

var page1:SpriteRenderer;
var page2:SpriteRenderer;
var page3:SpriteRenderer;

var keyNotes:AudioClip[];

var correctKeyTimer:float;

@HideInInspector var notes:Array;

@HideInInspector var desiredKey:int[];
@HideInInspector var pressedKeys:int[];

@HideInInspector var leftKeys:int[];
@HideInInspector var rightKeys:int[];

@HideInInspector var gameProgress:int;

@HideInInspector var clicked:boolean[];

function Start () {
	if(Random.Range(0,10.0) < 2.5)
	{
		AudioManager.PlaySound(worldIntros[Random.Range(0,worldIntros.length)]);
	}
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	pressedKeys = new int[5];
	pressedKeys = [-1,-1,-1,-1,-1];
	gameProgress = 0;
	leftKeys = new int[5];
	rightKeys = new int[4];
	leftKeys = [0,1,6,7,8];
	rightKeys = [4,5,9,10];
	notes = new Array[5];
	correctKeyTimer = .5;
	clicked = new boolean[5];
	clicked = [false,false,false,false,false];
	
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
	var noteLength:float;
	noteLength = 2;
	for(var x:int = 0; x < speed; x++)
	{
		noteLength = Mathf.MoveTowards(noteLength,1,.3);
	}
	length = noteLength  * 5;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	if(difficulty == 1)
	{
		keysAllowed = 6;
	}
	else
	{
		keysAllowed = 11;
	}
	if(difficulty > 2)
	{
		desiredKey = new int[2];
		desiredKey = [3,5];
	}
	else
	{
		desiredKey = new int[1];
		desiredKey = [3];
	}
	
	for(var each:int = 0; each < notes.length; each++)
	{
		notes[each] = PickNewKeys();
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
	correctKeyTimer -= Time.deltaTime;
	if(gameProgress < notes.length)
	{
		page1.sprite = page1Sprites[gameProgress];
		page2.sprite = page2Sprites[gameProgress];
		page3.sprite = page3Sprites[gameProgress];
		desiredKey = notes[gameProgress];
	}
	else
	{
		page1.sprite = page1Sprites[notes.length];
		page2.sprite = page2Sprites[notes.length];
		page3.sprite = page3Sprites[notes.length];
	}
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
			if(Finger.GetExists(i))
			{
				importantFinger = i;
			}
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
	
	for(var finger:int = 0; finger < pressedKeys.length; finger++)
	{
		if(Finger.GetExists(finger) && !clicked[finger])
		{
			clicked[finger] = true;
			var nearestKey:int = -1;
			for(var currentKey:int = 0; currentKey < keysAllowed; currentKey ++)
			{
				var distanceToKey:float;
				distanceToKey = Vector2.Distance(Finger.GetPosition(finger),keys[currentKey].transform.position);
				var oneOfGoals:boolean = false;
				for(var y:int = 0; y < desiredKey.length; y++)
				{
					if(currentKey == desiredKey[y])
					{
						oneOfGoals = true;
					}
				}
				if(oneOfGoals)
				{
					distanceToKey = Mathf.MoveTowards(distanceToKey,0,1.6);
				}
				if(Finger.GetInGame(finger) && (nearestKey == -1 || distanceToKey < Vector2.Distance(Finger.GetPosition(finger),keys[nearestKey].transform.position)))
				{
					nearestKey = currentKey;
				}
			}
			pressedKeys[finger] = nearestKey;	
		}
		else
		{
			if(!Finger.GetExists(finger))
			{
				clicked[finger] = false;
				pressedKeys[finger] = -1;
			}
		}
		//if(!Finger.GetExists(finger))
	}
	
	var correctKeysPressed:int = 0;
	for(var key:int = 0; key < keys.length; key++)
	{
		var contains:boolean = false;
		for(var x:int=0; x < pressedKeys.length; x++)
		{
			if(pressedKeys[x] == key)
			{
				contains = true;
			}
		}
		if(contains && gameProgress < notes.length)
		{
			if(keys[key].GetComponent(SpriteRenderer).sprite != keyDownSprites[key])
			{
				AudioManager.PlaySound(keyNotes[key],.3);
				keys[key].GetComponent(SpriteRenderer).sprite = keyDownSprites[key];
			}
			var isGood:boolean = false;
			for(var goal:int = 0; goal < desiredKey.length; goal++)
			{
				if(key == desiredKey[goal])
				{
					isGood = true;
				}
			}
			if(isGood)
			{
				correctKeysPressed ++;
				lights[key].GetComponent(SpriteRenderer).color = Color.green;
				keys[key].GetComponent(SpriteRenderer).color = Color.green;
			}
			else if(correctKeyTimer < 0)
			{
				correctKeysPressed --;
			}
		}
		else
		{
			lights[key].GetComponent(SpriteRenderer).color = Color(.17,.17,.17,1);
			keys[key].GetComponent(SpriteRenderer).sprite = keyUpSprites[key];
			var isGoal:boolean = false;
			for(goal = 0; goal < desiredKey.length; goal++)
			{
				if(key == desiredKey[goal])
				{
					isGoal = true;
				}
			}
			if(isGoal)
			{
				lights[key].GetComponent(SpriteRenderer).color = Color.red;
				keys[key].GetComponent(SpriteRenderer).color = Color(1,.6,.6,1);
			}
			else
			{
				keys[key].GetComponent(SpriteRenderer).color = Color.white;
			}
		}
	}
	if(correctKeysPressed == desiredKey.length)
	{
		correctKeyTimer = .5;
		gameProgress ++;
		if(gameProgress < 5)
		{
			PickNewKeys();
		}
		else
		{
			Finish(true,0);
		}
	}
	else if( correctKeysPressed < 0)
	{
		gameProgress = 0;
	}
}

function Play () {

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

function PickNewKeys () {
	var arrayOfNotes:int[];
	if(difficulty == 3)
	{
		arrayOfNotes = new int[2];
		arrayOfNotes[0] = leftKeys[Random.Range(0, leftKeys.length)];
		arrayOfNotes[1] = rightKeys[Random.Range(0, rightKeys.length)];
	}
	else
	{
		arrayOfNotes = new int[1];
		arrayOfNotes[0] = Random.Range(0, keysAllowed);
	}
	return arrayOfNotes;
}