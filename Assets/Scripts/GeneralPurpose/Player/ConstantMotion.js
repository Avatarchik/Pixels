#pragma strict

var flipped:int;
var wait:float;
var crossing:boolean;

function Start () {
	if(crossing)
	{
		if(transform.position.x > transform.parent.transform.position.x)
		{
			flipped = -1;
		}
		else
		{
			flipped = 1;
		}
	}
}

function Update () {
	GetComponent(AnimationManager).flipped = flipped;
	GetComponent(PlayerManager).speed = wait;
}