#pragma strict

var particle:ParticleSystem;
var lid:GameObject;
@HideInInspector var lidOrigin:Vector3;
var status:SpriteRenderer;
var button:SpriteRenderer;
var warning:SpriteRenderer;
var indicator:SpriteRenderer;
var poured:SpriteRenderer;

var statusSprite:Sprite[];
var buttonSprites:Sprite[];
var indicatorSprites:Sprite[];
var pouredSprites:Sprite[];

@HideInInspector var speed:int;
@HideInInspector var difficulty:float;
@HideInInspector var finished:boolean;
@HideInInspector var clickLength:float;
@HideInInspector var endWaitLength:float;
@HideInInspector var difference:float;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var importantFinger:int;
@HideInInspector var clicked:boolean;
@HideInInspector var clickedButton:boolean;

@HideInInspector var allowance:int;

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
	difference = 0;
	allowance = 0;
	clicked = false;
	lidOrigin = lid.transform.position;
	status.sprite = statusSprite[0];
	indicator.sprite = indicatorSprites[0];
	poured.sprite = null;
	clickLength = .4 - (.05 * speed);
	if(clickLength < .15)
	{
		clickLength = .2 - .01 * speed;
	}
	else if(clickLength < .18)
	{
		clickLength = .18;
	}
	length = 1 + clickLength * 7 + (clickLength * 1.5 * (1.7 - ((1*difficulty)/5)));
	endWaitLength = (clickLength * 1.5 * (1.7 - ((1*difficulty)/5)));
	timer = length;
	UITimer.currentTarget = length - endWaitLength/12;
	UITimer.counter = 0;
	StartCoroutine(LidShake());
	Play();
}

function Update () {
	// Get important finger.
	if(importantFinger == -1)
	{
		clickedButton = false;
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
	if(Finger.GetExists(importantFinger) && Finger.GetInGame(importantFinger) && !Master.paused)
	{
		Clicked();
		clickedButton = true;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	if(Input.GetKey("space"))
	{
		Clicked();
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		finished = true;
		Finish(false);
	}
}

function Play () {
	yield WaitForSeconds(clickLength * 2);
	indicator.sprite = indicatorSprites[1];
	difference = .01;
	yield WaitForSeconds(clickLength);
	indicator.sprite = indicatorSprites[2];
	difference = .02;
	allowance = 1;
	yield WaitForSeconds(clickLength);
	if(!clicked)
	{
		indicator.sprite = indicatorSprites[3];
	}
	difference = .03;
	yield WaitForSeconds(clickLength);
	if(!clicked)
	{
		indicator.sprite = indicatorSprites[4];
	}
	difference = .04;
	yield WaitForSeconds(clickLength);
	if(!clicked)
	{
		indicator.sprite = indicatorSprites[5];
	}
	difference = .05;
	yield WaitForSeconds(clickLength);
	if(!clicked)
	{
		indicator.sprite = indicatorSprites[6];
	}
	difference = .06;
	yield WaitForSeconds(clickLength);
	difference = .07;
	if(!clicked)
	{
		indicator.sprite = indicatorSprites[7];
		status.sprite = statusSprite[1];
		SendMessage("NextNotify", SendMessageOptions.DontRequireReceiver);
	}
	allowance = 2;
	yield WaitForSeconds(endWaitLength/4);
	difference = .08;
	warning.color.a = 0;
	yield WaitForSeconds(endWaitLength/4);
	difference = .1;
	if(!clicked)
	{
		warning.color.a = .3;
	}
	yield WaitForSeconds(endWaitLength/4);
	difference = .12;
	warning.color.a = 0;
	yield WaitForSeconds(endWaitLength/4);
		difference = .14;
		if(!clicked)
		{
			warning.color.a = .6;
		}
	yield WaitForSeconds(endWaitLength/4);
		difference = .24;
		warning.color.a = 0;
		if(!clicked)
		{
			particle.startColor = Color(.2,.2,.2,.4);
			particle.emissionRate = 140;
		}
	yield WaitForSeconds(endWaitLength/4);
		if(!clicked)
		{
			warning.color.a = 1;
			status.sprite = null;
		}
		allowance = 0;
}

function LidShake() {
	while(true && !clicked)
	{
		lid.transform.position = Vector3(Random.Range(lidOrigin.x-difference,lidOrigin.x+difference),Random.Range(lidOrigin.y-difference,lidOrigin.y+difference),lidOrigin.z);
		yield WaitForSeconds(.03);
	}
	yield;
}

function WeakPour() {
	yield WaitForSeconds(.3);
	poured.sprite = pouredSprites[0];
	particle.startColor = Color(.2,.2,.2,.4);
	particle.emissionRate = 140;
	yield WaitForSeconds(1);
	if(!finished)
	{
		finished = true;
		Finish(false);
	}
}

function GoodPour() {
	if(!finished)
	{
		finished = true;
		particle.emissionRate = 3;
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[0];
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[1];
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[2];
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[3];
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[4];
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[5];
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[6];
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[7];
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[8];
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[9];
		Finish(true);
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[10];
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[11];
		yield WaitForSeconds(.07);
		poured.sprite = pouredSprites[12];
	}
}

function Clicked() {
	if(allowance == 1 && !clicked)
	{
		button.sprite = buttonSprites[1];
		clicked = true;
		WeakPour();
	}
	else if(allowance == 2 && !clicked)
	{
		button.sprite = buttonSprites[1];
		clicked = true;
		GoodPour();
	}
}

function Finish(completionStatus:boolean) {
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