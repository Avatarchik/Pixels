﻿#pragma strict

public enum MapStatus{Clear,Confirmation,Menu,Credits,Notification,Returning};

static var currentState:MapStatus;
static var mapMove:boolean;

// Audio
var worldMusic:AudioClip;

// Clear
static var cameraVelocity:float;
var importantFinger:int;
var startPosition:Vector3;
var mapMoveSpeed:float;
var worlds:Transform[];
var closestWorld:int;

// Confirmation
var ticket:GameObject;
var worldTransition:GameObject;

// Menu
var fade:Renderer;

// Locations
var showNot:Vector3;
var hideNot:Vector3;

function Start () {
	Audio.PlaySongIntro(null,worldMusic,1);	
	worlds = new Transform[transform.childCount];
	for(var i:int = 0; i < worlds.length; i++)
	{
		worlds[i] = transform.GetChild(i);
	}
	fade = Camera.main.GetComponentInChildren(Renderer);
	showNot = Vector3(0,0,-1);
	hideNot = Vector3(0,30,-1);
	currentState = MapStatus.Clear;
	importantFinger = -1;
	mapMove = false;
	if(mapMoveSpeed == 0 || mapMoveSpeed == null)
	{
		mapMoveSpeed = .07;
	}
}
function Update () {
	// Move map if no pop-ups are on-screen.
	switch(currentState)
	{
		case MapStatus.Clear:
			hideTicket();
			fade.material.color.a = Mathf.MoveTowards(fade.renderer.material.color.a, 0, Time.deltaTime);
			if(importantFinger == -1)
			{
				for(var i:int = 0; i < Finger.identity.length; i++)
				{
					if(Finger.GetExists(i))
					{
						startPosition = Vector3(Finger.GetPosition(i).x,Finger.GetPosition(i).y,0);
						importantFinger = i;
						break;
					}
				}
				var smallestDistance:float = 100;
				for(var worldList:int = 0; worldList < worlds.length; worldList++)
				{
					if(Mathf.Abs(0 - worlds[worldList].position.x) < smallestDistance)
					{
						smallestDistance = Mathf.Abs(0 - worlds[worldList].position.x);
						closestWorld = worldList;
					}
				}
				if(Mathf.Abs(transform.position.x - (worlds[closestWorld].localPosition.x * transform.localScale.x * -1)) < 8 && Mathf.Abs(cameraVelocity) < 10)
				{
					transform.position.x = Mathf.Lerp(transform.position.x, worlds[closestWorld].localPosition.x * transform.localScale.x * -1,Time.deltaTime*2);
					transform.position.x = Mathf.MoveTowards(transform.position.x, worlds[closestWorld].localPosition.x * transform.localScale.x * -1,Time.deltaTime*.5);
				}
			}
			else
			{
				if(Vector3.Distance(startPosition, Vector3(Finger.GetPosition(importantFinger).x,Finger.GetPosition(importantFinger).y,0)) > 3)
				{
					mapMove = true;
				}
				if(!Finger.GetExists(importantFinger))
				{
					importantFinger = -1;
					mapMove = false;
				}
				else if(mapMove)
				{
					cameraVelocity = Mathf.Clamp(Finger.GetVelocity(importantFinger).x,-60,60);
				}
			}
			
			// Move camera according to finger velocity, but slow over time.
			
			if(Camera.main.orthographicSize == 9)
			{
				if(transform.position.x + (cameraVelocity * mapMoveSpeed) > -28 && transform.position.x + (cameraVelocity * mapMoveSpeed) < 28)
				{
					transform.position.x += cameraVelocity * mapMoveSpeed;
				}
			}
			else
			{
				if(transform.position.x + (cameraVelocity * mapMoveSpeed) > -28 && transform.position.x + (cameraVelocity * mapMoveSpeed) < 28)
				{
					transform.position.x += cameraVelocity * mapMoveSpeed;
				}
			}
			cameraVelocity = Mathf.Lerp(cameraVelocity,0,Time.deltaTime * 2.5);
			break;
		case MapStatus.Confirmation:
			showTicket();
			break;
		case MapStatus.Menu:
			fade.renderer.material.color.a = Mathf.MoveTowards(fade.renderer.material.color.a, .4, Time.deltaTime);
			break;
		case MapStatus.Returning:
			fade.renderer.material.color.a = Mathf.MoveTowards(fade.renderer.material.color.a, 0, Time.deltaTime);
			break;
		default:
			break;
	}
}

function showTicket() {
	var childText:Component[];
	childText = ticket.GetComponentsInChildren(TextMesh);
	for(var text:TextMesh in childText)
	{
		if(text.transform.name == "Title1" || text.transform.name == "Shadow1")
		{
			text.text = Camera.main.GetComponent(Master).worldNameLine1;
		}	
		if(text.transform.name == "Title2" || text.transform.name == "Shadow2")
		{
			text.text = Camera.main.GetComponent(Master).worldNameLine2;
		}	
	}
	while(Vector3.Distance(ticket.transform.position, showNot) > .1 && currentState == MapStatus.Confirmation)
	{	
		ticket.transform.position = Vector3.Lerp(ticket.transform.position,showNot, Time.deltaTime);
		yield;
	}
}
function hideTicket() {
	while(Vector3.Distance(ticket.transform.position, hideNot) > .5 && currentState == MapStatus.Clear)
	{
		ticket.transform.position = Vector3.Lerp(ticket.transform.position,hideNot, Time.deltaTime);
		yield;
	}
}