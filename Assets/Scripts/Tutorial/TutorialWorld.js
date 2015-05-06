#pragma strict

private var importantFinger:int;

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
	transform.position.x = Mathf.MoveTowards(transform.position.x,goal,Time.deltaTime*8);
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
		currentText = Instantiate(showTheaterText);
	while(!currentText.GetComponent(TextManager).finished) {yield;}
		goal = -3;
		while(transform.position.x != goal) {yield;}
		LaunchText(showFactoryText);
	while(!currentText.GetComponent(TextManager).finished) {yield;}
		factory.transform.SendMessage("ReplaceMaster",SendMessageOptions.DontRequireReceiver);
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

function LaunchText(text:GameObject) {
	if(GameObject.FindGameObjectWithTag("Transition") == null)
	{
		currentText = Instantiate(text);
	}
}