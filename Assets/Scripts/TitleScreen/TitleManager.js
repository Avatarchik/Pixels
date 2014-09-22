#pragma strict

public enum TitleStatus{Home,CustomizeNoColor ,CustomizeColor,Options};

static var currentState:TitleStatus;

var colors1:GameObject;
var colors2:GameObject;
var returnButton:GameObject;

function Start () {
	currentState = TitleStatus.Home;
}	

function Update () {
	var speed:float = Time.deltaTime * 5;
	switch(currentState)
	{
		case TitleStatus.Home:
			transform.position = Vector2.Lerp(transform.position, Vector2(0,0),speed);
			returnButton.transform.position = Vector2.Lerp(returnButton.transform.position, Vector2(-7,22),speed);
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,-1),speed);
			
			/*
			transform.position = Vector2.MoveTowards(transform.position, Vector2(0,0),speed * 2);
			returnButton.transform.position = Vector2.MoveTowards(returnButton.transform.position, Vector2(-7,22),speed * 2);
			colors1.transform.position = Vector2.MoveTowards(colors1.transform.position, Vector2(0,-20),speed * 2);
			colors2.transform.position = Vector2.MoveTowards(colors2.transform.position, Vector2(22,0),speed * 2);
			*/
			break;
		case TitleStatus.CustomizeNoColor:
			transform.position = Vector2.Lerp(transform.position, Vector2(0,25),speed);
			returnButton.transform.position = Vector2.Lerp(returnButton.transform.position, Vector2(-7,14),speed);
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,-1),speed);
			/*
			transform.position = Vector2.MoveTowards(transform.position, Vector2(0,0),speed * 2);
			returnButton.transform.position = Vector2.MoveTowards(returnButton.transform.position, Vector2(-7,22),speed * 2);
			colors1.transform.position = Vector2.MoveTowards(colors1.transform.position, Vector2(0,-20),speed * 2);
			colors2.transform.position = Vector2.MoveTowards(colors2.transform.position, Vector2(22,0),speed * 2);
			*/
			break;
		case TitleStatus.CustomizeColor:
			transform.position = Vector2.Lerp(transform.position, Vector2(0,25),speed);
			returnButton.transform.position = Vector2.Lerp(returnButton.transform.position, Vector2(-7,14),speed);
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-12.5),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(12.4,-1),speed);
			/*
			transform.position = Vector2.MoveTowards(transform.position, Vector2(0,0),speed * 2);
			returnButton.transform.position = Vector2.MoveTowards(returnButton.transform.position, Vector2(-7,22),speed * 2);
			colors1.transform.position = Vector2.MoveTowards(colors1.transform.position, Vector2(0,-20),speed * 2);
			colors2.transform.position = Vector2.MoveTowards(colors2.transform.position, Vector2(22,0),speed * 2);
			*/
			break;
		case TitleStatus.Options:
			transform.position = Vector2.Lerp(transform.position, Vector2(-24,0),speed);
			returnButton.transform.position = Vector2.Lerp(returnButton.transform.position, Vector2(-7,22),speed);
			colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
			colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,-1),speed);
			break;
		default:
			break;
	}
}