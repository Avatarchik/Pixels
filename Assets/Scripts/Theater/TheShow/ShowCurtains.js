#pragma strict

var curtains:GameObject[];
var goals:Vector3[];

@HideInInspector var speed:float;

@HideInInspector var origins:Vector3[];

function Start () {
	speed = 5;
	origins = new Vector3[curtains.length];
	for(var i:int = 0; i < curtains.length; i++)
	{
		origins[i] = curtains[i].transform.position;
	}
}

function Open () {
	for(var i:int = 0; i < curtains.length; i++)
	{
		GoTo(curtains[i],origins[i]);
	}
}	

function Close () {
	for(var i:int = 0; i < curtains.length; i++)
	{
		GoTo(curtains[i],goals[i]);
		if(i == curtains.Length -1)
		{
			GoTo(curtains[i],goals[i]);
		}
	}
}

function GoTo (object:GameObject, destination:Vector3) {
	while(object.transform.position != destination)
	{
		object.transform.position = Vector3.MoveTowards(object.transform.position,destination,Time.deltaTime * speed);
		yield;
	}
}