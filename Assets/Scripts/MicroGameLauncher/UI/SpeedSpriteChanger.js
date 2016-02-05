#pragma strict

var speedSprites:GameObject[];
var currentSpeed:int;

function Start () {
	currentSpeed = 0;
	Brightness();
}

function SpeedChange (speed:int) {
	currentSpeed = speed;
}

function Brightness () {
	while(true)
	{	
		for(var i:int = 0; i < speedSprites.length; i++)
		{
			if(i < currentSpeed)
			{
				speedSprites[i].GetComponent(SpriteRenderer).color.a =  Mathf.MoveTowards(speedSprites[i].GetComponent(SpriteRenderer).color.a,1,Time.deltaTime * 5);
			}
			else
			{
				speedSprites[i].GetComponent(SpriteRenderer).color.a =  Mathf.MoveTowards(speedSprites[i].GetComponent(SpriteRenderer).color.a,0,Time.deltaTime * 5);
			}
		}	
		yield;
	}
}