#pragma strict

@HideInInspector var theaterCustomizeManager:TheaterCustomizeManager;
@HideInInspector var theaterController:TheaterController;
@HideInInspector var theaterManager:TheaterManager;

@HideInInspector var thisPartNumber:int;
@HideInInspector var theaterPart:String;

static var automatic:boolean;

function Start () {
	theaterPart = transform.name;
	automatic = true;
	thisPartNumber = GetPartNumber(theaterPart);
	theaterCustomizeManager = GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterCustomizeManager);
	theaterController = GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterController);
	theaterManager = GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterManager);
}

function Clicked () {
Debug.Log("HEY");
	if(automatic)
	{
		if((theaterController.currentState == TheaterStatus.Home || theaterController.currentState == TheaterStatus.Front) && TheaterController.buttonCooldown < 0)
		{
			theaterCustomizeManager.currentSelected = thisPartNumber;
			theaterController.customizing = true;
			HighlightGlow.flash = true;
			theaterCustomizeManager.currentSelected = thisPartNumber;
			theaterManager.ChangePart(theaterPart,1);
		}
	}
	else
	{
		if(theaterController.customizing)
		{
			if(theaterCustomizeManager.currentSelected == thisPartNumber)
			{
				theaterManager.ChangePart(theaterPart,1);
			}
			else
			{
				theaterController.customizing = false;
			}
		}
		else if((theaterController.currentState == TheaterStatus.Home || theaterController.currentState == TheaterStatus.Front) && TheaterController.buttonCooldown < 0)
		{
			theaterCustomizeManager.currentSelected = thisPartNumber;
			theaterController.customizing = true;
		}
	}
}

function Flash() {
	
}

function GetPartNumber (name:String):int {
	if(name.IndexOf("StageWall") >= 0)
	{
		transform.name = "StageWall";
		return 0;
	}
	else if(name.IndexOf("StageFloor") >= 0)
	{
		transform.name = "StageFloor";
		return 1;
	}
	else if(name.IndexOf("Ceiling") >= 0)
	{
		transform.name = "Ceiling";
		return 2;
	}
	else if(name.IndexOf("TheaterWall") >= 0)
	{
		transform.name = "TheaterWall";
		return 3;
	}
	else if(name.IndexOf("TheaterFloor") >= 0)
	{
		transform.name = "TheaterFloor";
		return 4;
	}
	else if(name.IndexOf("Curtain") >= 0)
	{
		transform.name = "Curtain";
		return 5;
	}
	else if(name.IndexOf("Chairs") >= 0)
	{
		transform.name = "Chairs";
		return 6;
	}
	else if(name.IndexOf("FOHWall") >= 0)
	{
		transform.name = "FOHWall";
		return 0;
	}
	else if(name.IndexOf("FOHFloor") >= 0)
	{
		transform.name = "FOHFloor";
		return 1;
	}
	else if(name.IndexOf("FOHBooze") >= 0)
	{
		transform.name = "FOHBooze";
		return 2;
	}
	else if(name.IndexOf("FOHTicketBooth") >= 0)
	{
		transform.name = "FOHTicketBooth";
		return 3;
	}
	else if(name.IndexOf("FOHDesk") >= 0)
	{
		transform.name = "FOHDesk";
		return 4;
	}
}