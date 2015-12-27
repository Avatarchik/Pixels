#pragma strict

var events:SceneEvent[];

var pressable:float;
@HideInInspector var pressableTime:float;

@HideInInspector var currentEvent:int;

function Start () {
	pressable = -1;
	currentEvent = 0;
	GamePlay();
}

function Update () {
	pressable -= Time.deltaTime * Time.timeScale;
}

function GamePlay () {
	while(ShowManager.currentMusicLocation < events[currentEvent].time)
	{
		yield;
	}
	for(var i:int = 0; i < events.length; i++)
	{
		pressable = pressableTime;
		currentEvent ++;
		while(ShowManager.currentMusicLocation < events[currentEvent].time)
		{
			yield;
		}
	}
}	
class SceneEvent {
	var name:String;
	var time:float;
	var objects:GameObject[];
}

function StartEvent () {
	
}