#pragma strict

var speedSprites:GameObject[];

function SpeedChange (speed:int) {
	for(var i:int = 0; i < speedSprites.length; i++)
	{
		if(i < speed)
		{
			speedSprites[i].SetActive(true);
		}
		else
		{
			speedSprites[i].SetActive(false);
		}
	}	
}