#pragma strict

enum ScreenTouchType{LeftRight};

var thisObject:boolean;
var message:GameObject[];
var importantFinger:int;
var touchType:ScreenTouchType;

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
		switch (touchType)
		{
			case ScreenTouchType.LeftRight:
				if(Finger.GetPosition(importantFinger).x < 0 && !done)
				{
					if(thisObject)
					{
						SendMessage("Left", SendMessageOptions.DontRequireReceiver);
					}
					else
					{
						for(var y:int = 0; y < message.length; y++)
						{
							message[y].SendMessage("Left");
						}
					}
				}
				if(Finger.GetPosition(importantFinger).x > 0 && !done)
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