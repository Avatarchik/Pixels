#pragma strict

var lights:SpriteRenderer[];

var times:float[];

@HideInInspector var active:int;

@HideInInspector var speed:float;

function Start () {
	active = 0;
	speed = .4;
	Timer();
}

function Update () {
	for(var i:int = 0; i < lights.length; i++)
	{
		if(active == i)
		{
			lights[i].color.a = Mathf.MoveTowards(lights[i].color.a,1,Time.deltaTime*speed);
		}
		else
		{
			lights[i].color.a = Mathf.MoveTowards(lights[i].color.a,0,Time.deltaTime*speed);
		}
	}
}

function Timer () {
	for(var i:int = 0; i < times.length; i++)
	{
		while(ShowManager.currentMusicLocation < times[i])
		{
			yield;
		}
		active ++;
	}
}