#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

// Piece holder.
var theaterHolder:GameObject;

// Current theater pieces.
@HideInInspector var currentStageWall:GameObject;
@HideInInspector var currentStageFloor:GameObject;
@HideInInspector var currentCeiling:GameObject;
@HideInInspector var currentTheaterWall:GameObject;
@HideInInspector var currentTheaterFloor:GameObject;
@HideInInspector var currentCurtain:GameObject;
@HideInInspector var currentChairs:GameObject;

// Arrays with different types of theater sprites.
var stageWall:GameObject[];
var stageFloor:GameObject[];
var ceiling:GameObject[];
var theaterWall:GameObject[];
var theaterFloor:GameObject[];
var curtain:GameObject[];
var chairs:GameObject[];

// Theater availability arrays.
static var stageWallAvailability:boolean[];
static var stageFloorAvailability:boolean[];
static var ceilingAvailability:boolean[];
static var theaterWallAvailability:boolean[];
static var theaterFloorAvailability:boolean[];
static var curtainAvailability:boolean[];
static var chairsAvailability:boolean[];

// Number available numbers.
static var stageWallAvailabilityNumber:int;
static var stageFloorAvailabilityNumber:int;
static var ceilingAvailabilityNumber:int;
static var theaterWallAvailabilityNumber:int;
static var theaterFloorAvailabilityNumber:int;
static var curtainAvailabilityNumber:int;
static var chairsAvailabilityNumber:int;

// Display stuff.
static var thisObject:int;
static var totalObject:int;
static var displayCounter:float;
var display1:TextMesh;
var display2:TextMesh;
static var displayTopHeight1:float;
static var displayBottomHeight1:float;
static var displayTopHeight2:float;
static var displayBottomHeight2:float;

function Start () {
	// Lock or unlock all pieces, and activate availability.
	UpdateAvailability();
	if(Master.unlockAll)
	{
		UnlockAllOptions();
		UpdateAvailability();
	}
	
	// Display stuff.
	thisObject = 0;
	totalObject = 0;
	displayCounter = 0;
	
	if(Master.device == "16:9" && display1 != null)
	{
		display1.transform.position.x = 14.7;
		displayTopHeight1 = 11;
		displayBottomHeight1 = 7;
		display2.transform.position.x = 8.8;
		displayTopHeight2 = 19;
		displayBottomHeight2 = 14.4;
	}
	else if(Master.device == "4:3" && display1 != null)
	{
		display1.transform.position.x = 14.5;
		displayTopHeight1 = 14;
		displayBottomHeight1 = 10;
		display2.transform.position.x = 10.5;
		displayTopHeight2 = 18;
		displayBottomHeight2 = 13.6;
	}
	
	
	// Create all pieces.
	currentStageWall = Instantiate(stageWall[ObscuredPrefs.GetInt("StageWallSelection")]);
	currentStageFloor = Instantiate(stageFloor[ObscuredPrefs.GetInt("StageFloorSelection")]);
	currentCeiling = Instantiate(ceiling[ObscuredPrefs.GetInt("CeilingSelection")]);
	currentTheaterWall = Instantiate(theaterWall[ObscuredPrefs.GetInt("TheaterWallSelection")]);
	currentTheaterFloor = Instantiate(theaterFloor[ObscuredPrefs.GetInt("TheaterFloorSelection")]);
	currentCurtain = Instantiate(curtain[ObscuredPrefs.GetInt("CurtainSelection")]);
	currentChairs = Instantiate(chairs[ObscuredPrefs.GetInt("ChairsSelection")]);
	
	// Set all pieces as children of the Theater Holder.
	currentStageWall.transform.parent = theaterHolder.transform;
	currentStageFloor.transform.parent = theaterHolder.transform;
	currentCeiling.transform.parent = theaterHolder.transform;
	currentTheaterWall.transform.parent = theaterHolder.transform;
	currentTheaterFloor.transform.parent = theaterHolder.transform;
	currentCurtain.transform.parent = theaterHolder.transform;
	currentChairs.transform.parent = theaterHolder.transform;
	
	// Name all objects for clarity.
	currentStageWall.transform.name = "StageWall";
	currentStageFloor.transform.name = "StageFloor";
	currentCeiling.transform.name = "Ceiling";
	currentTheaterWall.transform.name = "TheaterWall";
	currentTheaterFloor.transform.name = "TheaterFloor";
	currentCurtain.transform.name = "Curtain";
	currentChairs.transform.name = "Chairs";
	
	// Set object positions.
	currentStageWall.transform.localPosition = Vector3(-3.3,3.3,13);
	currentStageFloor.transform.localPosition = Vector3(-3.3,-15.9,13);
	currentCeiling.transform.localPosition = Vector3(-1.8,3.3,8);
	currentTheaterWall.transform.localPosition = Vector3(-1.8,3.3,8);
	currentTheaterFloor.transform.localPosition = Vector3(-1.8,-15.9,8);
	currentCurtain.transform.localPosition = Vector3(-3.3,3.3,7);
	currentChairs.transform.localPosition = Vector3(-3.3,-15.9,7);
	
	DisplayNumber();
}

function DisplayNumber() {
	while(true && display1 != null)
	{
		displayCounter -= Time.deltaTime;
		display1.text = thisObject.ToString() + "/" + totalObject.ToString();
		display2.text = thisObject.ToString() + "/" + totalObject.ToString();
		if(displayCounter <= 0)
		{
			display1.transform.position.y = Mathf.MoveTowards(display1.transform.position.y,displayTopHeight1,Time.deltaTime * 10);
			display2.transform.position.y = Mathf.MoveTowards(display2.transform.position.y,displayTopHeight2,Time.deltaTime * 10);
		}
		else
		{
			display1.transform.position.y = Mathf.MoveTowards(display1.transform.position.y,displayBottomHeight1,Time.deltaTime * 10);
			display2.transform.position.y = Mathf.MoveTowards(display2.transform.position.y,displayBottomHeight2,Time.deltaTime * 10);
		}
		yield;
	}	
}

function ChangePartSpecific (part:String, change:int) {
	// The function to call when you want to change a part by any amount. This is the main function to be called from external scripts.
	switch(part)
	{
		case "StageWall":
			ObscuredPrefs.SetInt("StageWallSelection",change);
			Debug.Log(ObscuredPrefs.GetInt("StageWallSelection"));
			break;
		case "StageFloor":
			ObscuredPrefs.SetInt("StageFloorSelection",change);
			break;
		case "Ceiling":
			ObscuredPrefs.SetInt("CeilingSelection",change);
			break;
		case "TheaterWall":
			ObscuredPrefs.SetInt("TheaterWallSelection",change);
			break;
		case "TheaterFloor":
			ObscuredPrefs.SetInt("TheaterFloorSelection",change);
			break;
		case "Curtain":
			ObscuredPrefs.SetInt("CurtainSelection",change);
			break;
		case "Chairs":
			ObscuredPrefs.SetInt("ChairsSelection",change);
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
			ObscuredPrefs.SetInt("StageWallSelection",ObscuredPrefs.GetInt("StageWallSelection") + change);
			break;
		case "StageFloor":
			ObscuredPrefs.SetInt("StageFloorSelection",ObscuredPrefs.GetInt("StageFloorSelection") + change);
			break;
		case "Ceiling":
			ObscuredPrefs.SetInt("CeilingSelection",ObscuredPrefs.GetInt("CeilingSelection") + change);
			break;
		case "TheaterWall":
			ObscuredPrefs.SetInt("TheaterWallSelection",ObscuredPrefs.GetInt("TheaterWallSelection") + change);
			break;
		case "TheaterFloor":
			ObscuredPrefs.SetInt("TheaterFloorSelection",ObscuredPrefs.GetInt("TheaterFloorSelection") + change);
			break;
		case "Curtain":
			ObscuredPrefs.SetInt("CurtainSelection",ObscuredPrefs.GetInt("CurtainSelection") + change);
			break;
		case "Chairs":
			ObscuredPrefs.SetInt("ChairsSelection",ObscuredPrefs.GetInt("ChairsSelection") + change);
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
			if(ObscuredPrefs.GetInt("StageWallSelection") >= stageWall.Length)
			{
				ObscuredPrefs.SetInt("StageWallSelection", 0);
			}
			else if(ObscuredPrefs.GetInt("StageWallSelection") < 0)
			{
				ObscuredPrefs.SetInt("StageWallSelection", stageWall.Length-1);
			}
			currentStageWall = Instantiate(stageWall[ObscuredPrefs.GetInt("StageWallSelection")]);
			currentStageWall.transform.parent = theaterHolder.transform;
			currentStageWall.transform.localPosition = Vector3(-3.3,3.3,13);
			currentStageWall.transform.name = "StageWall";
			if(stageWallAvailability[ObscuredPrefs.GetInt("StageWallSelection")]==false)
			{
				ChangePart("StageWall",change);
			}
			thisObject = stageWall[ObscuredPrefs.GetInt("StageWallSelection")].GetComponent(VariablePrefix).thisObjectListNumber;
			totalObject = stageWallAvailabilityNumber;
			break;
		case "StageFloor":
			Destroy(currentStageFloor);
			if(ObscuredPrefs.GetInt("StageFloorSelection") >= stageFloor.Length)
			{
				ObscuredPrefs.SetInt("StageFloorSelection", 0);
			}
			else if(ObscuredPrefs.GetInt("StageFloorSelection") < 0)
			{
				ObscuredPrefs.SetInt("StageFloorSelection", stageFloor.Length-1);
			}
			currentStageFloor = Instantiate(stageFloor[ObscuredPrefs.GetInt("StageFloorSelection")]);
			currentStageFloor.transform.parent = theaterHolder.transform;
			currentStageFloor.transform.localPosition = Vector3(-3.3,-15.9,13);
			currentStageFloor.transform.name = "StageFloor";
			if(stageFloorAvailability[ObscuredPrefs.GetInt("StageFloorSelection")]==false)
			{
				ChangePart("StageFloor",change);
			}
			thisObject = stageFloor[ObscuredPrefs.GetInt("StageFloorSelection")].GetComponent(VariablePrefix).thisObjectListNumber;
			totalObject = stageFloorAvailabilityNumber;
			break;
		case "Ceiling":
			Destroy(currentCeiling);
			if(ObscuredPrefs.GetInt("CeilingSelection") >= ceiling.Length)
			{
				ObscuredPrefs.SetInt("CeilingSelection", 0);
			}
			else if(ObscuredPrefs.GetInt("CeilingSelection") < 0)
			{
				ObscuredPrefs.SetInt("CeilingSelection", ceiling.Length-1);
			}
			currentCeiling = Instantiate(ceiling[ObscuredPrefs.GetInt("CeilingSelection")]);
			currentCeiling.transform.parent = theaterHolder.transform;
			currentCeiling.transform.localPosition = Vector3(-1.8,3.3,8);
			currentCeiling.transform.name = "Ceiling";
			if(ceilingAvailability[ObscuredPrefs.GetInt("CeilingSelection")]==false)
			{
				ChangePart("Ceiling",change);
			}
			thisObject = ceiling[ObscuredPrefs.GetInt("CeilingSelection")].GetComponent(VariablePrefix).thisObjectListNumber;
			totalObject = ceilingAvailabilityNumber;
			break;
		case "TheaterWall":
			
			Destroy(currentTheaterWall);
			if(ObscuredPrefs.GetInt("TheaterWallSelection") >= theaterWall.Length)
			{
				ObscuredPrefs.SetInt("TheaterWallSelection", 0);
			}
			else if(ObscuredPrefs.GetInt("TheaterWallSelection") < 0)
			{
				ObscuredPrefs.SetInt("TheaterWallSelection", theaterWall.Length-1);
			}
			currentTheaterWall = Instantiate(theaterWall[ObscuredPrefs.GetInt("TheaterWallSelection")]);
			currentTheaterWall.transform.parent = theaterHolder.transform;
			currentTheaterWall.transform.localPosition = Vector3(-1.8,3.3,8);
			currentTheaterWall.transform.name = "TheaterWall";
			if(theaterWallAvailability[ObscuredPrefs.GetInt("TheaterWallSelection")]==false)
			{
				ChangePart("TheaterWall",change);
			}
			thisObject = theaterWall[ObscuredPrefs.GetInt("TheaterWallSelection")].GetComponent(VariablePrefix).thisObjectListNumber;
			totalObject = theaterWallAvailabilityNumber;
			break;
		case "TheaterFloor":
			Destroy(currentTheaterFloor);
			if(ObscuredPrefs.GetInt("TheaterFloorSelection") >= theaterFloor.Length)
			{
				ObscuredPrefs.SetInt("TheaterFloorSelection", 0);
			}
			else if(ObscuredPrefs.GetInt("TheaterFloorSelection") < 0)
			{
				ObscuredPrefs.SetInt("TheaterFloorSelection", theaterFloor.Length-1);
			}
			currentTheaterFloor = Instantiate(theaterFloor[ObscuredPrefs.GetInt("TheaterFloorSelection")]);
			currentTheaterFloor.transform.parent = theaterHolder.transform;
			currentTheaterFloor.transform.localPosition = Vector3(-1.8,-15.9,8);
			currentTheaterFloor.transform.name = "TheaterFloor";
			if(theaterFloorAvailability[ObscuredPrefs.GetInt("TheaterFloorSelection")]==false)
			{
				ChangePart("TheaterFloor",change);
			}
			thisObject = theaterFloor[ObscuredPrefs.GetInt("TheaterFloorSelection")].GetComponent(VariablePrefix).thisObjectListNumber;
			totalObject = theaterFloorAvailabilityNumber;
			break;
		case "Curtain":
			Destroy(currentCurtain);
			if(ObscuredPrefs.GetInt("CurtainSelection") >= curtain.Length)
			{
				ObscuredPrefs.SetInt("CurtainSelection", 0);
			}
			else if(ObscuredPrefs.GetInt("CurtainSelection") < 0)
			{
				ObscuredPrefs.SetInt("CurtainSelection", curtain.Length-1);
			}
			currentCurtain = Instantiate(curtain[ObscuredPrefs.GetInt("CurtainSelection")]);
			currentCurtain.transform.parent = theaterHolder.transform;
			currentCurtain.transform.localPosition = Vector3(-3.3,3.3,7);
			currentCurtain.transform.name = "Curtain";
			if(curtainAvailability[ObscuredPrefs.GetInt("CurtainSelection")]==false)
			{
				ChangePart("Curtain",change);
			}
			thisObject = curtain[ObscuredPrefs.GetInt("CurtainSelection")].GetComponent(VariablePrefix).thisObjectListNumber;
			totalObject = curtainAvailabilityNumber;
			break;
		case "Chairs":
			Destroy(currentChairs);
			if(ObscuredPrefs.GetInt("ChairsSelection") >= chairs.Length)
			{
				ObscuredPrefs.SetInt("ChairsSelection", 0);
			}
			else if(ObscuredPrefs.GetInt("ChairsSelection") < 0)
			{
				ObscuredPrefs.SetInt("ChairsSelection", chairs.Length-1);
			}
			currentChairs = Instantiate(chairs[ObscuredPrefs.GetInt("ChairsSelection")]);
			currentChairs.transform.parent = theaterHolder.transform;
			currentChairs.transform.localPosition = Vector3(-3.3,-15.9,7);
			currentChairs.transform.name = "Chairs";
			if(chairsAvailability[ObscuredPrefs.GetInt("ChairsSelection")]==false)
			{
				ChangePart("Chairs",change);
			}
			thisObject = chairs[ObscuredPrefs.GetInt("ChairsSelection")].GetComponent(VariablePrefix).thisObjectListNumber;
			totalObject = chairsAvailabilityNumber;
			break;
		default:
			break;
	}
	displayCounter = 1.5;
}

function UpdateAvailability () {

	stageWallAvailabilityNumber = 0;
	stageFloorAvailabilityNumber = 0;
	ceilingAvailabilityNumber = 0;
	theaterWallAvailabilityNumber = 0;
	theaterFloorAvailabilityNumber = 0;
	curtainAvailabilityNumber = 0;
	chairsAvailabilityNumber = 0;


	// Sets the availability of pieces based on ObscuredPrefs.
	stageWallAvailability = new boolean[stageWall.length + 1];
	stageFloorAvailability = new boolean[stageFloor.length + 1];
	ceilingAvailability = new boolean[ceiling.length + 1];
	theaterWallAvailability = new boolean[theaterWall.length + 1];
	theaterFloorAvailability = new boolean[theaterFloor.length + 1];
	curtainAvailability = new boolean[curtain.length + 1];
	chairsAvailability = new boolean[chairs.length + 1];
	
	// Unlocks the first of each set, so that we don't run into any problems where no pieces are drawable.
	ObscuredPrefs.SetInt("StageWall:"+stageWall[0].name,1);
	ObscuredPrefs.SetInt("StageFloor:"+stageFloor[0].name,1);
	ObscuredPrefs.SetInt("Ceiling:"+ceiling[0].name,1);
	ObscuredPrefs.SetInt("TheaterWall:"+theaterWall[0].name,1);
	ObscuredPrefs.SetInt("TheaterFloor:"+theaterFloor[0].name,1);
	ObscuredPrefs.SetInt("Curtain:"+curtain[0].name,1);
	ObscuredPrefs.SetInt("Chairs:"+chairs[0].name,1);
	
	ObscuredPrefs.SetInt("StageWall:"+stageWall[2].name,1);
	ObscuredPrefs.SetInt("StageFloor:"+stageFloor[2].name,1);
	ObscuredPrefs.SetInt("Ceiling:"+ceiling[2].name,1);
	ObscuredPrefs.SetInt("TheaterWall:"+theaterWall[2].name,1);
	ObscuredPrefs.SetInt("TheaterFloor:"+theaterFloor[2].name,1);
	ObscuredPrefs.SetInt("Curtain:"+curtain[2].name,1);
	ObscuredPrefs.SetInt("Chairs:"+chairs[2].name,1);
	
	// Changes availability booleans to true or false based on the ObscuredPrefs values.
	for(var stageWallCheck:int = 0; stageWallCheck < stageWall.length; stageWallCheck++)
	{
		if(ObscuredPrefs.GetInt("StageWall:"+stageWall[stageWallCheck].transform.name) == 0)
		{
			stageWallAvailability[stageWallCheck] = false;
		}
		else
		{
			stageWallAvailability[stageWallCheck] = true;
			stageWallAvailabilityNumber++;
			stageWall[stageWallCheck].GetComponent(VariablePrefix).thisObjectListNumber = stageWallAvailabilityNumber;
		}
	}
	for(var stageFloorCheck:int = 0; stageFloorCheck < stageFloor.length; stageFloorCheck++)
	{
		if(ObscuredPrefs.GetInt("StageFloor:"+stageFloor[stageFloorCheck].transform.name) == 0)
		{
			stageFloorAvailability[stageFloorCheck] = false;
		}
		else
		{
			stageFloorAvailability[stageFloorCheck] = true;
			stageFloorAvailabilityNumber++;
			stageFloor[stageFloorCheck].GetComponent(VariablePrefix).thisObjectListNumber = stageFloorAvailabilityNumber;
		}
	}
	for(var ceilingCheck:int = 0; ceilingCheck < ceiling.length; ceilingCheck++)
	{
		if(ObscuredPrefs.GetInt("Ceiling:"+ceiling[ceilingCheck].transform.name) == 0)
		{
			ceilingAvailability[ceilingCheck] = false;
		}
		else
		{
			ceilingAvailability[ceilingCheck] = true;
			ceilingAvailabilityNumber++;
			ceiling[ceilingCheck].GetComponent(VariablePrefix).thisObjectListNumber = ceilingAvailabilityNumber;
		}
	}
	for(var theaterWallCheck:int = 0; theaterWallCheck < theaterWall.length; theaterWallCheck++)
	{
		if(ObscuredPrefs.GetInt("TheaterWall:"+theaterWall[theaterWallCheck].transform.name) == 0)
		{
			theaterWallAvailability[theaterWallCheck] = false;
		}
		else
		{
			theaterWallAvailability[theaterWallCheck] = true;
			theaterWallAvailabilityNumber++;
			theaterWall[theaterWallCheck].GetComponent(VariablePrefix).thisObjectListNumber = theaterWallAvailabilityNumber;
		}
	}
	for(var theaterFloorCheck:int = 0; theaterFloorCheck < theaterFloor.length; theaterFloorCheck++)
	{
		if(ObscuredPrefs.GetInt("TheaterFloor:"+theaterFloor[theaterFloorCheck].transform.name) == 0)
		{
			theaterFloorAvailability[theaterFloorCheck] = false;
		}
		else
		{
			theaterFloorAvailability[theaterFloorCheck] = true;
			theaterFloorAvailabilityNumber++;
			theaterFloor[theaterFloorCheck].GetComponent(VariablePrefix).thisObjectListNumber = theaterFloorAvailabilityNumber;
		}
	}
	for(var curtainCheck:int = 0; curtainCheck < curtain.length; curtainCheck++)
	{
		if(ObscuredPrefs.GetInt("Curtain:"+curtain[curtainCheck].transform.name) == 0)
		{
			curtainAvailability[curtainCheck] = false;
		}
		else
		{
			curtainAvailability[curtainCheck] = true;
			curtainAvailabilityNumber++;
			curtain[curtainCheck].GetComponent(VariablePrefix).thisObjectListNumber = curtainAvailabilityNumber;
		}
	}
	for(var chairsCheck:int = 0; chairsCheck < chairs.length; chairsCheck++)
	{
		if(ObscuredPrefs.GetInt("Chairs:"+chairs[chairsCheck].transform.name) == 0)
		{
			chairsAvailability[chairsCheck] = false;
		}
		else
		{
			chairsAvailability[chairsCheck] = true;
			chairsAvailabilityNumber++;
			chairs[chairsCheck].GetComponent(VariablePrefix).thisObjectListNumber = chairsAvailabilityNumber;
		}
	}
}	

function UnlockAllOptions () {
	// Unlocks all pieces, considered an override.
	for(var stageWallPiece:GameObject in stageWall)
	{
		ObscuredPrefs.SetInt("StageWall:"+stageWallPiece.transform.name,1);
	}
	for(var stageFloorPiece:GameObject in stageFloor)
	{
		ObscuredPrefs.SetInt("StageFloor:"+stageFloorPiece.transform.name,1);
	}
	for(var ceilingPiece:GameObject in ceiling)
	{
		ObscuredPrefs.SetInt("Ceiling:"+ceilingPiece.transform.name,1);
	}
	for(var theaterWallPiece:GameObject in theaterWall)
	{
		ObscuredPrefs.SetInt("TheaterWall:"+theaterWallPiece.transform.name,1);
	}
	for(var theaterFloorPiece:GameObject in theaterFloor)
	{
		ObscuredPrefs.SetInt("TheaterFloor:"+theaterFloorPiece.transform.name,1);
	}
	for(var curtainPiece:GameObject in curtain)
	{
		ObscuredPrefs.SetInt("Curtain:"+curtainPiece.transform.name,1);
	}
	for(var chairsPiece:GameObject in chairs)
	{
		ObscuredPrefs.SetInt("Chairs:"+chairsPiece.transform.name,1);
	}
}
function LockAllOptions () {
	// Locks all pieces, considered an override. Also unlocks the first of each piece type.
	for(var stageWallPiece:GameObject in stageWall)
	{
		ObscuredPrefs.SetInt("StageWall:"+stageWallPiece.transform.name,0);
	}
	for(var stageFloorPiece:GameObject in stageFloor)
	{
		ObscuredPrefs.SetInt("StageFloor:"+stageFloorPiece.transform.name,0);
	}
	for(var ceilingPiece:GameObject in ceiling)
	{
		ObscuredPrefs.SetInt("Ceiling:"+ceilingPiece.transform.name,0);
	}
	for(var theaterWallPiece:GameObject in theaterWall)
	{
		ObscuredPrefs.SetInt("TheaterWall:"+theaterWallPiece.transform.name,0);
	}
	for(var theaterFloorPiece:GameObject in theaterFloor)
	{
		ObscuredPrefs.SetInt("TheaterFloor:"+theaterFloorPiece.transform.name,0);
	}
	for(var curtainPiece:GameObject in curtain)
	{
		ObscuredPrefs.SetInt("Curtain:"+curtainPiece.transform.name,0);
	}
	for(var chairsPiece:GameObject in chairs)
	{
		ObscuredPrefs.SetInt("Chairs:"+chairsPiece.transform.name,0);
	}
	ObscuredPrefs.SetInt("StageWall:"+stageWall[0].name,1);
	ObscuredPrefs.SetInt("StageFloor:"+stageFloor[0].name,1);
	ObscuredPrefs.SetInt("Ceiling:"+ceiling[0].name,1);
	ObscuredPrefs.SetInt("TheaterWall:"+theaterWall[0].name,1);
	ObscuredPrefs.SetInt("TheaterFloor:"+theaterFloor[0].name,1);
	ObscuredPrefs.SetInt("Curtain:"+curtain[0].name,1);
	ObscuredPrefs.SetInt("Chairs:"+chairs[0].name,1);
	
	ObscuredPrefs.SetInt("StageWall:"+stageWall[1].name,1);
	ObscuredPrefs.SetInt("StageFloor:"+stageFloor[1].name,1);
	ObscuredPrefs.SetInt("Ceiling:"+ceiling[1].name,1);
	ObscuredPrefs.SetInt("TheaterWall:"+theaterWall[1].name,1);
	ObscuredPrefs.SetInt("TheaterFloor:"+theaterFloor[1].name,1);
	ObscuredPrefs.SetInt("Curtain:"+curtain[1].name,1);
	ObscuredPrefs.SetInt("Chairs:"+chairs[1].name,1);
	
	ObscuredPrefs.SetInt("StageWall:"+stageWall[2].name,1);
	ObscuredPrefs.SetInt("StageFloor:"+stageFloor[2].name,1);
	ObscuredPrefs.SetInt("Ceiling:"+ceiling[2].name,1);
	ObscuredPrefs.SetInt("TheaterWall:"+theaterWall[2].name,1);
	ObscuredPrefs.SetInt("TheaterFloor:"+theaterFloor[2].name,1);
	ObscuredPrefs.SetInt("Curtain:"+curtain[2].name,1);
	ObscuredPrefs.SetInt("Chairs:"+chairs[2].name,1);
}