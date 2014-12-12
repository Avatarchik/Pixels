#pragma strict

// Declare variables.
var importantFinger:int;
var button:Bounds;
var startPosition:Vector3;
var continuous:boolean = false;
var location:Vector2;

var down:Sprite;
var up:Sprite;

var subText:GameObject;
var textOrigin:Vector3;
var textOffset:Vector3;

function Start () {
	if(subText != null)
	{
		textOrigin = subText.transform.localPosition;
	}
	// Reset important finger, create bounding box.
	importantFinger = -1;
	button = Bounds(Vector3(transform.position.x, transform.position.y, 0), Vector3(transform.lossyScale.x, transform.lossyScale.y, 2));
}

function Update () {
	// Find important finger.
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			
			if(Finger.GetExists(i))
			{
				button = Bounds(Vector3(transform.position.x, transform.position.y, 0), Vector3(transform.lossyScale.x, transform.lossyScale.y/2, 2));
				if(button.Contains(Vector3(Finger.GetPosition(i).x,Finger.GetPosition(i).y,0)) && Finger.GetPhase(i) == TouchPhase.Began)
				{
					startPosition = Vector3(Finger.GetPosition(i).x,Finger.GetPosition(i).y,0);
					importantFinger = i;
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
			gameObject.SendMessage("Clicked", SendMessageOptions.DontRequireReceiver);
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
		button = Bounds(Vector3(transform.position.x, transform.position.y, 0), Vector3(transform.lossyScale.x, transform.lossyScale.y, 2));
		// Touch button with importantFinger.
		if(!WorldMapManager.mapMove && Vector3.Distance(startPosition, Vector3(Finger.GetPosition(importantFinger).x,Finger.GetPosition(importantFinger).y,0)) < button.extents.x && button.Contains(Vector3(Finger.GetPosition(importantFinger).x,Finger.GetPosition(importantFinger).y,0)))
		{
			// This is where clicking happens.
			gameObject.SendMessage("Clicked", SendMessageOptions.DontRequireReceiver);
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