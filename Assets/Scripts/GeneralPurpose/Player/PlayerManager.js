#pragma strict

// Current position of the player.
public enum PlayerState{StandingFront,StandingBack,StandingLeft,StandingRight,WalkingFront,WalkingBack,WalkingLeft,WalkingRight}
static var currentState:PlayerState;
static var speed:float;

// Arrays with different types of sprites.
var hair:GameObject[];
var eyes:GameObject[];
var tops:GameObject[];
var bottoms:GameObject[];

// Arrays with possible colors;
var hairColor:Color[];
var eyesColor:Color[];
var topsColor:Color[];
var bottomsColor:Color[];

// Current instantiated sprite sheets.
var currentHair:GameObject;
var currentEyes:GameObject;
var currentTop:GameObject;
var currentBottom:GameObject;

var save:int[];

function Start () {	
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
		
		Save();
}

function Update () {
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
}

function ChangePart(part:String, change:int) {
	switch(part)
	{
		case "hair":
			PlayerPrefs.SetInt("HairSelection",PlayerPrefs.GetInt("HairSelection")+change);
			Refresh("hair");
			break;
		case "eyes":
			PlayerPrefs.SetInt("EyesSelection",PlayerPrefs.GetInt("EyesSelection")+change);
			Refresh("eyes");
			break;
		case "top":
			PlayerPrefs.SetInt("TopSelection",PlayerPrefs.GetInt("TopSelection")+change);
			Refresh("top");
			break;
		case "bottom":
			PlayerPrefs.SetInt("BottomSelection",PlayerPrefs.GetInt("BottomSelection")+change);
			Refresh("bottom");
			break;
		default:
			break;
	}
}

function ChangeColor(part:String, color:int) {
	switch(part)
	{
		case "hair":
			PlayerPrefs.SetInt("HairColor",color);
			Refresh("hair");
			break;
		case "eyes":
			PlayerPrefs.SetInt("EyesColor",color);
			Refresh("eyes");
			break;
		case "top":
			PlayerPrefs.SetInt("TopColor",color);
			Refresh("top");
			break;
		case "bottom":
			PlayerPrefs.SetInt("BottomColor",color);
			Refresh("bottom");
			break;
		default:
			break;
	}
}

function Refresh(part:String) {
	switch(part)
	{
		case "hair":
			Destroy(currentHair);
			if(PlayerPrefs.GetInt("HairSelection") == hair.Length)
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
			break;
		case "eyes":
			Destroy(currentEyes);
			if(PlayerPrefs.GetInt("EyesSelection") == eyes.Length)
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
			break;
		case "top":
			Destroy(currentTop);
			if(PlayerPrefs.GetInt("TopSelection") == tops.Length)
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
			break;
		case "bottom":
			Destroy(currentBottom);
			if(PlayerPrefs.GetInt("BottomSelection") == bottoms.Length)
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
			break;
	}
}

function Save () {
	save = [PlayerPrefs.GetInt("HairSelection"),PlayerPrefs.GetInt("EyesSelection"),PlayerPrefs.GetInt("TopSelection"),PlayerPrefs.GetInt("BottomSelection"),PlayerPrefs.GetInt("HairColor"),PlayerPrefs.GetInt("EyesColor"),PlayerPrefs.GetInt("TopColor"),PlayerPrefs.GetInt("BottomColor")];
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
			
			Refresh("hair");
			Refresh("eyes");
			Refresh("top");
			Refresh("bottom");
}