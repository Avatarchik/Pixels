#pragma strict

var amount:float;
var stop:boolean;
var stopAmount:float;

function Start () {
	if(stop)
	{
		LimitedRotateStuff();
	}
	else
	{
		RotateStuff();
	}
}

function Update () {
}

function RotateStuff () {
	while(true)
	{
		transform.Rotate(Vector3(0,0,Time.deltaTime * amount));
		yield;
	}
}

function LimitedRotateStuff () {
	var soFar:float = 0;
	while(Mathf.Abs(soFar) < stopAmount)
	{
		transform.Rotate(Vector3(0,0,Time.deltaTime * amount));
		soFar += Time.deltaTime * amount;
		yield;
	}
}