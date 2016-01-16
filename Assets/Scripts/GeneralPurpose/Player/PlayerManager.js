#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

// Current position of the player.
public enum PlayerState{StandingFront,StandingBack,WalkingFront,WalkingBack,SpecialHeadBob,Null1,Null2,Null3,Null4,Cutscene}
var currentState:PlayerState;
var step:int;
static var speed:float;
var speedOverride:boolean;
var thisSpeed:float;

// Arrays with different types of sprites.
var hair:GameObject[];
var eyes:GameObject[];
var tops:GameObject[];
var bottoms:GameObject[];

// Arrays with availabilities.
private var hairAvailability:boolean[];
private var eyesAvailability:boolean[];
private var topsAvailability:boolean[];
private var bottomsAvailability:boolean[];

// Arrays with possible colors;
var hairColor:Color[];
var eyesColor:Color[];
var topsColor:Color[];
var bottomsColor:Color[];
var bodyColor:Color[];

// Current instantiated sprite sheets.
var currentHair:GameObject;
var currentEyes:GameObject;
var currentTop:GameObject;
var currentBottom:GameObject;
var currentMouth:GameObject;

static var save:int[];

var standStill:boolean = false;

function Awake () {	
	UpdateAvailability();
	if(Master.unlockAll)
	{
		UnlockAllOptions();
		UpdateAvailability();
	}
	// Instantiates and colors all paper doll sprites, scales them correctly, and parents them to the player.
	currentHair = Instantiate(hair[ObscuredPrefs.GetInt("HairSelection")],transform.position-Vector3(0,0,.08),Quaternion.identity);
		currentHair.transform.localScale = transform.lossyScale;
		currentHair.GetComponent(SpriteRenderer).color = hairColor[ObscuredPrefs.GetInt("HairColor")];
		currentHair.transform.parent = transform;
	currentEyes = Instantiate(eyes[ObscuredPrefs.GetInt("EyesSelection")],transform.position-Vector3(0,0,.06),Quaternion.identity);
		currentEyes.transform.localScale = transform.lossyScale;
		currentEyes.GetComponent(SpriteRenderer).color = eyesColor[ObscuredPrefs.GetInt("EyesColor")];
		currentEyes.transform.parent = transform;
	currentTop = Instantiate(tops[ObscuredPrefs.GetInt("TopSelection")],transform.position-Vector3(0,0,.07),Quaternion.identity);
		currentTop.transform.localScale = transform.lossyScale;
		currentTop.GetComponent(SpriteRenderer).color = topsColor[ObscuredPrefs.GetInt("TopColor")];
		currentTop.transform.parent = transform;
	currentBottom = Instantiate(bottoms[ObscuredPrefs.GetInt("BottomSelection")],transform.position-Vector3(0,0,.05),Quaternion.identity);
		currentBottom.transform.localScale = transform.lossyScale;
		currentBottom.GetComponent(SpriteRenderer).color = bottomsColor[ObscuredPrefs.GetInt("BottomColor")];
		currentBottom.transform.parent = transform;
	if(ObscuredPrefs.GetInt("BodyColor") < bodyColor.Length)
	{
		GetComponent(SpriteRenderer).color = bodyColor[ObscuredPrefs.GetInt("BodyColor")];
		currentMouth.GetComponent(SpriteRenderer).color = bodyColor[ObscuredPrefs.GetInt("BodyColor")];
	}
	if(!standStill)
	{
		StartCoroutine(Move());
	}
	Save();
}
function Start () {
	UpdateAvailability();
	if(Master.unlockAll)
	{
		UnlockAllOptions();
		UpdateAvailability();
	}
	StartCoroutine(Move());
}

function Update () {
}

function ChangePart(part:String, change:int) {
	var fix:int;
	var unavailableCheck:int = 0;
	var initial:int;
	
	if(change > 0)
	{
		fix = 1;
	}
	else
	{
		fix = -1;
	}
	switch(part)
	{
		case "hair":
			initial = ObscuredPrefs.GetInt("HairSelection");
			while((ObscuredPrefs.GetInt("HairSelection")+change < 0 || !hairAvailability[ObscuredPrefs.GetInt("HairSelection")+change]) && unavailableCheck < 50)
			{
				change += fix;
				if(ObscuredPrefs.GetInt("HairSelection")+change >= hair.length)
				{
					change -= hair.length+1;
				}
				if(ObscuredPrefs.GetInt("HairSelection")+change < 0)
				{
					change = hair.length-1;
				}		
				unavailableCheck++;
			}
			if((unavailableCheck >= 50 || change == 0) && !Master.notifying)
			{
				Announcement("You haven't unlocked any hair styles yet!");
				ObscuredPrefs.SetInt("HairSelection",initial);
			}
			else
			{
				ObscuredPrefs.SetInt("HairSelection",ObscuredPrefs.GetInt("HairSelection")+change);
			}
			break;
		case "eyes":
			initial = ObscuredPrefs.GetInt("EyesSelection");
			while((ObscuredPrefs.GetInt("EyesSelection")+change < 0 || !eyesAvailability[ObscuredPrefs.GetInt("EyesSelection")+change]) && unavailableCheck < 50)
			{
				change += fix;
				if(ObscuredPrefs.GetInt("EyesSelection")+change >= eyes.length)
				{
					change -= eyes.length+1;
				}
				if(ObscuredPrefs.GetInt("EyesSelection")+change < 0)
				{
					change = eyes.length-1;
				}
				
				unavailableCheck++;
			}
			if(unavailableCheck >= 50 && !Master.notifying)
			{
				Announcement("You haven't unlocked any eye types yet!");
				ObscuredPrefs.SetInt("EyesSelection",initial);
			}
			else
			{
				ObscuredPrefs.SetInt("EyesSelection",ObscuredPrefs.GetInt("EyesSelection")+change);
			}
			break;
		case "top":
			initial = ObscuredPrefs.GetInt("TopSelection");
			while((ObscuredPrefs.GetInt("TopSelection")+change < 0 || !topsAvailability[ObscuredPrefs.GetInt("TopSelection")+change]) && unavailableCheck < 50)
			{
				change += fix;
				if(ObscuredPrefs.GetInt("TopSelection")+change >= tops.length)
				{
					change -= tops.length+1;
				}
				if(ObscuredPrefs.GetInt("TopSelection")+change < 0)
				{
					change = tops.length-1;
				}
				unavailableCheck++;
			}
			if(unavailableCheck >= 50 && !Master.notifying)
			{
				Announcement("You haven't unlocked any tops yet!");
				ObscuredPrefs.SetInt("TopSelection",initial);
			}
			else
			{
				ObscuredPrefs.SetInt("TopSelection",ObscuredPrefs.GetInt("TopSelection")+change);
			}
			break;
		case "bottom":
			initial = ObscuredPrefs.GetInt("BottomSelection");
			while((ObscuredPrefs.GetInt("BottomSelection")+change < 0 || !bottomsAvailability[ObscuredPrefs.GetInt("BottomSelection")+change]) && unavailableCheck < 50)
			{
				change += fix;
				if(ObscuredPrefs.GetInt("BottomSelection")+change >= bottoms.length)
				{
					change -= bottoms.length+1;
				}
				if(ObscuredPrefs.GetInt("BottomSelection")+change < 0)
				{
					change = bottoms.length-1;
				}
				unavailableCheck++;
			}
			if(unavailableCheck >= 50 && !Master.notifying)
			{
				Announcement("You haven't unlocked any bottoms yet!");
				ObscuredPrefs.SetInt("BottomSelection",initial);	
			}
			else
			{
				ObscuredPrefs.SetInt("BottomSelection",ObscuredPrefs.GetInt("BottomSelection")+change);
			}
			break;
		default:
			break;
	}
	Refresh(part,change);
}

function Announcement (word:String) {
	Camera.main.GetComponent(Master).LaunchNotification(word,NotificationType.lockedWorld);
}

function ChangeColor(part:String, color:int) {
	switch(part)
	{
		case "hair":
			ObscuredPrefs.SetInt("HairColor",color);
			break;
		case "eyes":
			ObscuredPrefs.SetInt("EyesColor",color);
			break;
		case "top":
			ObscuredPrefs.SetInt("TopColor",color);
			break;
		case "bottom":
			ObscuredPrefs.SetInt("BottomColor",color);
			break;
		case "body":
			ObscuredPrefs.SetInt("BodyColor",ObscuredPrefs.GetInt("BodyColor") + 1);
			break;
		default:
			break;
	}
	RefreshColor(part);
}

function Refresh(part:String) {
	Refresh(part,0);
}
function Refresh(part:String, change:int) {
	var lastObject:GameObject;
	switch(part)
	{
		case "hair":
			currentHair = CreateObject(currentHair,hair,hairColor,hairAvailability,.08,"Hair","hair",change);
			break;
		case "eyes":
			currentEyes = CreateObject(currentEyes,eyes,eyesColor,eyesAvailability,.06,"Eyes","eyes",change);
			break;
		case "top":
			currentTop = CreateObject(currentTop,tops,topsColor,topsAvailability,.7,"Top","top",change);
			break;
		case "bottom":
			currentBottom = CreateObject(currentBottom,bottoms,bottomsColor,bottomsAvailability,.05,"Bottom","bottom",change);
			break;
		case "body":
			if(ObscuredPrefs.GetInt("BodyColor") >= bodyColor.Length)
			{
				ObscuredPrefs.SetInt("BodyColor",0);
			}
			if(ObscuredPrefs.GetInt("BodyColor") < 0)
			{
				ObscuredPrefs.SetInt("BodyColor",bodyColor.Length-1);
			}
			GetComponent(SpriteRenderer).color = bodyColor[ObscuredPrefs.GetInt("BodyColor")];
			currentMouth.GetComponent(SpriteRenderer).color = bodyColor[ObscuredPrefs.GetInt("BodyColor")];
			break;
		case "all":
			currentHair = CreateObject(currentHair,hair,hairColor,hairAvailability,.08,"Hair","hair",change);
			currentEyes = CreateObject(currentEyes,eyes,eyesColor,eyesAvailability,.06,"Eyes","eyes",change);
			currentTop = CreateObject(currentTop,tops,topsColor,topsAvailability,.7,"Top","top",change);
			currentBottom = CreateObject(currentBottom,bottoms,bottomsColor,bottomsAvailability,.05,"Bottom","bottom",change);
			if(ObscuredPrefs.GetInt("BodyColor") >= bodyColor.Length)
			{
				ObscuredPrefs.SetInt("BodyColor",0);
			}
			if(ObscuredPrefs.GetInt("BodyColor") < 0)
			{
				ObscuredPrefs.SetInt("BodyColor",bodyColor.Length-1);
			}
			GetComponent(SpriteRenderer).color = bodyColor[ObscuredPrefs.GetInt("BodyColor")];
			currentMouth.GetComponent(SpriteRenderer).color = bodyColor[ObscuredPrefs.GetInt("BodyColor")];
			break;
	}
}

function CreateObject (objectHolder:GameObject,objectArray:GameObject[],objectColorArray:Color[],availability:boolean[],zLocation:float,variableNameCap:String,variableNameLower:String, change:int) : GameObject
{
	var lastObject:GameObject = objectHolder;
	objectHolder = Instantiate(objectArray[ObscuredPrefs.GetInt(variableNameCap + "Selection")],transform.position-Vector3(0,0,zLocation),Quaternion.identity);
	ReplaceObject(lastObject,1);
	objectHolder.transform.localScale = transform.localScale;
	objectHolder.GetComponent(SpriteRenderer).color = objectColorArray[ObscuredPrefs.GetInt(variableNameCap + "Color")];
	objectHolder.transform.parent = transform;
	return objectHolder;
}

function ReplaceObject (lastObject:GameObject,frames:int) {
	var waitFrames:int = 0;
	while(waitFrames < frames){waitFrames++;yield;}
	Destroy(lastObject);
}

function RefreshColor(part:String) {
	switch(part)
	{
		case "hair":
			currentHair.GetComponent(SpriteRenderer).color = hairColor[ObscuredPrefs.GetInt("HairColor")];
			break;
		case "eyes":
			currentEyes.GetComponent(SpriteRenderer).color = eyesColor[ObscuredPrefs.GetInt("EyesColor")];
			break;
		case "top":
			currentTop.GetComponent(SpriteRenderer).color = topsColor[ObscuredPrefs.GetInt("TopColor")];
			break;
		case "bottom":
			currentBottom.GetComponent(SpriteRenderer).color = bottomsColor[ObscuredPrefs.GetInt("BottomColor")];
			break;
		case "body":
			if(ObscuredPrefs.GetInt("BodyColor") >= bodyColor.Length)
			{
				ObscuredPrefs.SetInt("BodyColor",0);
			}
			if(ObscuredPrefs.GetInt("BodyColor") < 0)
			{
				ObscuredPrefs.SetInt("BodyColor",bodyColor.Length-1);
			}
			GetComponent(SpriteRenderer).color = bodyColor[ObscuredPrefs.GetInt("BodyColor")];
			currentMouth.GetComponent(SpriteRenderer).color = bodyColor[ObscuredPrefs.GetInt("BodyColor")];
			break;
	}
}

function Save () {
	save = [ObscuredPrefs.GetInt("HairSelection"),ObscuredPrefs.GetInt("EyesSelection"),ObscuredPrefs.GetInt("TopSelection"),ObscuredPrefs.GetInt("BottomSelection"),ObscuredPrefs.GetInt("HairColor"),ObscuredPrefs.GetInt("EyesColor"),ObscuredPrefs.GetInt("TopColor"),ObscuredPrefs.GetInt("BottomColor"),ObscuredPrefs.GetInt("BodyColor")];
}

function Revert () {
	ObscuredPrefs.SetInt("HairSelection",save[0]);
	ObscuredPrefs.SetInt("EyesSelection",save[1]);
	ObscuredPrefs.SetInt("TopSelection",save[2]);
	ObscuredPrefs.SetInt("BottomSelection",save[3]);
	
	ObscuredPrefs.SetInt("HairColor",save[4]);
	ObscuredPrefs.SetInt("EyesColor",save[5]);
	ObscuredPrefs.SetInt("TopColor",save[6]);
	ObscuredPrefs.SetInt("BottomColor",save[7]);
	ObscuredPrefs.SetInt("BodyColor",save[8]);
	
	Refresh("hair");
	Refresh("eyes");
	Refresh("top");
	Refresh("bottom");
	Refresh("body");
}

public function UpdateAvailability () {
	hairAvailability = new boolean[hair.length + 1];
	eyesAvailability = new boolean[eyes.length + 1];
	topsAvailability = new boolean[tops.length + 1];
	bottomsAvailability = new boolean[bottoms.length + 1];
	ObscuredPrefs.SetInt("Hair:"+hair[0].transform.name,1);
	ObscuredPrefs.SetInt("Eyes:"+eyes[0].transform.name,1);
	ObscuredPrefs.SetInt("Tops:"+tops[0].transform.name,1);
	ObscuredPrefs.SetInt("Bottoms:"+bottoms[0].transform.name,1);
	for(var hairCheck:int = 0; hairCheck < hair.length; hairCheck++)
	{
		if(ObscuredPrefs.GetInt("Hair:"+hair[hairCheck].transform.name) == 0)
		{
			hairAvailability[hairCheck] = false;
		}
		else
		{
			hairAvailability[hairCheck] = true;
		}
	}
	for(var eyesCheck:int = 0; eyesCheck < eyes.length; eyesCheck++)
	{
		if(ObscuredPrefs.GetInt("Eyes:"+eyes[eyesCheck].transform.name) == 0)
		{
			eyesAvailability[eyesCheck] = false;
		}
		else
		{
			eyesAvailability[eyesCheck] = true;
		}
	}
	for(var topsCheck:int = 0; topsCheck < tops.length; topsCheck++)
	{
		if(ObscuredPrefs.GetInt("Tops:"+tops[topsCheck].transform.name) == 0)
		{
			topsAvailability[topsCheck] = false;
		}
		else
		{
			topsAvailability[topsCheck] = true;
		}
	}
	for(var bottomsCheck:int = 0; bottomsCheck < bottoms.length; bottomsCheck++)
	{
		if(ObscuredPrefs.GetInt("Bottoms:"+bottoms[bottomsCheck].transform.name) == 0)
		{
			bottomsAvailability[bottomsCheck] = false;
		}
		else
		{
			bottomsAvailability[bottomsCheck] = true;
		}
	}
}
function UnlockAllOptions () {
	for(var hairPiece:GameObject in hair)
	{
		ObscuredPrefs.SetInt("Hair:"+hairPiece.transform.name,1);
	}
	for(var eyesPiece:GameObject in eyes)
	{
		ObscuredPrefs.SetInt("Eyes:"+eyesPiece.transform.name,1);
	}
	for(var topsPiece:GameObject in tops)
	{
		ObscuredPrefs.SetInt("Tops:"+topsPiece.transform.name,1);
	}
	for(var bottomsPiece:GameObject in bottoms)
	{
		ObscuredPrefs.SetInt("Bottoms:"+bottomsPiece.transform.name,1);
	}
}
function LockAllOptions () {
	for(var hairPiece:GameObject in hair)
	{
		ObscuredPrefs.SetInt("Hair:"+hairPiece.transform.name,0);
	}
	for(var eyesPiece:GameObject in eyes)
	{
		ObscuredPrefs.SetInt("Eyes:"+eyesPiece.transform.name,0);
	}
	for(var topsPiece:GameObject in tops)
	{
		ObscuredPrefs.SetInt("Tops:"+topsPiece.transform.name,0);
	}
	for(var bottomsPiece:GameObject in bottoms)
	{
		ObscuredPrefs.SetInt("Bottoms:"+bottomsPiece.transform.name,0);
	}
	ObscuredPrefs.SetInt("Hair:"+hair[1].transform.name,1);
	ObscuredPrefs.SetInt("Eyes:"+eyes[0].transform.name,1);
	ObscuredPrefs.SetInt("Tops:"+tops[1].transform.name,1);
	ObscuredPrefs.SetInt("Bottoms:"+bottoms[0].transform.name,1);
}


function Move() {
	while(true)
	{ 
		var waitTime:float;
		step = 1;
		if(speedOverride)
		{
			waitTime = thisSpeed * .7;
		}
		else
		{
			waitTime = speed * .7;
		}
		yield WaitForSeconds(waitTime);
		step = 2;
		if(speedOverride)
		{
			waitTime = thisSpeed * .7;
		}
		else
		{
			waitTime = speed * .7;
		}
		yield WaitForSeconds(waitTime);
		step = 3;
		if(speedOverride)
		{
			waitTime = thisSpeed * .7;
		}
		else
		{
			waitTime = speed * .7;
		}
		yield WaitForSeconds(waitTime);
		step = 4;
		if(speedOverride)
		{
			waitTime = thisSpeed * .7;
		}
		else
		{
			waitTime = speed * .7;
		}
		yield WaitForSeconds(waitTime);
	}
}

function SetSongSprite(spriteNumber:int) {
	if(transform.name != "Mouth")
	{
		step = spriteNumber+1;
	}
}