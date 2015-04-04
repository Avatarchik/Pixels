#pragma strict

// Current position of the player.
public enum PlayerState{StandingFront,StandingBack,StandingLeft,StandingRight,WalkingFront,WalkingBack,WalkingLeft,WalkingRight,SpecialHandsOut}
var currentState:PlayerState;
static var speed:float;

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

function Start () {	
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
	currentTop = Instantiate(tops[PlayerPrefs.GetInt("TopSelection")],transform.position-Vector3(0,0,.07),Quaternion.identity);
		currentTop.transform.localScale = transform.lossyScale;
		currentTop.GetComponent(SpriteRenderer).color = topsColor[PlayerPrefs.GetInt("TopColor")];
		currentTop.transform.parent = transform;
	currentBottom = Instantiate(bottoms[PlayerPrefs.GetInt("BottomSelection")],transform.position-Vector3(0,0,.05),Quaternion.identity);
		currentBottom.transform.localScale = transform.lossyScale;
		currentBottom.GetComponent(SpriteRenderer).color = bottomsColor[PlayerPrefs.GetInt("BottomColor")];
		currentBottom.transform.parent = transform;
	if(PlayerPrefs.GetInt("BodyColor") < bodyColor.Length)
	{
		GetComponent(SpriteRenderer).color = bodyColor[PlayerPrefs.GetInt("BodyColor")];
	}
	
	Save();
}

function Update () {
}

function ChangePart(part:String, change:int) {
	switch(part)
	{
		case "hair":
			PlayerPrefs.SetInt("HairSelection",PlayerPrefs.GetInt("HairSelection")+change);
			break;
		case "eyes":
			PlayerPrefs.SetInt("EyesSelection",PlayerPrefs.GetInt("EyesSelection")+change);
			break;
		case "top":
			PlayerPrefs.SetInt("TopSelection",PlayerPrefs.GetInt("TopSelection")+change);
			break;
		case "bottom":
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
	Refresh(part);
}

function Refresh(part:String) {
	Refresh(part,0);
}
function Refresh(part:String, change:int) {
	switch(part)
	{
		case "hair":
			Destroy(currentHair);
			if(PlayerPrefs.GetInt("HairSelection") >= hair.Length)
			{
				PlayerPrefs.SetInt("HairSelection", 0);
			}
			else if(PlayerPrefs.GetInt("HairSelection") < 0)
			{
				PlayerPrefs.SetInt("HairSelection", hair.Length-1);
			}
			currentHair = Instantiate(hair[PlayerPrefs.GetInt("HairSelection")],transform.position-Vector3(0,0,.08),Quaternion.identity);
			currentHair.transform.localScale = transform.localScale;
			currentHair.GetComponent(SpriteRenderer).color = hairColor[PlayerPrefs.GetInt("HairColor")];
			currentHair.transform.parent = transform;
			if(hairAvailability[PlayerPrefs.GetInt("HairSelection")]==false)
			{
				ChangePart("hair",change);
			}
			break;
		case "eyes":
			Destroy(currentEyes);
			if(PlayerPrefs.GetInt("EyesSelection") >= eyes.Length)
			{
				PlayerPrefs.SetInt("EyesSelection", 0);
			}
			else if(PlayerPrefs.GetInt("EyesSelection") < 0)
			{
				PlayerPrefs.SetInt("EyesSelection", eyes.Length-1);
			}
			currentEyes = Instantiate(eyes[PlayerPrefs.GetInt("EyesSelection")],transform.position-Vector3(0,0,.06),Quaternion.identity);
			currentEyes.transform.localScale = transform.localScale;
			currentEyes.GetComponent(SpriteRenderer).color = eyesColor[PlayerPrefs.GetInt("EyesColor")];
			currentEyes.transform.parent = transform;
			if(eyesAvailability[PlayerPrefs.GetInt("EyesSelection")]==false)
			{
				ChangePart("eyes",change);
			}
			break;
		case "top":
			Destroy(currentTop);
			if(PlayerPrefs.GetInt("TopSelection") >= tops.Length)
			{
				PlayerPrefs.SetInt("TopSelection", 0);
			}
			else if(PlayerPrefs.GetInt("TopSelection") < 0)
			{
				PlayerPrefs.SetInt("TopSelection", tops.Length-1);
			}
			currentTop = Instantiate(tops[PlayerPrefs.GetInt("TopSelection")],transform.position-Vector3(0,0,.07),Quaternion.identity);
			currentTop.transform.localScale = transform.localScale;
			currentTop.GetComponent(SpriteRenderer).color = topsColor[PlayerPrefs.GetInt("TopColor")];
			currentTop.transform.parent = transform;
			if(topsAvailability[PlayerPrefs.GetInt("TopSelection")]==false)
			{
				ChangePart("top",change);
			}
			break;
		case "bottom":
			Destroy(currentBottom);
			if(PlayerPrefs.GetInt("BottomSelection") >= bottoms.Length)
			{
				PlayerPrefs.SetInt("BottomSelection", 0);
			}
			else if(PlayerPrefs.GetInt("BottomSelection") < 0)
			{
				PlayerPrefs.SetInt("BottomSelection", bottoms.Length-1);
			}
			currentBottom = Instantiate(bottoms[PlayerPrefs.GetInt("BottomSelection")],transform.position-Vector3(0,0,.05),Quaternion.identity);
			currentBottom.transform.localScale = transform.localScale;
			currentBottom.GetComponent(SpriteRenderer).color = bottomsColor[PlayerPrefs.GetInt("BottomColor")];
			currentBottom.transform.parent = transform;
			if(bottomsAvailability[PlayerPrefs.GetInt("BottomSelection")]==false)
			{
				ChangePart("bottom",change);
			}
			break;
		case "body":
			if(PlayerPrefs.GetInt("BodyColor") >= bodyColor.Length)
			{
				PlayerPrefs.SetInt("BodyColor",0);
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
	PlayerPrefs.SetInt("Hair:"+hair[0].transform.name,1);
	PlayerPrefs.SetInt("Eyes:"+eyes[0].transform.name,1);
	PlayerPrefs.SetInt("Tops:"+tops[0].transform.name,1);
	PlayerPrefs.SetInt("Bottoms:"+bottoms[0].transform.name,1);
}