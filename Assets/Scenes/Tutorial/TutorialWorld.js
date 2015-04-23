#pragma strict

private var importantFinger:int;

var blocker:GameObject;

var showTheaterText:GameObject;
var showFactoryText:GameObject;
var explainPremiseText:GameObject;

private var currentText:GameObject;
private var currentButtonLocation:Vector2;
private var tutorialStage:int;

private var goal:float;

var factory:ChangeMapState;
var startGames:GoToWorld;
var ticket:GameObject;

var finger:GameObject;

private var currentColor:float;

var button1:GameObject;
var button2:GameObject;

private var shown:float;
private var hidden:float;

function Start () {
	finger.transform.position.y = 100;
	finger.transform.position.x = 100;
	shown = -3.75;
	hidden = 0;
	goal = 23;
	tutorialStage = 0;
	importantFinger = -1;
	currentButtonLocation = Vector2(-100,-100);
	currentColor = 0;
	StartCoroutine(Tutorial());
}

function Update () {
	blocker.GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(blocker.GetComponent(SpriteRenderer).color.a,currentColor,Time.deltaTime);
	transform.position.x = Mathf.Lerp(transform.position.x,goal,Time.deltaTime*4);
	transform.position.x = Mathf.MoveTowards(transform.position.x,goal,Time.deltaTime*2);
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			
			if(Finger.GetExists(i))
			{
				importantFinger = i;
				break;
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		TutorialClick(Finger.GetPosition(importantFinger));
		importantFinger = -1;
	}
}

function Tutorial () {
	yield WaitForSeconds(1.5);
		currentText = Instantiate(showTheaterText);
	while(!currentText.GetComponent(TextManager).finished) {yield;}
		goal = -3;
		currentText = Instantiate(showFactoryText);
	while(!currentText.GetComponent(TextManager).finished) {yield;}
		currentButtonLocation = Vector2(0,-3);
		button1.transform.position.z = shown;
		finger.transform.position.y = 0;
		finger.transform.position.x = -4.34;
		currentColor = .35;
	while(tutorialStage != 1) {yield;}
		button1.transform.position.z = hidden;
		finger.transform.position.y = 100;
		finger.transform.position.x = 100;
		factory.transform.SendMessage("ReplaceMaster",SendMessageOptions.DontRequireReceiver);
		currentColor = 0;
		currentButtonLocation = Vector2(-100,-100);
	while(ticket.transform.position.y != 0)
		{
			ticket.transform.position.y = Mathf.Lerp(ticket.transform.position.y,0,Time.deltaTime*6);
			ticket.transform.position.y = Mathf.MoveTowards(ticket.transform.position.y,0,Time.deltaTime*3);
			yield;
		}
		currentText = Instantiate(explainPremiseText);
	while(!currentText.GetComponent(TextManager).finished) {yield;}
		currentColor = .35;
		currentButtonLocation = Vector2(3.5,-1.7);
		button2.transform.position.z = shown;
		finger.transform.position.y = 4.548;
		finger.transform.position.x = -3.172;
	while(tutorialStage != 2) {yield;}
		button2.transform.position.z = hidden;
		finger.transform.position.y = 100;
		finger.transform.position.x = 100;	
		currentColor = 0;
		currentButtonLocation = Vector2(-100,-100);
		startGames.Load();
		PlayerPrefs.SetInt("TutorialFinished", 1);
	yield;
}

function TutorialClick (location:Vector2) {
	if(Vector2.Distance(location,currentButtonLocation) < 2)
	{
		tutorialStage ++;
	}
}