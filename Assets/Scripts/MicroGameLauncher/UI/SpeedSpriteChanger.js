#pragma strict

var speedSprites:GameObject[];

function SpeedChange (speed:int) {
	for(var i:int = 0; i < speed; i++)
	{
		speedSprites[i].SetActive(true);
	}	
}