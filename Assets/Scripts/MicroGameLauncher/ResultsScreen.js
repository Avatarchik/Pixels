#pragma strict

@HideInInspector var score:int;
@HideInInspector var smallFont:int;
@HideInInspector var largeFont:int;
@HideInInspector var skip:boolean;
@HideInInspector var currentDisplayedScore:int;
@HideInInspector var numberOfUnlocks:int;
@HideInInspector var unlockLevels:int[];
@HideInInspector var waitTime:float;
@HideInInspector var skipWaitTime:float;
@HideInInspector var showTime:float;
var announcement:GameObject;
@HideInInspector var currentAnnouncement:GameObject;
var particles:ParticleSystem[];

var text:TextMesh[];
static var notifying:boolean;

var finished:boolean;

function Start () {
	score = Master.lastScore;
	currentDisplayedScore = 0;
	smallFont = 400;
	largeFont = 606;
	notifying = false;
	skip = false;
	numberOfUnlocks = PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Unlocks");
	unlockLevels = Master.unlockLevels;
	waitTime = .4;
	skipWaitTime = .02;
	for(var thisText:TextMesh in text)
	{
		thisText.text = currentDisplayedScore.ToString();
		thisText.fontSize = smallFont;
	}
	CountScore();
}

function Update () {
	if(finished)
	{
		if(transform.position.y != 20)
		{
			transform.position.y = Mathf.MoveTowards(transform.position.y,20,Time.deltaTime*40);
		}
		else
		{
			Destroy(gameObject);
		}
	}
}

function CountScore() {
	yield WaitForSeconds(1);
	while(currentDisplayedScore < score)
	{
		if(waitTime != 0)
		{
			yield WaitForSeconds(waitTime);
		}
		currentDisplayedScore ++;
		PlayerPrefs.SetInt("CurrencyNumber",PlayerPrefs.GetInt("CurrencyNumber")+1);
		for(var thisText:TextMesh in text)
		{
			thisText.fontSize = smallFont;
			thisText.text = currentDisplayedScore.ToString();
		}
		if(waitTime > skipWaitTime)
		{
			if(currentDisplayedScore + 5 < score)
			{
				waitTime = Mathf.MoveTowards(waitTime,.05,.03);
			}
			else
			{
				waitTime = Mathf.MoveTowards(waitTime,.15,.03);
			}
		}
		for(var i:int = 0; i < unlockLevels.length; i++)
		{
			if(currentDisplayedScore == unlockLevels[i] && PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Unlocks") < i)
			{
				PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"Unlocks",i);
				for(var thisParticle:ParticleSystem in particles)
				{
					thisParticle.Emit(300);
				}
				for(var thisText:TextMesh in text)
				{
					thisText.fontSize = largeFont;
				}
				if(waitTime > skipWaitTime)
				{
					waitTime = .15;
				}
				yield(WaitForSeconds(1));
			}
		}
		if(currentDisplayedScore == score)
		{
			break;
		}
	}
	if(score > 15)
	{
		for(var thisParticle:ParticleSystem in particles)
		{
			Debug.Log("hey");
			thisParticle.Emit(500);
		}
	}
	while(!finished)
	{
		yield;
	}
	while(transform.position.y != 20)
	{
		transform.position.y = Mathf.MoveTowards(transform.position.y,20,Time.deltaTime*40);
		yield;
	}
	Destroy(gameObject);
}

function Clicked() {
	if(currentDisplayedScore == score)
	{
		
		finished = true;
	}
	else
	{
		if(waitTime == skipWaitTime)
		{
			waitTime = 0;
		}
		else
		{
			waitTime = skipWaitTime;
		}
	}
}