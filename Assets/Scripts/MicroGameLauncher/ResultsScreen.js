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
@HideInInspector var currentAnnouncement:GameObject;
var particles:ParticleSystem[];
var text:TextMesh[];
var sign:SpriteRenderer;
var signSprites:Sprite[];
static var notifying:boolean;
var finished:boolean;

var announcement:Announcement;

var goodApplause:AudioClip;
var badApplause:AudioClip;
var unlockApplause:AudioClip[];
var unlockSounds:AudioClip[];
var drum:AudioClip;

function Start () {
	sign.sprite = signSprites[0];
	AnnouncementOff();
	score = Master.lastScore;
	currentDisplayedScore = 0;
	smallFont = 400;
	largeFont = 606;
	notifying = false;
	skip = false;
	numberOfUnlocks = PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Unlocks");
	unlockLevels = Master.unlockLevels;
	if(Master.hardMode)
	{
		unlockLevels = [0,0,0,0,0,0];
	}
	waitTime = .4;
	skipWaitTime = .02;	
	AudioManager.PlaySound(drum,.4);
	if(score >= 15)
	{
		AudioManager.PlaySound(goodApplause,.4);	
	}
	else
	{
		AudioManager.PlaySound(badApplause,.4);	
	}
	for(var thisText:TextMesh in text)
	{
		thisText.text = currentDisplayedScore.ToString();
		thisText.fontSize = smallFont;
	}
	
	CountScore();
}

function Update () {
	for(var thisText:TextMesh in text)
	{
		thisText.text = currentDisplayedScore.ToString();
	}
	announcement.unlock.transform.localScale = Vector3.MoveTowards(announcement.unlock.transform.localScale,Vector3(1,1,1),Time.deltaTime * 2);
	if(sign.transform.localPosition.y != .39)
	{
		sign.transform.localPosition.y = Mathf.MoveTowards(sign.transform.localPosition.y, .39, Time.deltaTime * .3);
	}
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
	var nextGoal:int = 1;
	while(currentDisplayedScore < score)
	{
		if(waitTime != .01)
		{
			yield WaitForSeconds(waitTime);
		}
		currentDisplayedScore ++;
		var currencyValue:int = 1;
		if(Master.hardMode)
		{
			currencyValue *= 2;
		}
		PlayerPrefs.SetInt("CurrencyNumber",PlayerPrefs.GetInt("CurrencyNumber")+currencyValue);
		for(var thisText:TextMesh in text)
		{
			thisText.fontSize = smallFont;
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
			if(currentDisplayedScore == unlockLevels[i])
			{
				nextGoal = i + 1;
			}
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
				if(i < 4)
				{
					switch(i-1)
					{
						case 0:
							for(var variableName:String in Master.currentWorld.unlocks.unlocksLevel1)
							{
								PlayerPrefs.SetInt(variableName,1);
							}
							break;
						case 1:
							for(var variableName:String in Master.currentWorld.unlocks.unlocksLevel2)
							{
								PlayerPrefs.SetInt(variableName,1);
							}
							break;
						case 2:
							for(var variableName:String in Master.currentWorld.unlocks.unlocksLevel3)
							{
								PlayerPrefs.SetInt(variableName,1);
							}
							break;
						default:
							break;
					}
					yield WaitForSeconds(.3);
					AudioManager.PlaySound(unlockSounds[i-1],1);
					AnnouncementStep1(1.2);
					yield WaitForSeconds(2.2);
					AnnouncementStep2();
					yield WaitForSeconds(1.2);
					AudioManager.PlaySound(unlockApplause[i-1],.4);	
					AnnouncementStep3(i-1);
					yield WaitForSeconds(4);
					AnnouncementOff();
				}
			}
		}
		if(currentDisplayedScore == score)
		{
			break;
		}
	}
	if(score >= 15)
	{
		for(var thisParticle:ParticleSystem in particles)
		{
			thisParticle.Emit(500);
		}
	}
	yield WaitForSeconds(1.2);
	sign.sprite = signSprites[nextGoal];
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
			waitTime = 0.01;
		}
		else
		{
			waitTime = skipWaitTime;
		}
	}
}

function AnnouncementOff () {
	announcement.unlockParticle.emissionRate = 0;
	announcement.unlock.sprite = null;
	announcement.chest.sprite = null;
	announcement.cover.color.a = 0;
	announcement.lockImage.sprite = null;
	announcement.text.text = "";
}	
function AnnouncementStep1 (time:float) {
	announcement.chest.sprite = announcement.chestSprites[0];
	announcement.cover.color.a = 1;
	announcement.lockImage.sprite = announcement.lockImageSprites[0];
	announcement.text.text = "";
	var counter:float = 0;
	var originChest:Vector3;
	var originLock:Vector3;
	var difference:float;
	difference = .01;
	originChest = announcement.chest.transform.localPosition;
	originLock = announcement.lockImage.transform.localPosition;
	while (counter < time/2)
	{
		var xChange:float = Random.Range(-difference,difference);
		var yChange:float = Random.Range(-difference,difference);
		announcement.chest.transform.localPosition = Vector3(originChest.x + xChange,originChest.y + yChange,originChest.z);
		announcement.lockImage.transform.localPosition = Vector3(originLock.x + xChange, originLock.y + yChange,originLock.z);
		yield WaitForSeconds(.03);
		counter += .03;
		yield;
	}	
	difference = .02;
	while (counter < time)
	{
		xChange = Random.Range(-difference,difference);
		yChange = Random.Range(-difference,difference);
		announcement.chest.transform.localPosition = Vector3(originChest.x + xChange,originChest.y + yChange,originChest.z);
		announcement.lockImage.transform.localPosition = Vector3(originLock.x + xChange, originLock.y + yChange,originLock.z);
		yield WaitForSeconds(.03);
		counter += .03;
		yield;
	}
	announcement.chest.transform.localPosition = originChest;
	announcement.lockImage.transform.localPosition = originLock;
}

function AnnouncementStep2 () {
	announcement.chest.sprite = announcement.chestSprites[0];
	announcement.lockImage.sprite = announcement.lockImageSprites[1];
}
function AnnouncementStep3 (level:int) {
	announcement.unlockParticle.emissionRate = 100;
	announcement.unlock.transform.localScale = Vector3(.5,.5,1);
	announcement.unlock.sprite = Master.currentWorld.unlocks.unlockIcons[level];
	announcement.chest.sprite = announcement.chestSprites[1];
	announcement.lockImage.sprite = null;
	announcement.text.text = Master.currentWorld.unlocks.unlockNotificationTextLine1[level] + "\n" + Master.currentWorld.unlocks.unlockNotificationTextLine2[level];;
}

class Announcement {
	var cover:SpriteRenderer;
	var chest:SpriteRenderer;
	var lockImage:SpriteRenderer;
	var text:TextMesh;
	var chestSprites:Sprite[];
	var lockImageSprites:Sprite[];
	var unlock:SpriteRenderer;
	var unlockParticle:ParticleSystem;
}