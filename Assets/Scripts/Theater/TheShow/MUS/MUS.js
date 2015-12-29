#pragma strict

var hitTimes:float[];

var lightSprites:Sprite[];
var lightColors:Color[];

var stageLights:SpriteRenderer;
var stageLightGlow:SpriteRenderer;

var smokeMachine:ParticleSystem;

var flyOvers:GameObject[];

var hitButtonPrefab:GameObject;

var deskContentsHolder:GameObject;

var feedback:GameObject[];

@HideInInspector var score:float;

@HideInInspector var topFeedbackLocation:Vector3;
@HideInInspector var bottomFeedbackLocation:Vector3;

@HideInInspector var hitButtons:GameObject[];
@HideInInspector var hitButtonScores:float[];
@HideInInspector var hitButtonBeatNumbers:int[];
@HideInInspector var hitButtonTop:boolean[];

@HideInInspector var startLocationY:float[];
@HideInInspector var leftSide:float;
@HideInInspector var rightSide:float;
@HideInInspector var showLocationZ:float;
@HideInInspector var hideLocationZ:float;

@HideInInspector var noteSpeed:float;

@HideInInspector var lastLightNumber:float;

@HideInInspector var misses:int;

var hitRange:float;

@HideInInspector var badScore:float;

@HideInInspector var badCounter:float;

@HideInInspector var clicked:boolean[];

var topButton:GameObject;
var bottomButton:GameObject;

var buttonDistance:float;

function Start () {
	misses = 0;
	clicked = [false,false,false,false,false];
	badCounter = 0;
	startLocationY = new float[2];
	startLocationY = [-0.079,-0.291];
	topFeedbackLocation = Vector3(-.455,.1,-.2);
	bottomFeedbackLocation = Vector3(-.455,-.44,-.2);
	leftSide = -.48;
	rightSide = .79;
	showLocationZ = -.01;
	hideLocationZ = 10;
	lastLightNumber = 0;
	badScore = -.45;
	noteSpeed = 1;
	for(var i:int = 0; i < hitTimes.length; i++)
	{
		hitTimes[i] += 0;
	}
	CreateNotes();
	if(hitTimes.Length > 0)
	{
		Gameplay();
	}
}

function Update () {	
	for(var i:int = 0; i < hitButtons.length; i++)
	{
		hitButtons[i].transform.localPosition.x = leftSide + noteSpeed * (hitTimes[hitButtonBeatNumbers[i]] - ShowManager.currentMusicLocation);
		if(hitButtons[i].transform.localPosition.x > leftSide && hitButtons[i].transform.localPosition.x < rightSide)
		{
			hitButtons[i].GetComponent(SpriteRenderer).color.a = 1;
		}
		else
		{
			hitButtons[i].GetComponent(SpriteRenderer).color.a = 0;
		}
	}
	if(Input.GetKeyDown("up"))
	{
		TopRowHit();
	}
	if(Input.GetKeyDown("down"))
	{
		BottomRowHit();
	}
	/*
		if(Input.GetKeyDown("a"))
		{
			hitTimes = AddNumber(hitTimes,ShowManager.currentMusicLocation);
		}
	*/
	for(i = 0; i < Finger.identity.length; i++)
	{
		if(Finger.GetExists(i) && Finger.GetInGame(i) && !clicked[i])
		{
			clicked[i] = true;
			if(Vector2.Distance(Finger.GetPosition(i),topButton.transform.position) < Vector2.Distance(Finger.GetPosition(i),bottomButton.transform.position))
			{
				if(Vector2.Distance(Finger.GetPosition(i),topButton.transform.position) < buttonDistance)
				{
					TopRowHit();
				}
			}
			else
			{
				if(Vector2.Distance(Finger.GetPosition(i),topButton.transform.position) < buttonDistance)
				{
					BottomRowHit();
				}
			}
			break;
		}
		else if(!Finger.GetExists(i) || !Finger.GetInGame(i))
		{
			clicked[i] = false;
		}
	}
}

function CreateNotes () {
	for(var i:int = 3; i < hitTimes.length; i ++)
	{
		if(Random.value < .6)
		{
			hitButtons = AddObject(hitButtons, Instantiate(hitButtonPrefab));
			hitButtonBeatNumbers = AddNumber(hitButtonBeatNumbers,i);
			hitButtonTop = AddBoolean(hitButtonTop,true);
		}
		else if(Random.value < .9)
		{
			hitButtons = AddObject(hitButtons, Instantiate(hitButtonPrefab));
			hitButtonBeatNumbers = AddNumber(hitButtonBeatNumbers,i);
			hitButtonTop = AddBoolean(hitButtonTop,false);
		}
	}
	hitButtonScores = new float[hitButtons.length];
	for(i = 0; i < hitButtons.length; i++)
	{
		hitButtonScores[i] = 0;
		hitButtons[i].transform.parent = deskContentsHolder.transform;
		hitButtons[i].transform.localPosition.z = showLocationZ;
		if(hitButtonTop[i])
		{
			hitButtons[i].transform.localPosition.y = startLocationY[0];
			hitButtons[i].GetComponent(SpriteRenderer).color = Color.red;
		}
		else
		{
			hitButtons[i].transform.localPosition.y = startLocationY[1];
			hitButtons[i].GetComponent(SpriteRenderer).color = Color.blue;
		}
		hitButtons[i].transform.localScale = Vector3(1,1,1);
	}
}
function Gameplay () {
	while(ShowManager.currentMusicLocation < hitTimes[0])
	{
		yield;
	}
	ShowManager.good = true;
	if(Master.allowShow)
	{
		smokeMachine.emissionRate = 40;
	}
	smokeMachine.startSpeed = 9;
	while(ShowManager.currentMusicLocation < hitTimes[hitTimes.length-1])
	{
		for(var i:int = 0; i < hitButtons.length; i++)
		{
			if(hitButtons[i].transform.localPosition.x < leftSide - hitRange && hitButtonScores[i] == 0)
			{
				hitButtonScores[i] = badScore;
				stageLights.color.a = 0;
				stageLightGlow.color.a = 0;
				Feedback(hitButtonTop[i],3);
			}
		}
		if(misses > 1)
		{
			ShowManager.good = false;
		}
		else
		{	
			ShowManager.good = true;
		}
		yield;
	}
	var goodHits:int = 0;
	for(i = 0; i < hitButtonScores.length; i++)
	{
		if(hitButtonScores[i] > 0)
		{
			goodHits ++ ;
			score += hitButtonScores[i];
		}
		
	}
	score = (score/hitButtons.Length) * 100;
	score = Mathf.Max(0,score - (badCounter * badScore));
	GameObject.FindGameObjectWithTag("ShowManager").GetComponent(ShowManager).scores[1] = score;
	if(Master.allowShow)
	{
		smokeMachine.emissionRate = 10;
	}
	smokeMachine.startSpeed = 3;
	while(stageLights.color.a != 0 || stageLightGlow.color.a != 0)
	{
		stageLights.color.a = Mathf.MoveTowards(stageLights.color.a,0,Time.deltaTime * .5);
		stageLightGlow.color.a = Mathf.MoveTowards(stageLightGlow.color.a,0,Time.deltaTime * .5);
		yield;
	}
}

function TopRowHit () {
	var closest:int = -1;
	var closestDistance:float = 100;
	for(var i:int = 0; i < hitButtons.length; i++)
	{
		if(Mathf.Abs(leftSide - hitButtons[i].transform.localPosition.x) < closestDistance && hitButtonScores[i] == 0 && hitButtonTop[i])
		{
			closest = i;
			closestDistance = Mathf.Abs(leftSide - hitButtons[i].transform.localPosition.x);
		}
	}
	if(closestDistance < hitRange && closest != -1)
	{
		hitButtonScores[closest] = (1 - closestDistance/hitRange)/2 + .5;
		if(hitButtonScores[closest] > .93)
		{
			hitButtonScores[closest] = 1;
			Feedback(true,0);
			if(Master.allowShow)
			{
				stageLights.color.a = 1;
				stageLightGlow.color.a = 1;
			}
			LightChange();
		}
		else if(hitButtonScores[closest] > .85)
		{
			hitButtonScores[closest] = .85;
			Feedback(true,1);
			if(Master.allowShow)
			{
				stageLights.color.a = 1;
				stageLightGlow.color.a = 1;
			}
			LightChange();
		}
		else
		{
			hitButtonScores[closest] = .7;
			Feedback(true,2);
			if(Master.allowShow)
			{
				stageLights.color.a = .4;
				stageLightGlow.color.a = .4;
			}
			LightChange();
		}
	}
	else
	{
		badCounter ++;
		stageLights.color.a = 0;
		stageLightGlow.color.a = 0;
		Feedback(true,3);
	}
}

function BottomRowHit () {
	var closest:int = -1;
	var closestDistance:float = 100;
	for(var i:int = 0; i < hitButtons.length; i++)
	{
		if(Mathf.Abs(leftSide - hitButtons[i].transform.localPosition.x) < closestDistance && hitButtonScores[i] == 0 && !hitButtonTop[i])
		{
			closest = i;
			closestDistance = Mathf.Abs(leftSide - hitButtons[i].transform.localPosition.x);
		}
	}
	if(closestDistance < hitRange && closest != -1)
	{
		hitButtonScores[closest] = (1 - closestDistance/hitRange)/2 + .5;
		if(hitButtonScores[closest] > .85)
		{
			Feedback(false,0);
			FlyOver();
		}
		else if(hitButtonScores[closest] > .7)
		{
			Feedback(false,1);
			FlyOver();
		}
		else
		{
			Feedback(false,2);
			FlyOver();
		}
	}
	else
	{
		badCounter ++;
		Feedback(false,3);
	}
}
	
function Feedback (top:boolean,which:int) {
	var latestFeedback:GameObject = Instantiate(feedback[which]);
	if(which == 3)
	{
		misses ++;
	}
	else
	{
		misses = Mathf.Max(misses-1,0);
	}	
	latestFeedback.transform.parent = deskContentsHolder.transform;
	if(top)
	{
		latestFeedback.transform.localPosition = topFeedbackLocation;
	}
	else
	{
		latestFeedback.transform.localPosition = bottomFeedbackLocation;
	}
	latestFeedback.transform.localPosition.x += Random.Range(-.02,.02);
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

function AddBoolean (original:boolean[],addition:boolean):boolean[] {
	var finalArray:boolean[] = new boolean[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function AddObject (original:GameObject[],addition:GameObject):GameObject[] {
	var finalArray:GameObject[] = new GameObject[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function LightChange () {
	if(Master.allowShow)
	{
		var randomizer:int = 0;
		var newNumber:int = Random.Range(0,lightSprites.length);
		while(newNumber == lastLightNumber && randomizer < 30)
		{
			newNumber = Random.Range(0,lightSprites.length);
			randomizer ++;
		}
		lastLightNumber = newNumber;
		stageLights.sprite = lightSprites[newNumber];
		stageLightGlow.color = lightColors[newNumber];
	}
}

function FlyOver () {
	Instantiate(flyOvers[Random.Range(0,flyOvers.length)]);
}