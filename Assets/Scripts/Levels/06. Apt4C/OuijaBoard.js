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

var dict:Dictionary;
var displays:TextMesh[];

var marker:GameObject;
var markerHolder:GameObject;

var glow:GameObject;

@HideInInspector var allowableDistance = 1.5;

@HideInInspector var currentWord:Word;
@HideInInspector var currentLetter:int;
@HideInInspector var wordDisplay:TextMesh;
@HideInInspector var shakeAmount:float;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = false;
	
	// Level specific variable initialization.
	currentLetter = 0;
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
	if(difficulty == 1)
	{
		currentWord = dict.difficulty1Words[Random.Range(0,dict.difficulty1Words.length)];
	}
	else if(difficulty == 2)
	{
		currentWord = dict.difficulty2Words[Random.Range(0,dict.difficulty2Words.length)];
	}
	else
	{
		currentWord = dict.difficulty3Words[Random.Range(0,dict.difficulty3Words.length)];
	}
	length = currentWord.word.Length * (3.5 - (.1 * speed));
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	
	wordDisplay = displays[currentWord.word.Length-1];
	
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
		if(Vector2.Distance(Finger.GetPosition(importantFinger),markerHolder.transform.position) < 2.5 && Finger.GetInGame(importantFinger))
		{
			markerHolder.transform.position.x = Finger.GetPosition(importantFinger).x;
			markerHolder.transform.position.y = Finger.GetPosition(importantFinger).y + 1;
		}
		if(!clicked)
		{
			clicked = true;
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		clicked = false;
		importantFinger = -1;
	}
	
	glow.transform.position = currentWord.letters[currentLetter].location - Vector3(0,0,.01);
	
	glow.GetComponent(SpriteRenderer).color.a = 1 - (Vector2.Distance(markerHolder.transform.position,currentWord.letters[currentLetter].location) * .25);
	shakeAmount = Mathf.Max(0,2.3 - (Vector2.Distance(markerHolder.transform.position,currentWord.letters[currentLetter].location)));
}

function Play () {
	var waitTime:float = .5;
	while(wordDisplay.text.Length < currentWord.word.Length)
	{
		if(Vector2.Distance(markerHolder.transform.position,currentWord.letters[currentLetter].location) < allowableDistance)
		{
			waitTime -= Time.deltaTime;
		}
		if(waitTime < 0)
		{
			waitTime = .5;
			wordDisplay.text = wordDisplay.text + currentWord.letters[currentLetter].letter;
			currentLetter ++;
		}
		yield;
	}
	Finish(true,.4);
}

function Shake () {
	var origin:Vector3 = marker.transform.localPosition;
	while(true)
	{
		var difference:float = shakeAmount * .01;
		marker.transform.localPosition = Vector3(Random.Range(origin.x-difference,origin.x+difference),Random.Range(origin.y-difference,origin.y+difference),origin.z);
		yield WaitForSeconds(.01);
	}
	transform.position = origin;
}

class Dictionary {
	var difficulty1Words:Word[];
	var difficulty2Words:Word[];
	var difficulty3Words:Word[];
}

class Word {
	var word:String;
	var letters:Letter[];
}

class Letter {
	var letter:String;
	var location:Vector3;
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