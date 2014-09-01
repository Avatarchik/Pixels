#pragma strict

var transition:GameObject;
var done:boolean;

function Start () {
	done = false;
}
function Clicked () {
	
	if(WorldMapManager.currentState == MapStatus.Confirmation)
	{
		Load();
	}
}

function Load () {
	if(transition != null && !done)
	{
		Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
		done = true;
	}
	yield WaitForSeconds(2);
	Application.LoadLevel("MicroGameLauncher");
}