#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var step:int;
@HideInInspector var counter:float;
var icons:Sprite[];

function Start () {
	step = 0;
	counter = 0;
}

function Update () {
	GetComponent(SpriteRenderer).sprite = icons[step];
	counter += Time.deltaTime;
	if(counter > 3)
	{
		step = 0;
	}
}

function Clicked () {
	if(!Master.notifying)
	{
		counter = 0;
		if(step < 4)
		{
			step++;
		}
		else
		{
			Camera.main.GetComponent(Master).ResetGame();
		}
	}
}