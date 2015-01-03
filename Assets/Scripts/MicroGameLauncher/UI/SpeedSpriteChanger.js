#pragma strict

var speedSprites:GameObject[];

function SpeedChange (speed:int) {
	speedSprites[speed-1].SetActive(true);
}