#pragma strict

var showOnStep1:boolean;
var showOnStep2:boolean;
var change:int;

var locations169:RemixStepButtonLocations;
var locations43:RemixStepButtonLocations;
@HideInInspector var locations:RemixStepButtonLocations;

var showXLoc:float;
var hideXLoc:float;

function Start () {
	if(Master.device == "16:9")
	{
		locations = locations169;
	}
	else if(Master.device == "4:3")
	{
		locations = locations43;
	}
}

function Update () {
	if(RemixManager.step == 1)
	{
		if(showOnStep1)
		{
			transform.position.x = Mathf.MoveTowards(transform.position.x,locations.showXLoc,Time.deltaTime*25);
		}
		else
		{
			transform.position.x = Mathf.MoveTowards(transform.position.x,locations.hideXLoc,Time.deltaTime*25);
		}
	}
	else if(RemixManager.step == 2)
	{
		if(showOnStep2)
		{
			transform.position.x = Mathf.MoveTowards(transform.position.x,locations.showXLoc,Time.deltaTime*25);
		}
		else
		{
			transform.position.x = Mathf.MoveTowards(transform.position.x,locations.hideXLoc,Time.deltaTime*25);
		}
	}
	else
	{
		transform.position.x = Mathf.MoveTowards(transform.position.x,locations.hideXLoc,Time.deltaTime*25);
	}
}

function Clicked () {
	if(RemixManager.step == 1 || RemixManager.step == 2)
	{
		RemixManager.step += change;
	}
}

class RemixStepButtonLocations {
	var showXLoc:float;
	var hideXLoc:float;
}