#pragma strict

var dependantObjects:GameObject[];

@HideInInspector var thisWorldVariable:String;
function Start () {
	thisWorldVariable = GetComponent(ChangeMapState).worldNameVar;
	UpdateWorldAvailability();
	if(PlayerPrefs.GetInt(thisWorldVariable) != 1)
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
	if(PlayerPrefs.GetInt(thisWorldVariable) == 1)
	{
		for(var object:GameObject in dependantObjects)
		{
			object.SendMessage("StartRotation",SendMessageOptions.DontRequireReceiver);
		}
	}
	else
	{
		for(var object:GameObject in dependantObjects)
		{
			object.SendMessage("StopRotation",SendMessageOptions.DontRequireReceiver);
		}
	}
}