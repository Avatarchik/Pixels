#pragma strict

var showOnStep1:boolean;
var showOnStep2:boolean;
var change:int;

var showXLoc:float;
var hideXLoc:float;

function Start () {

}

function Update () {
	if(RemixManager.step == 1)
	{
		if(showOnStep1)
		{
			transform.position.x = Mathf.MoveTowards(transform.position.x,showXLoc,Time.deltaTime*25);
		}
		else
		{
			transform.position.x = Mathf.MoveTowards(transform.position.x,hideXLoc,Time.deltaTime*25);
		}
	}
	else if(RemixManager.step == 2)
	{
		if(showOnStep2)
		{
			transform.position.x = Mathf.MoveTowards(transform.position.x,showXLoc,Time.deltaTime*25);
		}
		else
		{
			transform.position.x = Mathf.MoveTowards(transform.position.x,hideXLoc,Time.deltaTime*25);
		}
	}
	else
	{
		transform.position.x = Mathf.MoveTowards(transform.position.x,hideXLoc,Time.deltaTime*25);
	}
}

function Clicked () {
	if(RemixManager.step == 1 || RemixManager.step == 2)
	{
		RemixManager.step += change;
	}
}