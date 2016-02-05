#pragma strict

var manager:CreditsManager;

function Start () {
	
}

function Clicked () {
	if(manager.newNote == null)
	{
		manager.Leave();
	}
}