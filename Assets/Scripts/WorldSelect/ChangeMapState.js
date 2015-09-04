﻿#pragma strict

var menu:GameObject; 
var newState:MapStatus;

static var currentMenu:GameObject;

var thisWorld:WorldSelect;
var thisWorldDisplay:Sprite[];

private var controller:Master;

var worldNameVar:String;
var topLine:String;
var bottomLine:String;

var distance:float;

@HideInInspector var showCounter:float;
var button:SpriteRenderer;
var buttonIcon:SpriteRenderer;

var warningNote:GameObject;

function Start () {
	showCounter = 0;
	StartCoroutine(UpdateWorldAvailability());
}

function CheckHover () {
	while(true)
	{
		if(Mathf.Abs(Camera.main.transform.position.x - transform.position.x) < distance)
		{
			showCounter += Time.deltaTime;
		}
		else
		{
			showCounter = 0;
		}
		if(showCounter > 2)
		{
			var goalColor:float = Mathf.Abs(Mathf.Sin(showCounter))/2 + .5;;
			
			button.color.a = Mathf.MoveTowards(button.color.a, goalColor, Time.deltaTime*2);
			buttonIcon.color.a = Mathf.MoveTowards(button.color.a, goalColor, Time.deltaTime*2);
		}
		else
		{
			button.color.a = 0;
			buttonIcon.color.a = 0;
		}
		yield;
	}
}

function Clicked () {
	switch(newState)
	{
		case MapStatus.Menu:
			if(WorldMapManager.currentState == MapStatus.Clear && menu != null && currentMenu == null)
			{
				currentMenu = Instantiate(menu, Vector3(0,-24,-3),Quaternion.identity);
				WorldMapManager.currentState = MapStatus.Menu;
			}
			break;
		case MapStatus.Clear:
			if(WorldMapManager.currentState == MapStatus.Confirmation)
			{
				WorldMapManager.currentState = MapStatus.Clear;
				var menuManager:WorldMenuManager = GetComponentInParent(WorldMenuManager); 
			}
			else if(WorldMapManager.currentState == MapStatus.Menu)
			{
				WorldMapManager.currentState = MapStatus.Clear;
				GetComponentInParent(WorldMenuManager).Exit();
			}
			break;
		case MapStatus.Confirmation:
			if(WorldMapManager.allowClick)
			{
				if(PlayerPrefs.GetInt(worldNameVar) == 1)
				{
					controller = Camera.main.GetComponent(Master);
					controller.currentWorld.basic.world = thisWorld;
					SendMessage("ReplaceMaster",SendMessageOptions.DontRequireReceiver);
					for(var level:World in controller.worlds)
					{
						if(level.basic.worldNameVar == worldNameVar)
						{
							Master.currentWorld = level;
						}
					}
					if(WorldMapManager.currentState == MapStatus.Clear || (WorldMapManager.currentState == MapStatus.Intro && !WorldMapManager.introducing))
					{
						WorldMapManager.currentState = MapStatus.Confirmation;
					}
				}
				else if(WorldMapManager.currentState == MapStatus.Clear)
				{
					WorldMapManager.currentNotification = Instantiate(warningNote);
					WorldMapManager.currentState = MapStatus.Notification;
				}
			}
			WorldMapManager.selectedLocation = transform.localPosition.x;
			break;
		default:
			break;
	}
}

function UpdateWorldAvailability () {
	if(PlayerPrefs.GetInt(worldNameVar) == 1)
	{
		CheckHover();
	}
	while(true)
	{
		if(thisWorldDisplay.Length == 2)
		{
			GetComponent(SpriteRenderer).sprite = thisWorldDisplay[PlayerPrefs.GetInt(worldNameVar)];
		}
		yield WaitForSeconds(1);
	}
	yield;
}