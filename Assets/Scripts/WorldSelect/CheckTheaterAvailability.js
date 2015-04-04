#pragma strict

var lights:SpriteRenderer;
function Start () {
	UpdateWorldAvailability();
	if(PlayerPrefs.GetInt("Theater") != 1)
	{
		StartCoroutine(ReCheck());
	}
}

function Update () {

}

function ReCheck ()
{
	yield WaitForSeconds(.5);
	UpdateWorldAvailability();
}

function UpdateWorldAvailability () {
	if(PlayerPrefs.GetInt("Theater") == 1)
	{
		lights.color.a = 1;
	}
	else
	{
		lights.color.a = 0;
	}
}