#pragma strict

@HideInInspector var centered:boolean;
@HideInInspector var unlocked:boolean;

var gameName:String;

function Start () {
	centered = false;
	unlocked = false;
	if(PlayerPrefs.GetInt("Arcade"+gameName) == 0)
	{
		unlocked = false;
	}	
	else
	{
		unlocked = true;
	}
}

function Update () {

}