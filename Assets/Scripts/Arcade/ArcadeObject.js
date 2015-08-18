#pragma strict

@HideInInspector var centered:boolean;
@HideInInspector var unlocked:boolean;

var name:String;

function Start () {
	centered = false;
	unlocked = false;
	if(PlayerPrefs.GetInt("Arcade"+name) == 0)
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