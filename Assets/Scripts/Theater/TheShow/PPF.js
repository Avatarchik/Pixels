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

/*
@HideInInspector var numberOfLettersSent:int;
@HideInInspector var totalBad:float;
@HideInInspector var totalGood:float;
@HideInInspector var score:float;
*/

var numberOfLettersSent:int;
var totalBad:float;
var totalGood:float;
var score:float;

function Start () {
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
}

function UpdatePixels () {
	goalTotal = 0;
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
	yield WaitForSeconds(.4);
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
			if(numberGoodFilled/goalTotal > .8)
			{
				numberOfLettersSent ++;
				totalBad += numberBadFilled;
				totalGood += (numberGoodFilled/goalTotal);
				score += Mathf.Max(25,(100 - numberBadFilled));
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
				active[i] = true;
				pixels[i].color = drawnColor;
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
}
