#pragma strict

var events:SceneEvent[];

var lights:SpriteRenderer[];

var good:GameObject;
var bad:GameObject;

@HideInInspector var pressable:float;
@HideInInspector var pressableTime:float;
@HideInInspector var pressableEvent:int;
@HideInInspector var incorrectPresses:int;

@HideInInspector var score:float;
@HideInInspector var badScore:float;

function Start () {
	score = 0;
	pressable = -1;
	pressableTime = .4;
	incorrectPresses = 0;
	pressableEvent = -1;
	badScore = 5;
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
	yield WaitForSeconds(pressableTime + .3);
	var correct:float = 0;
	for(i = 0; i < events.length; i++)
	{
		if(events[i].success)
		{
			correct ++;
		}
	}
	score = Mathf.Max(((correct/events.length)*100) - (badScore * incorrectPresses),0);
	GameObject.FindGameObjectWithTag("ShowManager").GetComponent(ShowManager).scores[4] = score;
}	

function BackUp (which:int) {
	yield WaitForSeconds(pressableTime + .2);
	if(events[which].necessary && !events[which].success)
	{
		if(Master.vertical)
		{
			Instantiate(bad,lights[1].transform.position - Vector3(0,0,1),Quaternion.identity);
		}
		else
		{
			Instantiate(bad,lights[0].transform.position - Vector3(0,0,1),Quaternion.identity);
		}
		for(var i:int = 0; i < events[which].objects.length; i++)
		{
			events[which].objects[i].BroadcastMessage("StartEvent",which,SendMessageOptions.DontRequireReceiver);
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
			if(Master.vertical)
			{
				Instantiate(good,lights[1].transform.position - Vector3(0,0,1),Quaternion.identity);
			}
			else
			{
				Instantiate(good,lights[0].transform.position - Vector3(0,0,1),Quaternion.identity);
			}
			events[pressableEvent].success = true;
			for(var i:int = 0; i < events[pressableEvent].objects.length; i++)
			{
				events[pressableEvent].objects[i].BroadcastMessage("StartEvent",pressableEvent,SendMessageOptions.DontRequireReceiver);
			}
		}
	}
	else
	{
		if(Master.vertical)
		{
			Instantiate(bad,lights[1].transform.position - Vector3(0,0,1),Quaternion.identity);
		}
		else
		{
			Instantiate(bad,lights[0].transform.position - Vector3(0,0,1),Quaternion.identity);
		}
		incorrectPresses ++;
	}
}