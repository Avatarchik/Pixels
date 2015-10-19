#pragma strict

@HideInInspector var clicked:boolean;

@HideInInspector var importantFinger:int;

function Start () {
	clicked = false;
	importantFinger = -1;
}

function Update () {
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			
			if(Finger.GetExists(i))
			{
				importantFinger = i;
			}
		}
	}
	else if(Finger.GetExists(importantFinger))
	{
		if((Mathf.Abs(Finger.GetPosition(importantFinger).x) > 10 || Mathf.Abs(Finger.GetPosition(importantFinger).y) > 10) && !clicked)
		{
			Clicked();
		}
		clicked = true;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
		clicked = false;
	}
}

function Clicked() {
	if(Application.loadedLevelName == "MicroTester")
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).Clicked();
	}
	else 
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).Clicked();
	}
}