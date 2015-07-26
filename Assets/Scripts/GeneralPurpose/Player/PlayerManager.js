#pragma strict

// Current position of the player.
public enum PlayerState{StandingFront,StandingBack,StandingLeft,StandingRight,WalkingFront,WalkingBack,WalkingLeft,WalkingRight,SpecialHandsOut,SpecialHeadBob,SpecialFrown,SpecialFrownSinging,SpecialSinging,SpecialLoudSinging,SpecialHighNote,SpecialOneHandSing,SpecialHandsOutSing,SpecialHandsOutLoudSing,SpecialHandsOutHighNote}
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

var save:int[];

var standStill:boolean = false;

function Awake () {	
	UpdateAvailability();
	if(Master.unlockAll)
	{
		UnlockAllOptions();
		UpdateAvailability();
	}
	// Instantiates and colors all paper doll sprites, scales them correctly, and parents them to the player.
	currentHair = Instantiate(hair[PlayerPrefs.GetInt("HairSelection")],transform.position-Vector3(0,0,.08),Quaternion.identity);
		currentHair.transform.localScale = transform.lossyScale;
		currentHair.GetComponent(SpriteRenderer).color = hairColor[PlayerPrefs.GetInt("HairColor")];
		currentHair.transform.parent = transform;
	currentEyes = Instantiate(eyes[PlayerPrefs.GetInt("EyesSelection")],transform.position-Vector3(0,0,.06),Quaternion.identity);
		currentEyes.transform.localScale = transform.lossyScale;
		currentEyes.GetComponent(SpriteRenderer).color = eyesColor[PlayerPrefs.GetInt("EyesColor")];
		currentEyes.transform.parent = transform;
	currentTop = Instantiate(tops[PlayerPrefs.GetInt("TopSelection")],transform.position-Vector3(0,0,.05),Quaternion.identity);
		currentTop.transform.localScale = transform.lossyScale;
		currentTop.GetComponent(SpriteRenderer).color = topsColor[PlayerPrefs.GetInt("TopColor")];
		currentTop.transform.parent = transform;
	currentBottom = Instantiate(bottoms[PlayerPrefs.GetInt("BottomSelection")],transform.position-Vector3(0,0,.07),Quaternion.identity);
		currentBottom.transform.localScale = transform.lossyScale;
		currentBottom.GetComponent(SpriteRenderer).color = bottomsColor[PlayerPrefs.GetInt("BottomColor")];
		currentBottom.transform.parent = transform;
	if(PlayerPrefs.GetInt("BodyColor") < bodyColor.Length)
	{
		GetComponent(SpriteRenderer).color = bodyColor[PlayerPrefs.GetInt("BodyColor")];
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
}

function Update () {
	/*
	if(Input.GetKeyDown("left"))
	{
		currentState = PlayerState.WalkingLeft;
	}
	if(Input.GetKeyUp("left"))
	{
		currentState = PlayerState.StandingLeft;
	}
	if(Input.GetKeyDown("right"))
	{
		currentState = PlayerState.WalkingRight;
	}
	if(Input.GetKeyUp("right"))
	{
		currentState = PlayerState.StandingRight;
	}
	if(Input.GetKeyDown("up"))
	{
		currentState = PlayerState.WalkingBack;
	}
	if(Input.GetKeyUp("up"))
	{
		currentState = PlayerState.StandingBack;
	}
	if(Input.GetKeyDown("down"))
	{
		currentState = PlayerState.WalkingFront;
	}
	if(Input.GetKeyUp("down"))
	{
		currentState = PlayerState.StandingFront;
	}
	*/
}

function ChangePart(part:String, change:int) {
	var fix:int;
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
			while(PlayerPrefs.GetInt("HairSelection")+change < 0 || !hairAvailability[PlayerPrefs.GetInt("HairSelection")+change])
			{
				change += fix;
				if(PlayerPrefs.GetInt("HairSelection")+change >= hair.length)
				{
					change -= hair.length+1;
				}
				if(PlayerPrefs.GetInt("HairSelection")+change < 0)
				{
					change = hair.length-1;
				}			
			}
			PlayerPrefs.SetInt("HairSelection",PlayerPrefs.GetInt("HairSelection")+change);
			break;
		case "eyes":
			while(PlayerPrefs.GetInt("EyesSelection")+change < 0 || !eyesAvailability[PlayerPrefs.GetInt("EyesSelection")+change])
			{
				change += fix;
				if(PlayerPrefs.GetInt("EyesSelection")+change >= eyes.length)
				{
					change -= eyes.length+1;
				}
				if(PlayerPrefs.GetInt("EyesSelection")+change < 0)
				{
					change = eyes.length-1;
				}
				yield;
			}
			PlayerPrefs.SetInt("EyesSelection",PlayerPrefs.GetInt("EyesSelection")+change);
			break;
		case "top":
			while(PlayerPrefs.GetInt("TopSelection")+change < 0 || !topsAvailability[PlayerPrefs.GetInt("TopSelection")+change])
			{
				change += fix;
				if(PlayerPrefs.GetInt("TopSelection")+change >= tops.length)
				{
					change -= tops.length+1;
				}
				if(PlayerPrefs.GetInt("TopSelection")+change < 0)
				{
					change = tops.length-1;
				}
			}
			PlayerPrefs.SetInt("TopSelection",PlayerPrefs.GetInt("TopSelection")+change);
			break;
		case "bottom":
			while(PlayerPrefs.GetInt("BottomSelection")+change < 0 || !bottomsAvailability[PlayerPrefs.GetInt("BottomSelection")+change])
			{
				change += fix;
				if(PlayerPrefs.GetInt("BottomSelection")+change >= bottoms.length)
				{
					change -= bottoms.length+1;
				}
				if(PlayerPrefs.GetInt("BottomSelection")+change < 0)
				{
					change = bottoms.length-1;
				}
			}
			PlayerPrefs.SetInt("BottomSelection",PlayerPrefs.GetInt("BottomSelection")+change);
			break;
		default:
			break;
	}
	Refresh(part,change);
}

function ChangeColor(part:String, color:int) {
	switch(part)
	{
		case "hair":
			PlayerPrefs.SetInt("HairColor",color);
			break;
		case "eyes":
			PlayerPrefs.SetInt("EyesColor",color);
			break;
		case "top":
			PlayerPrefs.SetInt("TopColor",color);
			break;
		case "bottom":
			PlayerPrefs.SetInt("BottomColor",color);
			break;
		case "body":
			PlayerPrefs.SetInt("BodyColor",PlayerPrefs.GetInt("BodyColor") + 1);
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
			currentTop = CreateObject(currentTop,tops,topsColor,topsAvailability,.05,"Top","top",change);
			break;
		case "bottom":
			currentBottom = CreateObject(currentBottom,bottoms,bottomsColor,bottomsAvailability,.07,"Bottom","bottom",change);
			break;
		case "body":
			if(PlayerPrefs.GetInt("BodyColor") >= bodyColor.Length)
			{
				PlayerPrefs.SetInt("BodyColor",0);
			}
			if(PlayerPrefs.GetInt("BodyColor") < 0)
			{
				PlayerPrefs.SetInt("BodyColor",bodyColor.Length-1);
			}
			GetComponent(SpriteRenderer).color = bodyColor[PlayerPrefs.GetInt("BodyColor")];
			break;
		case "all":
			currentHair = CreateObject(currentHair,hair,hairColor,hairAvailability,.08,"Hair","hair",change);
			currentEyes = CreateObject(currentEyes,eyes,eyesColor,eyesAvailability,.06,"Eyes","eyes",change);
			currentTop = CreateObject(currentTop,tops,topsColor,topsAvailability,.05,"Top","top",change);
			currentBottom = CreateObject(currentBottom,bottoms,bottomsColor,bottomsAvailability,.07,"Bottom","bottom",change);
			if(PlayerPrefs.GetInt("BodyColor") >= bodyColor.Length)
			{
				PlayerPrefs.SetInt("BodyColor",0);
			}
			if(PlayerPrefs.GetInt("BodyColor") < 0)
			{
				PlayerPrefs.SetInt("BodyColor",bodyColor.Length-1);
			}
			GetComponent(SpriteRenderer).color = bodyColor[PlayerPrefs.GetInt("BodyColor")];
			break;
	}
}

function CreateObject (objectHolder:GameObject,objectArray:GameObject[],objectColorArray:Color[],availability:boolean[],zLocation:float,variableNameCap:String,variableNameLower:String, change:int) : GameObject
{
	var lastObject:GameObject = objectHolder;
	objectHolder = Instantiate(objectArray[PlayerPrefs.GetInt(variableNameCap + "Selection")],transform.position-Vector3(0,0,zLocation),Quaternion.identity);
	ReplaceObject(lastObject,1);
	objectHolder.transform.localScale = transform.localScale;
	objectHolder.GetComponent(SpriteRenderer).color = objectColorArray[PlayerPrefs.GetInt(variableNameCap + "Color")];
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
			currentHair.GetComponent(SpriteRenderer).color = hairColor[PlayerPrefs.GetInt("HairColor")];
			break;
		case "eyes":
			currentEyes.GetComponent(SpriteRenderer).color = eyesColor[PlayerPrefs.GetInt("EyesColor")];
			break;
		case "top":
			currentTop.GetComponent(SpriteRenderer).color = topsColor[PlayerPrefs.GetInt("TopColor")];
			break;
		case "bottom":
			currentBottom.GetComponent(SpriteRenderer).color = bottomsColor[PlayerPrefs.GetInt("BottomColor")];
			break;
		case "body":
			if(PlayerPrefs.GetInt("BodyColor") >= bodyColor.Length)
			{
				PlayerPrefs.SetInt("BodyColor",0);
			}
			if(PlayerPrefs.GetInt("BodyColor") < 0)
			{
				PlayerPrefs.SetInt("BodyColor",bodyColor.Length-1);
			}
			GetComponent(SpriteRenderer).color = bodyColor[PlayerPrefs.GetInt("BodyColor")];
			break;
	}
}

function Save () {
	save = [PlayerPrefs.GetInt("HairSelection"),PlayerPrefs.GetInt("EyesSelection"),PlayerPrefs.GetInt("TopSelection"),PlayerPrefs.GetInt("BottomSelection"),PlayerPrefs.GetInt("HairColor"),PlayerPrefs.GetInt("EyesColor"),PlayerPrefs.GetInt("TopColor"),PlayerPrefs.GetInt("BottomColor"),PlayerPrefs.GetInt("BodyColor")];
}

function Revert () {
	PlayerPrefs.SetInt("HairSelection",save[0]);
	PlayerPrefs.SetInt("EyesSelection",save[1]);
	PlayerPrefs.SetInt("TopSelection",save[2]);
	PlayerPrefs.SetInt("BottomSelection",save[3]);
	
	PlayerPrefs.SetInt("HairColor",save[4]);
	PlayerPrefs.SetInt("EyesColor",save[5]);
	PlayerPrefs.SetInt("TopColor",save[6]);
	PlayerPrefs.SetInt("BottomColor",save[7]);
	PlayerPrefs.SetInt("BodyColor",save[8]);
	
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
		
	for(var hairPiece:GameObject in hair)
	{
		if(!PlayerPrefs.HasKey("Hair:"+hairPiece.transform.name))
		{
			PlayerPrefs.SetInt("Hair:"+hairPiece.transform.name,0);
		}
	}
	for(var eyesPiece:GameObject in eyes)
	{
		if(!PlayerPrefs.HasKey("Eyes:"+eyesPiece.transform.name))
		{
			PlayerPrefs.SetInt("Eyes:"+eyesPiece.transform.name,0);
		}
	}
	for(var topsPiece:GameObject in tops)
	{
		if(!PlayerPrefs.HasKey("Tops:"+topsPiece.transform.name))
		{
			PlayerPrefs.SetInt("Tops:"+topsPiece.transform.name,0);
		}
	}
	for(var bottomsPiece:GameObject in bottoms)
	{
		if(!PlayerPrefs.HasKey("Bottoms:"+bottomsPiece.transform.name))
		{
			PlayerPrefs.SetInt("Bottoms:"+bottomsPiece.transform.name,0);
		}
	}
	PlayerPrefs.SetInt("Hair:"+hair[0].transform.name,1);
	PlayerPrefs.SetInt("Eyes:"+eyes[0].transform.name,1);
	PlayerPrefs.SetInt("Tops:"+tops[0].transform.name,1);
	PlayerPrefs.SetInt("Bottoms:"+bottoms[0].transform.name,1);
	PlayerPrefs.SetInt("Hair:"+hair[1].transform.name,1);
	PlayerPrefs.SetInt("Tops:"+tops[1].transform.name,1);
	PlayerPrefs.SetInt("Bottoms:"+bottoms[1].transform.name,1);
	for(var hairCheck:int = 0; hairCheck < hair.length; hairCheck++)
	{
		if(PlayerPrefs.GetInt("Hair:"+hair[hairCheck].transform.name) == 0)
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
		if(PlayerPrefs.GetInt("Eyes:"+eyes[eyesCheck].transform.name) == 0)
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
		if(PlayerPrefs.GetInt("Tops:"+tops[topsCheck].transform.name) == 0)
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
		if(PlayerPrefs.GetInt("Bottoms:"+bottoms[bottomsCheck].transform.name) == 0)
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
		PlayerPrefs.SetInt("Hair:"+hairPiece.transform.name,1);
	}
	for(var eyesPiece:GameObject in eyes)
	{
		PlayerPrefs.SetInt("Eyes:"+eyesPiece.transform.name,1);
	}
	for(var topsPiece:GameObject in tops)
	{
		PlayerPrefs.SetInt("Tops:"+topsPiece.transform.name,1);
	}
	for(var bottomsPiece:GameObject in bottoms)
	{
		PlayerPrefs.SetInt("Bottoms:"+bottomsPiece.transform.name,1);
	}
}
function LockAllOptions () {
	for(var hairPiece:GameObject in hair)
	{
		PlayerPrefs.SetInt("Hair:"+hairPiece.transform.name,0);
	}
	for(var eyesPiece:GameObject in eyes)
	{
		PlayerPrefs.SetInt("Eyes:"+eyesPiece.transform.name,0);
	}
	for(var topsPiece:GameObject in tops)
	{
		PlayerPrefs.SetInt("Tops:"+topsPiece.transform.name,0);
	}
	for(var bottomsPiece:GameObject in bottoms)
	{
		PlayerPrefs.SetInt("Bottoms:"+bottomsPiece.transform.name,0);
	}
	PlayerPrefs.SetInt("Hair:"+hair[1].transform.name,1);
	PlayerPrefs.SetInt("Eyes:"+eyes[0].transform.name,1);
	PlayerPrefs.SetInt("Tops:"+tops[1].transform.name,1);
	PlayerPrefs.SetInt("Bottoms:"+bottoms[0].transform.name,1);
}


function Move() {
	while(true)
	{ 
		var waitTime:float;
		if(speedOverride)
		{
			waitTime = thisSpeed * .7;
		}
		else
		{
			waitTime = speed * .7;
		}
		step = 1;
		yield WaitForSeconds(waitTime);
		step = 2;
		yield WaitForSeconds(waitTime);
		step = 3;
		yield WaitForSeconds(waitTime);
		step = 4;
		yield WaitForSeconds(waitTime);
	}
}

function SetSongSprite(spriteNumber:int) {
	step = spriteNumber+1;
}