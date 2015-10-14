﻿#pragma strict

// Declare variables.
@HideInInspector var importantFinger:int;
@HideInInspector var button:Bounds;
@HideInInspector var startPosition:Vector3;
var continuous:boolean = false;
@HideInInspector var location:Vector2;
var boundMultiplier:float = 1;

var down:Sprite;
var up:Sprite;

var subText:GameObject;
@HideInInspector var textOrigin:Vector3;
var textOffset:Vector3;

var clickSound:AudioClip;
var click:boolean;
var volume:float;

var inMinigame:boolean;
var inMinigameContinuousOverride:boolean = false;

var notificationWatch:boolean = false;

function Start () {
	if(subText != null)
	{
		textOrigin = subText.transform.localPosition;
	}
	// Reset important finger, create bounding box.
	importantFinger = -1;
	button = Bounds(Vector3(transform.position.x, transform.position.y, 0), Vector3(transform.lossyScale.x * boundMultiplier, transform.lossyScale.y * boundMultiplier, 2));
}

function FixedUpdate () {
	// Find important finger.
	if(importantFinger == -1)
	{
		if(GetComponent(SpriteRenderer) != null && up != null && down != null)
		{
			GetComponent(SpriteRenderer).sprite = up;
		}
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			
			if(Finger.GetExists(i))
			{
				button = Bounds(Vector3(transform.position.x, transform.position.y, 0), Vector3(transform.lossyScale.x * boundMultiplier, transform.lossyScale.y * boundMultiplier, 2));
				if(button.Contains(Vector3(Finger.GetPosition(i).x,Finger.GetPosition(i).y,0)) && Finger.GetPhase(i) == TouchPhase.Began)
				{
					startPosition = Vector3(Finger.GetPosition(i).x,Finger.GetPosition(i).y,0);
					if(click && clickSound != null)
					{
						AudioManager.PlaySound(clickSound,volume);
					}
					if(!notificationWatch || !Master.notifying)
					{
						importantFinger = i;
					}
					if(down!=null && GetComponent(SpriteRenderer)!=null)
					{
						GetComponent(SpriteRenderer).sprite = down;
						if(subText != null)
						{
							subText.transform.localPosition = textOrigin - textOffset;
						}
					}
					break;
				}
			}
		}
	}
	else if(Finger.GetExists(importantFinger))
	{
		location = Finger.GetPosition(importantFinger);
		if(continuous)
		{
			if(!inMinigame)
			{
				gameObject.SendMessage("Clicked", SendMessageOptions.DontRequireReceiver);
			}
			if(inMinigame && inMinigameContinuousOverride)
			{
				gameObject.SendMessage("Clicked", SendMessageOptions.DontRequireReceiver);
			}
		}
		if(!button.Contains(Vector3(Finger.GetPosition(importantFinger).x,Finger.GetPosition(importantFinger).y,0)))
		{
			if(up!=null && GetComponent(SpriteRenderer)!=null)
			{
				GetComponent(SpriteRenderer).sprite = up;
				if(subText != null)
				{
					subText.transform.localPosition = textOrigin;
				}
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		button = Bounds(Vector3(transform.position.x, transform.position.y, 0), Vector3(transform.lossyScale.x * boundMultiplier, transform.lossyScale.y * boundMultiplier, 2));
		// Touch button with importantFinger.
		if(!WorldMapManager.mapMove && Vector3.Distance(startPosition, Vector3(Finger.GetPosition(importantFinger).x,Finger.GetPosition(importantFinger).y,0)) < button.extents.x && button.Contains(Vector3(Finger.GetPosition(importantFinger).x,Finger.GetPosition(importantFinger).y,0)))
		{
			// This is where clicking happens.
			if(Application.loadedLevelName != "MicroTester" && Application.loadedLevelName != "Arcade")
			{
				if(!inMinigame || (!GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager)!=null && !GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).paused))
				{
					gameObject.SendMessage("Clicked", SendMessageOptions.DontRequireReceiver);
					gameObject.SendMessage("Unclicked", SendMessageOptions.DontRequireReceiver);
				}
			}
			else
			{
				gameObject.SendMessage("Clicked", SendMessageOptions.DontRequireReceiver);
				gameObject.SendMessage("Unclicked", SendMessageOptions.DontRequireReceiver);
			}
			if(up!=null && GetComponent(SpriteRenderer)!=null)
			{
				GetComponent(SpriteRenderer).sprite = up;
				if(subText != null)
				{
					subText.transform.localPosition = textOrigin;
				}
			}
		}
		importantFinger = -1;
	}
}