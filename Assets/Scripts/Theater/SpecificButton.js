#pragma strict

private var manager:TheaterCustomizeManager;
private var controller:TheaterController;

var hide:boolean;
var thisPartNumber:int;

function Start () {
	manager = GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterCustomizeManager);
	controller = GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterController);
}

function Clicked () {
	if(!hide || (controller.currentState == TheaterStatus.Home || controller.currentState == TheaterStatus.Front))
	{
		manager.currentSelected = thisPartNumber;
	}
	if(controller.currentState == TheaterStatus.Home)
	{
		controller.currentState = TheaterStatus.HomeLedger;
	}
	if(controller.currentState == TheaterStatus.Front)
	{
		controller.currentState = TheaterStatus.FrontLedger;
	}
}