#pragma strict

var transition:GameObject;
var done:boolean;
var controller:Master;

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
		controller = Camera.main.GetComponent(Master);
		Audio.PlaySoundTransition(controller.selectedWorldTransitionIn);
		Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
		done = true;
	}
	yield WaitForSeconds(.7);
	Audio.StopSong();
	yield WaitForSeconds(1.3);
	if(controller.selectedWorld == WorldSelect.Theater)
	{
		Application.LoadLevel("Theater");
	}
	else
	{
		Application.LoadLevel("MicroGameLauncher");
	}
}