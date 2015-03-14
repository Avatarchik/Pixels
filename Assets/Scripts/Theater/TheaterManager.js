#pragma strict

// Piece holder.
var theaterHolder:GameObject;
var FOHHolder:GameObject;

// Current theater pieces.
private var currentStageWall:GameObject;
private var currentStageFloor:GameObject;
private var currentCeiling:GameObject;
private var currentTheaterWall:GameObject;
private var currentTheaterFloor:GameObject;
private var currentCurtain:GameObject;
private var currentChairs:GameObject;

// Current FOH pieces.
private var currentFOHWall:GameObject;
private var currentFOHFloor:GameObject;
private var currentFOHBooze:GameObject;
private var currentFOHTicketBooth:GameObject;
private var currentFOHDesk:GameObject;
private var currentledger:GameObject;

// Arrays with different types of theater sprites.
var stageWall:GameObject[];
var stageFloor:GameObject[];
var ceiling:GameObject[];
var theaterWall:GameObject[];
var theaterFloor:GameObject[];
var curtain:GameObject[];
var chairs:GameObject[];

// Arrays with different types of FOH sprites.
var FOHWall:GameObject[];
var FOHFloor:GameObject[];
var FOHBooze:GameObject[];
var FOHTicketBooth:GameObject[];
var FOHDesk:GameObject[];

// Theater availability arrays.
static var stageWallAvailability:boolean[];
static var stageFloorAvailability:boolean[];
static var ceilingAvailability:boolean[];
static var theaterWallAvailability:boolean[];
static var theaterFloorAvailability:boolean[];
static var curtainAvailability:boolean[];
static var chairsAvailability:boolean[];

// FOH availability arrays.
static var FOHWallAvailability:boolean[];
static var FOHFloorAvailability:boolean[];
static var FOHBoozeAvailability:boolean[];
static var FOHTicketBoothAvailability:boolean[];
static var FOHDeskAvailability:boolean[];

function Start () {
	// Lock of unlock all pieces, and activate availability.
	UpdateAvailability();
	UnlockAllOptions();
	LockAllOptions();
	UpdateAvailability();
	
	// Create all pieces.
	currentStageWall = Instantiate(stageWall[PlayerPrefs.GetInt("StageWallSelection")]);
	currentStageFloor = Instantiate(stageFloor[PlayerPrefs.GetInt("StageFloorSelection")]);
	currentCeiling = Instantiate(ceiling[PlayerPrefs.GetInt("CeilingSelection")]);
	currentTheaterWall = Instantiate(theaterWall[PlayerPrefs.GetInt("TheaterWallSelection")]);
	currentTheaterFloor = Instantiate(theaterFloor[PlayerPrefs.GetInt("TheaterFloorSelection")]);
	currentCurtain = Instantiate(curtain[PlayerPrefs.GetInt("CurtainSelection")]);
	currentChairs = Instantiate(chairs[PlayerPrefs.GetInt("ChairsSelection")]);

	currentFOHWall = Instantiate(FOHWall[PlayerPrefs.GetInt("FOHWallSelection")]);
	currentFOHFloor = Instantiate(FOHFloor[PlayerPrefs.GetInt("FOHFloorSelection")]);
	currentFOHBooze = Instantiate(FOHBooze[PlayerPrefs.GetInt("FOHBoozeSelection")]);
	currentFOHTicketBooth = Instantiate(FOHTicketBooth[PlayerPrefs.GetInt("FOHTicketBoothSelection")]);
	currentFOHDesk = Instantiate(FOHDesk[PlayerPrefs.GetInt("FOHDeskSelection")]);
	
	// Set all pieces as children of the Theater Holder.
	currentStageWall.transform.parent = theaterHolder.transform;
	currentStageFloor.transform.parent = theaterHolder.transform;
	currentCeiling.transform.parent = theaterHolder.transform;
	currentTheaterWall.transform.parent = theaterHolder.transform;
	currentTheaterFloor.transform.parent = theaterHolder.transform;
	currentCurtain.transform.parent = theaterHolder.transform;
	currentChairs.transform.parent = theaterHolder.transform;

	currentFOHWall.transform.parent = FOHHolder.transform;
	currentFOHFloor.transform.parent = FOHHolder.transform;
	currentFOHBooze.transform.parent = FOHHolder.transform;
	currentFOHTicketBooth.transform.parent = FOHHolder.transform;
	currentFOHDesk.transform.parent = FOHHolder.transform;
	
	// Name all objects for clarity.
	currentStageWall.transform.name = "StageWall";
	currentStageFloor.transform.name = "StageFloor";
	currentCeiling.transform.name = "Ceiling";
	currentTheaterWall.transform.name = "TheaterWall";
	currentTheaterFloor.transform.name = "TheaterFloor";
	currentCurtain.transform.name = "Curtain";
	currentChairs.transform.name = "Chairs";

	currentFOHWall.transform.name = "FOHWall";
	currentFOHFloor.transform.name = "FOHFloor";
	currentFOHBooze.transform.name = "FOHBooze";
	currentFOHTicketBooth.transform.name = "FOHTicketBooth";
	currentFOHDesk.transform.name = "FOHDesk";
	
	// Set object positions.
	currentStageWall.transform.localPosition = Vector3(-3.3,3.3,10);
	currentStageFloor.transform.localPosition = Vector3(-3.3,-15.9,10);
	currentCeiling.transform.localPosition = Vector3(-1.8,3.3,8);
	currentTheaterWall.transform.localPosition = Vector3(-1.8,3.3,8);
	currentTheaterFloor.transform.localPosition = Vector3(-1.8,-15.9,8);
	currentCurtain.transform.localPosition = Vector3(-3.3,3.3,7);
	currentChairs.transform.localPosition = Vector3(-3.3,-15.9,7);

	currentFOHWall.transform.localPosition = Vector3(35.1,0.3,10);
	currentFOHFloor.transform.localPosition = Vector3(35.1,-15.9,9);
	currentFOHBooze.transform.localPosition = Vector3(25.5,3.9,9);
	currentFOHTicketBooth.transform.localPosition = Vector3(36.07,0.3,8);
	currentFOHDesk.transform.localPosition = Vector3(25.5,-6.45,7);
	
}
function ChangePartSpecific (part:String, change:int) {
	// The function to call when you want to change a part by any amount. This is the main function to be called from external scripts.
	switch(part)
	{
		case "StageWall":
			Debug.Log(change);
			PlayerPrefs.SetInt("StageWallSelection",change);
			Debug.Log(PlayerPrefs.GetInt("StageWallSelection"));
			break;
		case "StageFloor":
			PlayerPrefs.SetInt("StageFloorSelection",change);
			break;
		case "Ceiling":
			PlayerPrefs.SetInt("CeilingSelection",change);
			break;
		case "TheaterWall":
			PlayerPrefs.SetInt("TheaterWallSelection",change);
			break;
		case "TheaterFloor":
			PlayerPrefs.SetInt("TheaterFloorSelection",change);
			break;
		case "Curtain":
			PlayerPrefs.SetInt("CurtainSelection",change);
			break;
		case "Chairs":
			PlayerPrefs.SetInt("ChairsSelection",change);
			break;
		case "FOHWall":
			PlayerPrefs.SetInt("FOHWallSelection",change);
			break;
		case "FOHFloor":
			PlayerPrefs.SetInt("FOHFloorSelection",change);
			break;
		case "FOHBooze":
			PlayerPrefs.SetInt("FOHBoozeSelection",change);
			break;
		case "FOHTicketBooth":
			PlayerPrefs.SetInt("FOHTicketBoothSelection",change);
			break;
		case "FOHDesk":
			PlayerPrefs.SetInt("FOHDeskSelection",change);
			break;
		default:
			break;
	}
	Refresh(part,change);
}

function ChangePart (part:String, change:int) {
	// The function to call when you want to change a part by any amount. This is the main function to be called from external scripts.
	switch(part)
	{
		case "StageWall":
			PlayerPrefs.SetInt("StageWallSelection",PlayerPrefs.GetInt("StageWallSelection") + change);
			break;
		case "StageFloor":
			PlayerPrefs.SetInt("StageFloorSelection",PlayerPrefs.GetInt("StageFloorSelection") + change);
			break;
		case "Ceiling":
			PlayerPrefs.SetInt("CeilingSelection",PlayerPrefs.GetInt("CeilingSelection") + change);
			break;
		case "TheaterWall":
			PlayerPrefs.SetInt("TheaterWallSelection",PlayerPrefs.GetInt("TheaterWallSelection") + change);
			break;
		case "TheaterFloor":
			PlayerPrefs.SetInt("TheaterFloorSelection",PlayerPrefs.GetInt("TheaterFloorSelection") + change);
			break;
		case "Curtain":
			PlayerPrefs.SetInt("CurtainSelection",PlayerPrefs.GetInt("CurtainSelection") + change);
			break;
		case "Chairs":
			PlayerPrefs.SetInt("ChairsSelection",PlayerPrefs.GetInt("ChairsSelection") + change);
			break;
		case "FOHWall":
			PlayerPrefs.SetInt("FOHWallSelection",PlayerPrefs.GetInt("FOHWallSelection") + change);
			break;
		case "FOHFloor":
			PlayerPrefs.SetInt("FOHFloorSelection",PlayerPrefs.GetInt("FOHFloorSelection") + change);
			break;
		case "FOHBooze":
			PlayerPrefs.SetInt("FOHBoozeSelection",PlayerPrefs.GetInt("FOHBoozeSelection") + change);
			break;
		case "FOHTicketBooth":
			PlayerPrefs.SetInt("FOHTicketBoothSelection",PlayerPrefs.GetInt("FOHTicketBoothSelection") + change);
			break;
		case "FOHDesk":
			PlayerPrefs.SetInt("FOHDeskSelection",PlayerPrefs.GetInt("FOHDeskSelection") + change);
			break;
		default:
			break;
	}
	Refresh(part,change);
}

function Refresh(part:String) {
	// Calls refresh when no change amount is designated.
	Refresh(part,0);
}
function Refresh(part:String, change:int) {
	// Updates the visuals based on which piece is selected. Also determines whether or not a piece is currently unlocked, and removes that piece from use if it is not.
	switch(part)
	{
		case "StageWall":
			Destroy(currentStageWall);
			if(PlayerPrefs.GetInt("StageWallSelection") >= stageWall.Length)
			{
				PlayerPrefs.SetInt("StageWallSelection", 0);
			}
			else if(PlayerPrefs.GetInt("StageWallSelection") < 0)
			{
				PlayerPrefs.SetInt("StageWallSelection", stageWall.Length-1);
			}
			currentStageWall = Instantiate(stageWall[PlayerPrefs.GetInt("StageWallSelection")]);
			currentStageWall.transform.parent = theaterHolder.transform;
			currentStageWall.transform.localPosition = Vector3(-3.3,3.3,10);
			currentStageWall.transform.name = "StageWall";
			if(stageWallAvailability[PlayerPrefs.GetInt("StageWallSelection")]==false)
			{
				ChangePart("StageWall",change);
			}
			break;
		case "StageFloor":
			Destroy(currentStageFloor);
			if(PlayerPrefs.GetInt("StageFloorSelection") >= stageFloor.Length)
			{
				PlayerPrefs.SetInt("StageFloorSelection", 0);
			}
			else if(PlayerPrefs.GetInt("StageFloorSelection") < 0)
			{
				PlayerPrefs.SetInt("StageFloorSelection", stageFloor.Length-1);
			}
			currentStageFloor = Instantiate(stageFloor[PlayerPrefs.GetInt("StageFloorSelection")]);
			currentStageFloor.transform.parent = theaterHolder.transform;
			currentStageFloor.transform.localPosition = Vector3(-3.3,-15.9,10);
			currentStageFloor.transform.name = "StageFloor";
			if(stageFloorAvailability[PlayerPrefs.GetInt("StageFloorSelection")]==false)
			{
				ChangePart("StageFloor",change);
			}
			break;
		case "Ceiling":
			Destroy(currentCeiling);
			if(PlayerPrefs.GetInt("CeilingSelection") >= ceiling.Length)
			{
				PlayerPrefs.SetInt("CeilingSelection", 0);
			}
			else if(PlayerPrefs.GetInt("CeilingSelection") < 0)
			{
				PlayerPrefs.SetInt("CeilingSelection", ceiling.Length-1);
			}
			currentCeiling = Instantiate(ceiling[PlayerPrefs.GetInt("CeilingSelection")]);
			currentCeiling.transform.parent = theaterHolder.transform;
			currentCeiling.transform.localPosition = Vector3(-1.8,3.3,8);
			currentCeiling.transform.name = "Ceiling";
			if(ceilingAvailability[PlayerPrefs.GetInt("CeilingSelection")]==false)
			{
				ChangePart("Ceiling",change);
			}
			break;
		case "TheaterWall":
			
			Destroy(currentTheaterWall);
			if(PlayerPrefs.GetInt("TheaterWallSelection") >= theaterWall.Length)
			{
				PlayerPrefs.SetInt("TheaterWallSelection", 0);
			}
			else if(PlayerPrefs.GetInt("TheaterWallSelection") < 0)
			{
				PlayerPrefs.SetInt("TheaterWallSelection", theaterWall.Length-1);
			}
			currentTheaterWall = Instantiate(theaterWall[PlayerPrefs.GetInt("TheaterWallSelection")]);
			currentTheaterWall.transform.parent = theaterHolder.transform;
			currentTheaterWall.transform.localPosition = Vector3(-1.8,3.3,8);
			currentTheaterWall.transform.name = "TheaterWall";
			if(theaterWallAvailability[PlayerPrefs.GetInt("TheaterWallSelection")]==false)
			{
				ChangePart("TheaterWall",change);
			}
			break;
		case "TheaterFloor":
			Destroy(currentTheaterFloor);
			if(PlayerPrefs.GetInt("TheaterFloorSelection") >= theaterFloor.Length)
			{
				PlayerPrefs.SetInt("TheaterFloorSelection", 0);
			}
			else if(PlayerPrefs.GetInt("TheaterFloorSelection") < 0)
			{
				PlayerPrefs.SetInt("TheaterFloorSelection", theaterFloor.Length-1);
			}
			currentTheaterFloor = Instantiate(theaterFloor[PlayerPrefs.GetInt("TheaterFloorSelection")]);
			currentTheaterFloor.transform.parent = theaterHolder.transform;
			currentTheaterFloor.transform.localPosition = Vector3(-1.8,-15.9,8);
			currentTheaterFloor.transform.name = "TheaterFloor";
			if(theaterFloorAvailability[PlayerPrefs.GetInt("TheaterFloorSelection")]==false)
			{
				ChangePart("TheaterFloor",change);
			}
			break;
		case "Curtain":
			Destroy(currentCurtain);
			if(PlayerPrefs.GetInt("CurtainSelection") >= curtain.Length)
			{
				PlayerPrefs.SetInt("CurtainSelection", 0);
			}
			else if(PlayerPrefs.GetInt("CurtainSelection") < 0)
			{
				PlayerPrefs.SetInt("CurtainSelection", curtain.Length-1);
			}
			currentCurtain = Instantiate(curtain[PlayerPrefs.GetInt("CurtainSelection")]);
			currentCurtain.transform.parent = theaterHolder.transform;
			currentCurtain.transform.localPosition = Vector3(-3.3,3.3,7);
			currentCurtain.transform.name = "Curtain";
			if(curtainAvailability[PlayerPrefs.GetInt("CurtainSelection")]==false)
			{
				ChangePart("Curtain",change);
			}
			break;
		case "Chairs":
			Destroy(currentChairs);
			if(PlayerPrefs.GetInt("ChairsSelection") >= chairs.Length)
			{
				PlayerPrefs.SetInt("ChairsSelection", 0);
			}
			else if(PlayerPrefs.GetInt("ChairsSelection") < 0)
			{
				PlayerPrefs.SetInt("ChairsSelection", chairs.Length-1);
			}
			currentChairs = Instantiate(chairs[PlayerPrefs.GetInt("ChairsSelection")]);
			currentChairs.transform.parent = theaterHolder.transform;
			currentChairs.transform.localPosition = Vector3(-3.3,-15.9,7);
			currentChairs.transform.name = "Chairs";
			if(chairsAvailability[PlayerPrefs.GetInt("ChairsSelection")]==false)
			{
				ChangePart("Chairs",change);
			}
			break;
		case "FOHWall":
			Destroy(currentFOHWall);
			if(PlayerPrefs.GetInt("FOHWallSelection") >= FOHWall.Length)
			{
				PlayerPrefs.SetInt("FOHWallSelection", 0);
			}
			else if(PlayerPrefs.GetInt("FOHWallSelection") < 0)
			{
				PlayerPrefs.SetInt("FOHWallSelection", FOHWall.Length-1);
			}
			currentFOHWall = Instantiate(FOHWall[PlayerPrefs.GetInt("FOHWallSelection")]);
			currentFOHWall.transform.parent = FOHHolder.transform;
			currentFOHWall.transform.localPosition = Vector3(35.1,0.3,10);
			currentFOHWall.transform.name = "FOHWall";
			if(FOHWallAvailability[PlayerPrefs.GetInt("FOHWallSelection")]==false)
			{
				ChangePart("FOHWall",change);
			}
			break;
		case "FOHFloor":
			Destroy(currentFOHFloor);
			if(PlayerPrefs.GetInt("FOHFloorSelection") >= FOHFloor.Length)
			{
				PlayerPrefs.SetInt("FOHFloorSelection", 0);
			}
			else if(PlayerPrefs.GetInt("FOHFloorSelection") < 0)
			{
				PlayerPrefs.SetInt("FOHFloorSelection", FOHFloor.Length-1);
			}
			currentFOHFloor = Instantiate(FOHFloor[PlayerPrefs.GetInt("FOHFloorSelection")]);
			currentFOHFloor.transform.parent = FOHHolder.transform;
			currentFOHFloor.transform.localPosition = Vector3(35.1,-15.9,10);
			currentFOHFloor.transform.name = "FOHFloor";
			if(FOHFloorAvailability[PlayerPrefs.GetInt("FOHFloorSelection")]==false)
			{
				ChangePart("FOHFloor",change);
			}
			break;
		case "FOHBooze":
			Destroy(currentFOHBooze);
			if(PlayerPrefs.GetInt("FOHBoozeSelection") >= FOHBooze.Length)
			{
				PlayerPrefs.SetInt("FOHBoozeSelection", 0);
			}
			else if(PlayerPrefs.GetInt("FOHBoozeSelection") < 0)
			{
				PlayerPrefs.SetInt("FOHBoozeSelection", FOHBooze.Length-1);
			}
			currentFOHBooze = Instantiate(FOHBooze[PlayerPrefs.GetInt("FOHBoozeSelection")]);
			currentFOHBooze.transform.parent = FOHHolder.transform;
			currentFOHBooze.transform.localPosition = Vector3(25.5,3.9,9);
			currentFOHBooze.transform.name = "FOHBooze";
			if(FOHBoozeAvailability[PlayerPrefs.GetInt("FOHBoozeSelection")]==false)
			{
				ChangePart("FOHBooze",change);
			}
			break;
		case "FOHTicketBooth":
			Destroy(currentFOHTicketBooth);
			if(PlayerPrefs.GetInt("FOHTicketBoothSelection") >= FOHTicketBooth.Length)
			{
				PlayerPrefs.SetInt("FOHTicketBoothSelection", 0);
			}
			else if(PlayerPrefs.GetInt("FOHTicketBoothSelection") < 0)
			{
				PlayerPrefs.SetInt("FOHTicketBoothSelection", FOHTicketBooth.Length-1);
			}
			currentFOHTicketBooth = Instantiate(FOHTicketBooth[PlayerPrefs.GetInt("FOHTicketBoothSelection")]);
			currentFOHTicketBooth.transform.parent = FOHHolder.transform;
			currentFOHTicketBooth.transform.localPosition = Vector3(36.07,0.3,8);
			currentFOHTicketBooth.transform.name = "FOHTicketBooth";
			if(FOHTicketBoothAvailability[PlayerPrefs.GetInt("FOHTicketBoothSelection")]==false)
			{
				ChangePart("FOHTicketBooth",change);
			}
			break;
		case "FOHDesk":
			Destroy(currentFOHDesk);
			if(PlayerPrefs.GetInt("FOHDeskSelection") >= FOHDesk.Length)
			{
				PlayerPrefs.SetInt("FOHDeskSelection", 0);
			}
			else if(PlayerPrefs.GetInt("FOHDeskSelection") < 0)
			{
				PlayerPrefs.SetInt("FOHDeskSelection", FOHDesk.Length-1);
			}
			currentFOHDesk = Instantiate(FOHDesk[PlayerPrefs.GetInt("FOHDeskSelection")]);
			currentFOHDesk.transform.parent = FOHHolder.transform;
			currentFOHDesk.transform.localPosition = Vector3(25.5,-6.45,7);
			currentFOHDesk.transform.name = "FOHDesk";
			if(FOHDeskAvailability[PlayerPrefs.GetInt("FOHDeskSelection")]==false)
			{
				ChangePart("FOHDesk",change);
			}
			break;
		default:
			break;
	}
}

function UpdateAvailability () {
	// Sets the availability of pieces based on PlayerPrefs.
	stageWallAvailability = new boolean[stageWall.length + 1];
	stageFloorAvailability = new boolean[stageFloor.length + 1];
	ceilingAvailability = new boolean[ceiling.length + 1];
	theaterWallAvailability = new boolean[theaterWall.length + 1];
	theaterFloorAvailability = new boolean[theaterFloor.length + 1];
	curtainAvailability = new boolean[curtain.length + 1];
	chairsAvailability = new boolean[chairs.length + 1];
	FOHWallAvailability = new boolean[FOHWall.length + 1];
	FOHFloorAvailability = new boolean[FOHFloor.length + 1];
	FOHBoozeAvailability = new boolean[FOHBooze.length + 1];
	FOHTicketBoothAvailability = new boolean[FOHTicketBooth.length + 1];
	FOHDeskAvailability = new boolean[FOHDesk.length + 1];
	
	// Checks whether or not these keys exist and, if they don't, sets them to zero.
	for(var stageWallPiece:GameObject in stageWall)
	{
		if(!PlayerPrefs.HasKey("StageWall:"+stageWallPiece.transform.name))
		{
			PlayerPrefs.SetInt("StageWall:"+stageWallPiece.transform.name,0);
		}
	}
	for(var stageFloorPiece:GameObject in stageFloor)
	{
		if(!PlayerPrefs.HasKey("StageFloor:"+stageFloorPiece.transform.name))
		{
			PlayerPrefs.SetInt("StageFloor:"+stageFloorPiece.transform.name,0);
		}
	}
	for(var ceilingPiece:GameObject in ceiling)
	{
		if(!PlayerPrefs.HasKey("Ceiling:"+ceilingPiece.transform.name))
		{
			PlayerPrefs.SetInt("Ceiling:"+ceilingPiece.transform.name,0);
		}
	}
	for(var theaterWallPiece:GameObject in theaterWall)
	{
		if(!PlayerPrefs.HasKey("TheaterWall:"+theaterWallPiece.transform.name))
		{
			PlayerPrefs.SetInt("TheaterWall:"+theaterWallPiece.transform.name,0);
		}
	}
	for(var theaterFloorPiece:GameObject in theaterFloor)
	{
		if(!PlayerPrefs.HasKey("TheaterFloor:"+theaterFloorPiece.transform.name))
		{
			PlayerPrefs.SetInt("TheaterFloor:"+theaterFloorPiece.transform.name,0);
		}
	}
	for(var curtainPiece:GameObject in curtain)
	{
		if(!PlayerPrefs.HasKey("Curtain:"+curtainPiece.transform.name))
		{
			PlayerPrefs.SetInt("Curtain:"+curtainPiece.transform.name,0);
		}
	}
	for(var chairsPiece:GameObject in chairs)
	{
		if(!PlayerPrefs.HasKey("Chairs:"+chairsPiece.transform.name))
		{
			PlayerPrefs.SetInt("Chairs:"+chairsPiece.transform.name,0);
		}
	}
	for(var FOHWallPiece:GameObject in FOHWall)
	{
		if(!PlayerPrefs.HasKey("FOHWall:"+FOHWallPiece.transform.name))
		{
			PlayerPrefs.SetInt("FOHWall:"+FOHWallPiece.transform.name,0);
		}
	}
	for(var FOHFloorPiece:GameObject in FOHFloor)
	{
		if(!PlayerPrefs.HasKey("FOHFloor:"+FOHFloorPiece.transform.name))
		{
			PlayerPrefs.SetInt("FOHFloor:"+FOHFloorPiece.transform.name,0);
		}
	}
	for(var FOHBoozePiece:GameObject in FOHBooze)
	{
		if(!PlayerPrefs.HasKey("FOHBooze:"+FOHBoozePiece.transform.name))
		{
			PlayerPrefs.SetInt("FOHBooze:"+FOHBoozePiece.transform.name,0);
		}
	}
	for(var FOHTicketBoothPiece:GameObject in FOHTicketBooth)
	{
		if(!PlayerPrefs.HasKey("FOHTicketBooth:"+FOHTicketBoothPiece.transform.name))
		{
			PlayerPrefs.SetInt("FOHTicketBooth:"+FOHTicketBoothPiece.transform.name,0);
		}
	}
	for(var FOHDeskPiece:GameObject in FOHDesk)
	{
		if(!PlayerPrefs.HasKey("FOHDesk:"+FOHDeskPiece.transform.name))
		{
			PlayerPrefs.SetInt("FOHDesk:"+FOHDeskPiece.transform.name,0);
		}
	}
	// Unlocks the first of each set, so that we don't run into any problems where no pieces are drawable.
	PlayerPrefs.SetInt("StageWall:"+stageWall[0].name,1);
	PlayerPrefs.SetInt("StageFloor:"+stageFloor[0].name,1);
	PlayerPrefs.SetInt("Ceiling:"+ceiling[0].name,1);
	PlayerPrefs.SetInt("TheaterWall:"+theaterWall[0].name,1);
	PlayerPrefs.SetInt("TheaterFloor:"+theaterFloor[0].name,1);
	PlayerPrefs.SetInt("Curtain:"+curtain[0].name,1);
	PlayerPrefs.SetInt("Chairs:"+chairs[0].name,1);
	PlayerPrefs.SetInt("FOHWall:"+FOHWall[0].name,1);
	PlayerPrefs.SetInt("FOHFloor:"+FOHFloor[0].name,1);
	PlayerPrefs.SetInt("FOHBooze:"+FOHBooze[0].name,1);
	PlayerPrefs.SetInt("FOHTicketBooth:"+FOHTicketBooth[0].name,1);
	PlayerPrefs.SetInt("FOHDesk:"+FOHDesk[0].name,1);
	
	// Changes availability booleans to true or false based on the playerprefs values.
	for(var stageWallCheck:int = 0; stageWallCheck < stageWall.length; stageWallCheck++)
	{
		if(PlayerPrefs.GetInt("StageWall:"+stageWall[stageWallCheck].transform.name) == 0)
		{
			stageWallAvailability[stageWallCheck] = false;
		}
		else
		{
			stageWallAvailability[stageWallCheck] = true;
		}
	}
	for(var stageFloorCheck:int = 0; stageFloorCheck < stageFloor.length; stageFloorCheck++)
	{
		if(PlayerPrefs.GetInt("StageFloor:"+stageFloor[stageFloorCheck].transform.name) == 0)
		{
			stageFloorAvailability[stageFloorCheck] = false;
		}
		else
		{
			stageFloorAvailability[stageFloorCheck] = true;
		}
	}
	for(var ceilingCheck:int = 0; ceilingCheck < ceiling.length; ceilingCheck++)
	{
		if(PlayerPrefs.GetInt("Ceiling:"+ceiling[ceilingCheck].transform.name) == 0)
		{
			ceilingAvailability[ceilingCheck] = false;
		}
		else
		{
			ceilingAvailability[ceilingCheck] = true;
		}
	}
	for(var theaterWallCheck:int = 0; theaterWallCheck < theaterWall.length; theaterWallCheck++)
	{
		if(PlayerPrefs.GetInt("TheaterWall:"+theaterWall[theaterWallCheck].transform.name) == 0)
		{
			theaterWallAvailability[theaterWallCheck] = false;
		}
		else
		{
			theaterWallAvailability[theaterWallCheck] = true;
		}
	}
	for(var theaterFloorCheck:int = 0; theaterFloorCheck < theaterFloor.length; theaterFloorCheck++)
	{
		if(PlayerPrefs.GetInt("TheaterFloor:"+theaterFloor[theaterFloorCheck].transform.name) == 0)
		{
			theaterFloorAvailability[theaterFloorCheck] = false;
		}
		else
		{
			theaterFloorAvailability[theaterFloorCheck] = true;
		}
	}
	for(var curtainCheck:int = 0; curtainCheck < curtain.length; curtainCheck++)
	{
		if(PlayerPrefs.GetInt("Curtain:"+curtain[curtainCheck].transform.name) == 0)
		{
			curtainAvailability[curtainCheck] = false;
		}
		else
		{
			curtainAvailability[curtainCheck] = true;
		}
	}
	for(var chairsCheck:int = 0; chairsCheck < chairs.length; chairsCheck++)
	{
		if(PlayerPrefs.GetInt("Chairs:"+chairs[chairsCheck].transform.name) == 0)
		{
			chairsAvailability[chairsCheck] = false;
		}
		else
		{
			chairsAvailability[chairsCheck] = true;
		}
	}
	for(var FOHWallCheck:int = 0; FOHWallCheck < FOHWall.length; FOHWallCheck++)
	{
		if(PlayerPrefs.GetInt("FOHWall:"+FOHWall[FOHWallCheck].transform.name) == 0)
		{
			FOHWallAvailability[FOHWallCheck] = false;
		}
		else
		{
			FOHWallAvailability[FOHWallCheck] = true;
		}
	}
	for(var FOHFloorCheck:int = 0; FOHFloorCheck < FOHFloor.length; FOHFloorCheck++)
	{
		if(PlayerPrefs.GetInt("FOHFloor:"+FOHFloor[FOHFloorCheck].transform.name) == 0)
		{
			FOHFloorAvailability[FOHFloorCheck] = false;
		}
		else
		{
			FOHFloorAvailability[FOHFloorCheck] = true;
		}
	}
	for(var FOHBoozeCheck:int = 0; FOHBoozeCheck < FOHBooze.length; FOHBoozeCheck++)
	{
		if(PlayerPrefs.GetInt("FOHBooze:"+FOHBooze[FOHBoozeCheck].transform.name) == 0)
		{
			FOHBoozeAvailability[FOHBoozeCheck] = false;
		}
		else
		{
			FOHBoozeAvailability[FOHBoozeCheck] = true;
		}
	}
	for(var FOHTicketBoothCheck:int = 0; FOHTicketBoothCheck < FOHTicketBooth.length; FOHTicketBoothCheck++)
	{
		if(PlayerPrefs.GetInt("FOHTicketBooth:"+FOHTicketBooth[FOHTicketBoothCheck].transform.name) == 0)
		{
			FOHTicketBoothAvailability[FOHTicketBoothCheck] = false;
		}
		else
		{
			FOHTicketBoothAvailability[FOHTicketBoothCheck] = true;
		}
	}
	for(var FOHDeskCheck:int = 0; FOHDeskCheck < FOHDesk.length; FOHDeskCheck++)
	{
		if(PlayerPrefs.GetInt("FOHDesk:"+FOHDesk[FOHDeskCheck].transform.name) == 0)
		{
			FOHDeskAvailability[FOHDeskCheck] = false;
		}
		else
		{
			FOHDeskAvailability[FOHDeskCheck] = true;
		}
	}
}	

function UnlockAllOptions () {
	// Unlocks all pieces, considered an override.
	for(var stageWallPiece:GameObject in stageWall)
	{
		PlayerPrefs.SetInt("StageWall:"+stageWallPiece.transform.name,1);
	}
	for(var stageFloorPiece:GameObject in stageFloor)
	{
		PlayerPrefs.SetInt("StageFloor:"+stageFloorPiece.transform.name,1);
	}
	for(var ceilingPiece:GameObject in ceiling)
	{
		PlayerPrefs.SetInt("Ceiling:"+ceilingPiece.transform.name,1);
	}
	for(var theaterWallPiece:GameObject in theaterWall)
	{
		PlayerPrefs.SetInt("TheaterWall:"+theaterWallPiece.transform.name,1);
	}
	for(var theaterFloorPiece:GameObject in theaterFloor)
	{
		PlayerPrefs.SetInt("TheaterFloor:"+theaterFloorPiece.transform.name,1);
	}
	for(var curtainPiece:GameObject in curtain)
	{
		PlayerPrefs.SetInt("Curtain:"+curtainPiece.transform.name,1);
	}
	for(var chairsPiece:GameObject in chairs)
	{
		PlayerPrefs.SetInt("Chairs:"+chairsPiece.transform.name,1);
	}
	for(var FOHWallPiece:GameObject in FOHWall)
	{
		PlayerPrefs.SetInt("FOHWall:"+FOHWallPiece.transform.name,1);
	}
	for(var FOHFloorPiece:GameObject in FOHFloor)
	{
		PlayerPrefs.SetInt("FOHFloor:"+FOHFloorPiece.transform.name,1);
	}
	for(var FOHBoozePiece:GameObject in FOHBooze)
	{
		PlayerPrefs.SetInt("FOHBooze:"+FOHBoozePiece.transform.name,1);
	}
	for(var FOHTicketBoothPiece:GameObject in FOHTicketBooth)
	{
		PlayerPrefs.SetInt("FOHTicketBooth:"+FOHTicketBoothPiece.transform.name,1);
	}
	for(var FOHDeskPiece:GameObject in FOHDesk)
	{
		PlayerPrefs.SetInt("FOHDesk:"+FOHDeskPiece.transform.name,1);
	}
}
function LockAllOptions () {
	// Locks all pieces, considered an override. Also unlocks the first of each piece type.
	for(var stageWallPiece:GameObject in stageWall)
	{
		PlayerPrefs.SetInt("StageWall:"+stageWallPiece.transform.name,0);
	}
	for(var stageFloorPiece:GameObject in stageFloor)
	{
		PlayerPrefs.SetInt("StageFloor:"+stageFloorPiece.transform.name,0);
	}
	for(var ceilingPiece:GameObject in ceiling)
	{
		PlayerPrefs.SetInt("Ceiling:"+ceilingPiece.transform.name,0);
	}
	for(var theaterWallPiece:GameObject in theaterWall)
	{
		PlayerPrefs.SetInt("TheaterWall:"+theaterWallPiece.transform.name,0);
	}
	for(var theaterFloorPiece:GameObject in theaterFloor)
	{
		PlayerPrefs.SetInt("TheaterFloor:"+theaterFloorPiece.transform.name,0);
	}
	for(var curtainPiece:GameObject in curtain)
	{
		PlayerPrefs.SetInt("Curtain:"+curtainPiece.transform.name,0);
	}
	for(var chairsPiece:GameObject in chairs)
	{
		PlayerPrefs.SetInt("Chairs:"+chairsPiece.transform.name,0);
	}
	for(var FOHWallPiece:GameObject in FOHWall)
	{
		PlayerPrefs.SetInt("FOHWall:"+FOHWallPiece.transform.name,0);
	}
	for(var FOHFloorPiece:GameObject in FOHFloor)
	{
		PlayerPrefs.SetInt("FOHFloor:"+FOHFloorPiece.transform.name,0);
	}
	for(var FOHBoozePiece:GameObject in FOHBooze)
	{
		PlayerPrefs.SetInt("FOHBooze:"+FOHBoozePiece.transform.name,0);
	}
	for(var FOHTicketBoothPiece:GameObject in FOHTicketBooth)
	{
		PlayerPrefs.SetInt("FOHTicketBooth:"+FOHTicketBoothPiece.transform.name,0);
	}
	for(var FOHDeskPiece:GameObject in FOHDesk)
	{
		PlayerPrefs.SetInt("FOHDesk:"+FOHDeskPiece.transform.name,0);
	}
	PlayerPrefs.SetInt("StageWall:"+stageWall[0].name,1);
	PlayerPrefs.SetInt("StageFloor:"+stageFloor[0].name,1);
	PlayerPrefs.SetInt("Ceiling:"+ceiling[0].name,1);
	PlayerPrefs.SetInt("TheaterWall:"+theaterWall[0].name,1);
	PlayerPrefs.SetInt("TheaterFloor:"+theaterFloor[0].name,1);
	PlayerPrefs.SetInt("Curtain:"+curtain[0].name,1);
	PlayerPrefs.SetInt("Chairs:"+chairs[0].name,1);
	PlayerPrefs.SetInt("FOHWall:"+FOHWall[0].name,1);
	PlayerPrefs.SetInt("FOHFloor:"+FOHFloor[0].name,1);
	PlayerPrefs.SetInt("FOHBooze:"+FOHBooze[0].name,1);
	PlayerPrefs.SetInt("FOHTicketBooth:"+FOHTicketBooth[0].name,1);
	PlayerPrefs.SetInt("FOHDesk:"+FOHDesk[0].name,1);
	
	PlayerPrefs.SetInt("StageWall:"+stageWall[1].name,1);
	PlayerPrefs.SetInt("StageFloor:"+stageFloor[1].name,1);
	PlayerPrefs.SetInt("Ceiling:"+ceiling[1].name,1);
	PlayerPrefs.SetInt("TheaterWall:"+theaterWall[1].name,1);
	PlayerPrefs.SetInt("TheaterFloor:"+theaterFloor[1].name,1);
	PlayerPrefs.SetInt("Curtain:"+curtain[1].name,1);
	PlayerPrefs.SetInt("Chairs:"+chairs[1].name,1);
	PlayerPrefs.SetInt("FOHWall:"+FOHWall[1].name,1);
	PlayerPrefs.SetInt("FOHFloor:"+FOHFloor[1].name,1);
	PlayerPrefs.SetInt("FOHBooze:"+FOHBooze[1].name,1);
	PlayerPrefs.SetInt("FOHTicketBooth:"+FOHTicketBooth[1].name,1);
	PlayerPrefs.SetInt("FOHDesk:"+FOHDesk[1].name,1);
	
	PlayerPrefs.SetInt("StageWall:"+stageWall[2].name,1);
	PlayerPrefs.SetInt("StageFloor:"+stageFloor[2].name,1);
	PlayerPrefs.SetInt("Ceiling:"+ceiling[2].name,1);
	PlayerPrefs.SetInt("TheaterWall:"+theaterWall[2].name,1);
	PlayerPrefs.SetInt("TheaterFloor:"+theaterFloor[2].name,1);
	PlayerPrefs.SetInt("Curtain:"+curtain[2].name,1);
	PlayerPrefs.SetInt("Chairs:"+chairs[2].name,1);
	PlayerPrefs.SetInt("FOHWall:"+FOHWall[2].name,1);
	PlayerPrefs.SetInt("FOHFloor:"+FOHFloor[2].name,1);
	PlayerPrefs.SetInt("FOHBooze:"+FOHBooze[2].name,1);
	PlayerPrefs.SetInt("FOHTicketBooth:"+FOHTicketBooth[2].name,1);
	PlayerPrefs.SetInt("FOHDesk:"+FOHDesk[2].name,1);
}