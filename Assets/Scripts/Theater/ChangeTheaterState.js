#pragma strict

var newState:TheaterStatus;
var manager:PlayerManager;
var removeLedger:boolean;
var hidden:boolean;
var leave:boolean;
private var done:boolean;
var transition:GameObject;

var vertical:boolean;

function Start () {
	done = false;
}

function Update () {

}

function Clicked () {
	// Handles info if the ledger is being put away, regardless of location.
	if(removeLedger)
	{
		if(TheaterController.currentState == TheaterStatus.HomeLedger)
		{
			TheaterController.currentState = TheaterStatus.Home;
		}
		else
		{

			TheaterController.currentState = TheaterStatus.Front;
		}
	}
	// Handles info if the goal is to leave the scene.
	else if(leave && (!vertical || TheaterController.currentState != TheaterStatus.HomeLedger))
	{
		if(transition != null && !done)
		{
			var controller:Master = Camera.main.GetComponent(Master);
			Audio.PlaySoundTransition(controller.selectedWorldTransitionOut);
			Camera.main.GetComponent(Master).worldNameLine1 = " ";
			Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
			done = true;
		}
		yield WaitForSeconds(.7);
		Audio.StopSong();
		yield WaitForSeconds(1.3);
		Application.LoadLevel("WorldSelect");
	}
	else
	{
		if(newState == TheaterStatus.Home && TheaterController.currentState == TheaterStatus.FrontLedger)
		{
			TheaterController.currentState = TheaterStatus.HomeLedger;
		}
		else if(newState == TheaterStatus.Front && TheaterController.currentState == TheaterStatus.HomeLedger)
		{
			TheaterController.currentState = TheaterStatus.FrontLedger;
		}
		else if(newState == TheaterStatus.HomeLedger && TheaterController.currentState == TheaterStatus.Front)
		{
			TheaterController.currentState = TheaterStatus.FrontLedger;
		}
		else
		{
			if((TheaterController.currentState == TheaterStatus.HomeLedger || TheaterController.currentState == TheaterStatus.FrontLedger) && hidden)
			{
			}
			else
			{
				TheaterController.currentState = newState;
			}
		}
	}
}