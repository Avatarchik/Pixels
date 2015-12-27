#pragma strict

var events:SceneEvent[];

var lights:SpriteRenderer[];

@HideInInspector var pressable:float;
@HideInInspector var pressableTime:float;
@HideInInspector var pressableEvent:int;
@HideInInspector var incorrectPresses:int;

function Start () {
	pressable = -1;
	pressableTime = .4;
	incorrectPresses = 0;
	pressableEvent = -1;
	GamePlay();
	for(var i:int = 0; i < events.length;i++)
	{
		events[i].time -= .1;
	}
}

function Update () {
	pressable -= Time.deltaTime * Time.timeScale;
	for(var i:int = 0; i < lights.length; i++)
	{
		if(pressable >= 0)
		{
			lights[i].color.a = Mathf.MoveTowards(lights[i].color.a,1,Time.deltaTime * 13);
		}
		else
		{
			lights[i].color.a = Mathf.MoveTowards(lights[i].color.a,0,Time.deltaTime * 13);
		}	
	}
	if(Input.GetKeyDown("space"))
	{
		StartEvent();
	}
}

function GamePlay () {
	for(var i:int = 0; i < events.length; i++)
	{
		while(ShowManager.currentMusicLocation < events[i].time)
		{
			yield;
		}
		if(i == 0)
		{
			ShowManager.good = true;
		}
		pressable = pressableTime;
		pressableEvent = i;
		BackUp(i);
	}
}	

function BackUp (which:int) {
	yield WaitForSeconds(pressableTime + .2);
	if(events[which].necessary && !events[which].success)
	{
		for(var i:int = 0; i < events[which].objects.length; i++)
		{
			events[which].objects[i].BroadcastMessage("StartEvent",SendMessageOptions.DontRequireReceiver);
		}
	}	
}

class SceneEvent {
	var name:String;
	var time:float;
	var objects:GameObject[];
	var necessary:boolean;
	@HideInInspector var success:boolean;
}

function StartEvent () {
	if(pressable >= 0)
	{
		pressable = -1;
		if(pressableEvent >= 0)
		{
			events[pressableEvent].success = true;
			for(var i:int = 0; i < events[pressableEvent].objects.length; i++)
			{
				events[pressableEvent].objects[i].BroadcastMessage("StartEvent",pressableEvent,SendMessageOptions.DontRequireReceiver);
			}
		}
	}
	else
	{
		incorrectPresses ++;
	}
}