#pragma strict

// Declare variables.
var importantFinger:int;
var button:Bounds;
var startPosition:Vector3;

var down:Sprite;
var up:Sprite;

function Start () {
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
				button = Bounds(Vector3(transform.position.x, transform.position.y, 0), Vector3(transform.lossyScale.x, transform.lossyScale.y, 2));
				if(button.Contains(Vector3(Finger.GetPosition(i).x,Finger.GetPosition(i).y,0)) && Finger.GetPhase(i) == TouchPhase.Began)
				{
					startPosition = Vector3(Finger.GetPosition(i).x,Finger.GetPosition(i).y,0);
					importantFinger = i;
					if(down!=null && GetComponent(SpriteRenderer)!=null)
					{
						GetComponent(SpriteRenderer).sprite = down;
					}
					break;
				}
			}
		}
	}
	else if(Finger.GetExists(importantFinger))
	{
		if(!button.Contains(Vector3(Finger.GetPosition(importantFinger).x,Finger.GetPosition(importantFinger).y,0)))
		{
			if(up!=null && GetComponent(SpriteRenderer)!=null)
			{
				GetComponent(SpriteRenderer).sprite = up;
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
			}
		}
		importantFinger = -1;
	}
}