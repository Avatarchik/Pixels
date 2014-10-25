#pragma strict

function Clicked() {
	if(Application.loadedLevelName == "MicroTester")
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).Clicked();
	}
	else 
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).Clicked();
	}
}