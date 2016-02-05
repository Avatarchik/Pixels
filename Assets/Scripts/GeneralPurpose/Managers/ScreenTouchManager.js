#pragma strict

enum ScreenTouchType{LeftRight};

var thisObject:boolean;
var message:GameObject[];
var importantFinger:int;
var touchType:ScreenTouchType;
var origin:Vector3;

// Determine if movement is from the origin or relative to an object.
var relativeToDistance:boolean;
var relativeDistance:float;
var relativeToObject:boolean;
var relativeObject:GameObject;

// Binary Variables
var continuous:boolean;
var done:boolean;

function Start () {
	done = true;
}

function Update () {
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			
			if(Finger.GetExists(i) && Mathf.Abs(Finger.GetPosition(i).x) < 9 && Mathf.Abs(Finger.GetPosition(i).y) < 9)
			{
				done = false;
				importantFinger = i;
				break;
			}
		}
	}
	else
	{
		origin = Vector3.zero;
		if(relativeToObject && relativeObject != null)
		{
			origin = relativeObject.transform.position;
		}
		switch (touchType)
		{
			
			case ScreenTouchType.LeftRight:
				if(Finger.GetPosition(importantFinger).x < origin.x && !done)
				{
					if(thisObject)
					{
						SendMessage("Left", SendMessageOptions.DontRequireReceiver);
					}
					else
					{
						for(var y:int = 0; y < message.length; y++)
						{
							message[y].SendMessage("Left", SendMessageOptions.DontRequireReceiver);
						}
					}
					
					if(relativeToDistance && Mathf.Abs(Finger.GetPosition(importantFinger).x - origin.x) > relativeDistance)
					{
						SendMessage("Left", SendMessageOptions.DontRequireReceiver);
					}
					
				}
				if(Finger.GetPosition(importantFinger).x > origin.x && !done)
				{
					if(thisObject)
					{
						SendMessage("Right", SendMessageOptions.DontRequireReceiver);
					}
					else
					{
						for(var z:int = 0; z < message.length; z++)
						{
							message[z].SendMessage("Right");
						}
					}
					if(relativeToDistance && Mathf.Abs(Finger.GetPosition(importantFinger).x - origin.x) > relativeDistance)
					{
						SendMessage("Right", SendMessageOptions.DontRequireReceiver);
					}
				}	
				if(!continuous)
				{
					done = true;
				}
				break;
			default:
				break;
		}
		if(!Finger.GetExists(importantFinger))
		{
			importantFinger = -1;
		}
	}
}