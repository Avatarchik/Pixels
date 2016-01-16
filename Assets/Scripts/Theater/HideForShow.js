#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

function Start () {

}

function Update () {
	if(TheaterController.currentState == TheaterStatus.Show)
	{
		GetComponent(SpriteRenderer).color.a = 0;
	}
}