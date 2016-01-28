#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var upSprite:Sprite;
var downSprite:Sprite;
var subText:GameObject;
var subTextOrigin:float;

var warningNote:GameObject;

function Start () {
	subTextOrigin = subText.transform.localPosition.y;
}

function UpdateVisuals (reset:boolean) {
	if(reset)
	{
		GetComponent(SpriteRenderer).sprite = upSprite;
		subText.transform.localPosition.y = subTextOrigin;
	}
	if(Master.currentWorld.basic.worldNameVar == "Arcade" || Master.currentWorld.basic.worldNameVar == "Theater" || Master.currentWorld.basic.worldNameVar == "UnlockWheel" || Master.currentWorld.basic.worldNameVar == "VRTraining")
	{
		subText.GetComponent(SpriteRenderer).color = Color(0,0,0,0);
		GetComponent(SpriteRenderer).color = Color(0,0,0,0);
	}
	else
	{
		subText.GetComponent(SpriteRenderer).color = Color(1,1,1,1);
		if(ObscuredPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"End3Played") != 1 && ObscuredPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"End4Played") != 1)
		{
			GetComponent(SpriteRenderer).color = Color(.7,.7,.7,1);
		}
		else
		{
			GetComponent(SpriteRenderer).color = Color(1,.35,.35,1);
		}
	}
	if(Master.currentWorld.basic.worldNameVar == "Theater" && Master.allowShow && ObscuredPrefs.GetInt("ShowDate:"+Master.date) != 1)
	{
		Master.hardMode = true;
	}
	else if(Master.currentWorld.basic.worldNameVar == "Theater")
	{
		Master.hardMode = false;
	}
}

function Clicked () {
	if(WorldMapManager.currentState == MapStatus.Confirmation)
	{
		if(ObscuredPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"End3Played") == 1)
		{
			if(Master.hardMode)
			{
				Master.hardMode = false;
				GetComponent(SpriteRenderer).sprite = upSprite;
				subText.transform.localPosition.y = subTextOrigin;
			}
			else
			{
				Master.hardMode = true;
				GetComponent(SpriteRenderer).sprite = downSprite;
				subText.transform.localPosition.y = subTextOrigin - .02;
			}
		}
		else
		{
			Camera.main.GetComponent(Master).LaunchNotification("Get to 25 games on this level first!",NotificationType.lockedWorld);
			WorldMapManager.currentState = MapStatus.Notification;
			while(Master.notifying)
			{
				yield;
			}
			WorldMapManager.currentState = MapStatus.Confirmation;
		}
	}
}