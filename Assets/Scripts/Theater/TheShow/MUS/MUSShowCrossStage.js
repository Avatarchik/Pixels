#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var goal:float;
var speed:float;
var height:float;

function Start () {
	transform.position.y = height;
	transform.position.z = 8.3;
	if(Random.value > .5)
	{
		transform.position.x = 15;
		goal = -15;
	}
	else
	{
		transform.position.x = -15;
		goal = 15;
	}
	Move();
}

function Move () {
	while(transform.position.x != goal)
	{
		transform.position.x = Mathf.MoveTowards(transform.position.x,goal,Time.deltaTime * speed);
		yield;
	}
	Destroy(gameObject);
}