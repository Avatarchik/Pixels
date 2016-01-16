#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var destination:float;

var speed:float;

var origin:float;

function Start () {
	origin = transform.localPosition.x;
	speed = 6;
	Sway();
}

function Update () {
	if(TitleManager.started)
	{
		transform.localPosition.x = Mathf.MoveTowards(transform.localPosition.x,destination,Time.deltaTime * speed);
		if(transform.localPosition.x == destination)
		{
			Destroy(gameObject);
		}
	}
}
function Sway () {
	while(!TitleManager.started)
	{
		var newPosition:float = origin + Random.Range(-.15,.15);
		var newSpeed:float = Random.Range(.05,.12);
		while(Mathf.Round(transform.position.x * 1000)  != Mathf.Round(newPosition*1000))
		{
			transform.position.x = Mathf.Lerp(transform.position.x,newPosition, newSpeed * Time.deltaTime);
			transform.position.x = Mathf.MoveTowards(transform.position.x,newPosition, newSpeed * Time.deltaTime * .3);
			yield;
		}
	}
}