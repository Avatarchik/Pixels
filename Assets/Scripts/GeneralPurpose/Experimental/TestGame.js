#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var timer:float;	

var finished:boolean;

function Start () {
	finished = false;
	timer = 4;
}

function Update () {
	if(Input.GetKeyDown("space") && !finished)
	{
		if(Application.loadedLevelName == "MicroTester")
		{
			GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(false);
		}
		else
		{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(false);
		}
		finished = true;
	}
	if( timer > 0)
	{
	timer -= Time.deltaTime *(MicroTester.timeMultiplier/10);
	}
	else if(!finished)
	{
		if(Application.loadedLevelName == "MicroTester")
		{
			GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(true);
		}
		else
		{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(true);
		}
		finished = true;
	}
	GetComponent(TextMesh).text = timer.ToString();
}