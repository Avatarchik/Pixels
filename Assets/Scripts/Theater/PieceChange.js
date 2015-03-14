#pragma strict

private var manager:TheaterManager;
private var theaterPart:String;
var change:int;

var specificChange:boolean;
var specificNumber:int;

var availability:boolean[];
var unselectableSprite:Sprite;

function Start () {
	manager = GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterManager);
	GetAvailability();
}

function Update () {
	//Debug.Log(PlayerPrefs.GetInt("StageWallSelection"));
	// Updates which piece will change.
	theaterPart = TheaterCustomizeManager.pieceName;
	GetAvailability();
	if(PlayerPrefs.GetInt(theaterPart+"Selection") == specificNumber)
	{
		GetComponent(SpriteRenderer).sprite = GetComponent(ButtonSquare).down;
		if(GetComponent(ButtonSquare).subText != null)
		{
			GetComponent(ButtonSquare).subText.transform.localPosition = GetComponent(ButtonSquare).textOrigin - GetComponent(ButtonSquare).textOffset;
		}
	}
	else if(availability.Length > 2 && !availability[specificNumber])
	{
		GetComponent(SpriteRenderer).sprite = unselectableSprite;
		//var theseSprites:SpriteRenderer[] = GetComponentsInChildren(SpriteRenderer);
		for(var sprite:SpriteRenderer in GetComponentsInChildren(SpriteRenderer))
		{
			sprite.color.a = .3;
		}
		GetComponent(ButtonSquare).subText.transform.localPosition = GetComponent(ButtonSquare).textOrigin;
	}
	else
	{
		GetComponent(SpriteRenderer).sprite = GetComponent(ButtonSquare).up;
		if(GetComponent(ButtonSquare).subText != null)
		{
			GetComponent(ButtonSquare).subText.transform.localPosition = GetComponent(ButtonSquare).textOrigin;
		}
	}
}

function Clicked () {
	if(specificChange && availability[specificNumber])
	{
		manager.ChangePartSpecific(theaterPart,specificNumber);	
	}
	else
	{
		manager.ChangePart(theaterPart,change);
	}
}

function GetAvailability () {
	switch(theaterPart)
	{
		case "StageWall":
			availability = TheaterManager.stageWallAvailability;
			break;
		case "StageFloor":
			availability = TheaterManager.stageFloorAvailability;
			break;
		case "Ceiling":
			availability = TheaterManager.ceilingAvailability;
			break;
		case "TheaterWall":
			availability = TheaterManager.theaterWallAvailability;
			break;
		case "TheaterFloor":
			availability = TheaterManager.theaterFloorAvailability;
			break;
		case "Curtain":
			availability = TheaterManager.curtainAvailability;
			break;
		case "Chairs":
			availability = TheaterManager.chairsAvailability;
			break;
		case "FOHWall":
			availability = TheaterManager.FOHWallAvailability;
			break;
		case "FOHFloor":
			availability = TheaterManager.FOHFloorAvailability;
			break;
		case "FOHBooze":
			availability = TheaterManager.FOHBoozeAvailability;
			break;
		case "FOHTicketBooth":
			availability = TheaterManager.FOHTicketBoothAvailability;
			break;
		case "FOHDesk":
			availability = TheaterManager.FOHDeskAvailability;
			break;
		default:
			break;
	}
}