#pragma strict

var pixels:SpriteRenderer[];
var goal:boolean[];
@HideInInspector var active:boolean[];
var detectDistance:float;

var goalColor:Color;
var drawnColor:Color;

var letter:SpriteRenderer;
@HideInInspector var letterOrigin:Vector3;

@HideInInspector var counter:float;
@HideInInspector var goalTotal:float;
@HideInInspector var badCorrect:int;

@HideInInspector var started:boolean;
@HideInInspector var importantFinger:int;

@HideInInspector var numberOfLettersSent:int;
@HideInInspector var totalBad:float;
@HideInInspector var totalGood:float;
@HideInInspector var score:float;

var record:boolean;
var goal0:boolean[];
var goal1:boolean[];
var goal2:boolean[];
var goal3:boolean[];
var goal4:boolean[];
var goal5:boolean[];
var goal6:boolean[];
var goal7:boolean[];
var goal8:boolean[];
var goal9:boolean[];

var tempSave:boolean[];

@HideInInspector var letterMovement:boolean;

var CEOs:SpriteRenderer[];
var mouths:SpriteRenderer[];
var mouthClosed:Sprite;
var mouthOpen:Sprite;

var times:float[];
var timeNumber:int[];

var normalCEO:Sprite;
var eyesCEO:Sprite;

var letterSound:AudioClip;

function Start () {
	letterMovement = false;
	numberOfLettersSent = 0;
	totalBad = 0;
	totalGood = 0;
	score = 0;
		
	started = false;
	letterOrigin = letter.transform.localPosition;
	letter.color.a = 0;
	badCorrect = 20;
	counter = 0;
	started = false;
	active = new boolean[goal.Length];
	UpdatePixels();
	Talk();
}

function UpdatePixels () {
	goalTotal = 0;
	PickGoal();
	if(started)
	{
		LetterMove();
	}
	else
	{
		started = true;
	}
	for(var i:int = 0; i < goal.length; i++)
	{
		active[i] = false;
		if(goal[i])
		{
			goalTotal ++;
			pixels[i].color = goalColor;
		}
		else
		{
			pixels[i].color.a = 0;
		}
	}
}

function LetterMove () {
	letter.color.a = 1;
	letterMovement = true;
	yield WaitForSeconds(.6);
	Throw();
	yield WaitForSeconds(.4);
	letterMovement = false;
	
}

function Talk () {
	for(var i:int = 0; i < times.length; i++)
	{
		while(ShowManager.currentMusicLocation < times[i])
		{
			yield;
		}
		if(timeNumber[i] == 0)
		{
			mouths[0].sprite = mouthClosed;
			mouths[1].sprite = mouthClosed;
		}
		else
		{
			mouths[0].sprite = mouthOpen;
			mouths[1].sprite = mouthOpen;
		}
		if(i == 17 || i == 39 || i == 152)
		{
			CEOs[0].sprite = eyesCEO;
			CEOs[1].sprite = eyesCEO;
		}
		if(i == 22 || i == 47 || i == 157)
		{
			CEOs[0].sprite = normalCEO;
			CEOs[1].sprite = normalCEO;
		}
	}
}

function Throw () {
	AudioManager.PlaySound(letterSound);
	while(letter.transform.localPosition.x != 25)
	{
		letter.transform.localPosition.x = Mathf.MoveTowards(letter.transform.localPosition.x,25, Time.deltaTime*15);
		yield;
	}
	letter.color.a = 0;
	letter.transform.localPosition = letterOrigin;
}

function Update () {
	if(importantFinger == -1)
	{
		counter += Time.deltaTime;
		if(counter > .3)
		{
			var numberGoodFilled:float = 0;
			var numberBadFilled:float = 0;
			for(var i:int = 0; i < pixels.length; i++)
			{
				if(active[i])
				{
					if(goal[i])
					{
						numberGoodFilled ++;
					}
					else
					{
						numberBadFilled ++;
					}
				}
			}
			numberBadFilled = Mathf.Max(0,numberBadFilled - badCorrect);
			if(numberGoodFilled/goalTotal > .7 && !record)
			{
				numberOfLettersSent ++;
				totalBad += numberBadFilled;
				totalGood += (numberGoodFilled/goalTotal);
				score += Mathf.Max(25,(100 - numberBadFilled));
				if(score > 60)
				{
					ShowManager.good = true;
				}
				else
				{
					ShowManager.good = false;
				}
				GameObject.FindGameObjectWithTag("ShowManager").GetComponent(ShowManager).scores[0] = Mathf.Clamp(score/4,0,100);
				UpdatePixels();
			}
		}
		for(i = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i) && Finger.GetInGame(i))
			{
				importantFinger = i;
				break;
			}
		}
	}
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		counter = 0;
		for(i = 0; i < pixels.length; i++)
		{
			if(Vector2.Distance(Finger.GetPosition(importantFinger),pixels[i].transform.position) < detectDistance)
			{
				if(record)
				{
					goal4[i] = true;
					pixels[i].color = drawnColor;
				}
				else if(!letterMovement)
				{
					active[i] = true;
					pixels[i].color = drawnColor;
				}
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	if(Input.GetKeyDown(KeyCode.Backspace) || Input.GetKeyDown(KeyCode.Delete))
	{
		for(i = 0; i < goal4.length; i++)
		{
			goal4[i] = tempSave[i];
			if(!tempSave[i])
			{
				pixels[i].color.a = 0;
			}
		}
	}
	if(Input.GetKeyDown("a"))
	{
		times = AddNumber(times,ShowManager.currentMusicLocation);
		timeNumber = AddNumber(timeNumber,1);
	}
	if(Input.GetKeyUp("a"))
	{
		times = AddNumber(times,ShowManager.currentMusicLocation);
		timeNumber = AddNumber(timeNumber,0);
	}
}

function PickGoal () {
	var randomNum:float = Random.value;
	if(randomNum < .2)
	{
		goal = goal0;
	}
	else if(randomNum < .4)
	{
		goal = goal1;
	}
	else if(randomNum < .6)
	{
		goal = goal2;
	}
	else if(randomNum < .8)
	{
		goal = goal3;
	}
	else
	{
		goal = goal4;
	}
}	

function AddNumber (original:int[],addition:int):int[] {
	var finalArray:int[] = new int[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function AddNumber (original:float[],addition:float):float[] {
	var finalArray:float[] = new float[original.length+1];
	for(var y:float = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}