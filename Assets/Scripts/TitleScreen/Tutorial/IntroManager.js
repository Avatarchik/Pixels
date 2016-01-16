#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var step:int;

var introObjects:GameObject[];

@HideInInspector var createdObjects:GameObject[];

var spotlight:GameObject;

var spotPositions:Vector2[];

@HideInInspector var done:boolean;

var shakes:boolean[];

var spot:int;

var speed:float;

function Start () {
	spot = 0;
	done = false;
	step = 0;
	speed = 0;
	createdObjects = new GameObject[introObjects.length];
	shakes = new boolean[introObjects.length];
	for(var i:int = 0; i < shakes.length; i++)
	{
		shakes[i] = false;
	}
	createdObjects[step] = Instantiate(introObjects[step]);
}

function Update () {
	speed = Mathf.Lerp(speed,30,Time.deltaTime * 1.6);
	if(createdObjects[step] == null && introObjects[step] != null)
	{
		createdObjects[step] = Instantiate(introObjects[step]);
	}
	if(!shakes[spot])
	{
		spotlight.transform.position = Vector3.MoveTowards(spotlight.transform.position,Vector3(spotPositions[spot].x,spotPositions[spot].y,transform.position.z - 1.09),Time.deltaTime * speed);
	}
	if(spotlight.transform.position == Vector3(spotPositions[spot].x,spotPositions[spot].y,transform.position.z - 1.09) && !shakes[spot])
	{
		Shake(spotlight,6);
		shakes[spot] = true;
	}
	if(step > 6 || TitleManager.currentState != TitleStatus.Intro)
	{
		spotlight.GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(spotlight.GetComponent(SpriteRenderer).color.a,0,Time.deltaTime * .1);
	}
}

function IncreaseStep () {
	step ++;
}

function End () {
	done = true;
	for(var i:int = 0; i < createdObjects.length; i++)
	{
		if(createdObjects[i] != null)
		{
			createdObjects[i].GetComponent(TutorialObject).done = true;
		}
	}
}

function SetSongSprite (spriteNumber:int) {
	if(spriteNumber == 1)
	{	
		speed = 2;
		spot ++;
	}
	else
	{
	}
}

function Shake (object:GameObject, times:int) {
	var origin:Vector3 = object.transform.position;
	var counter:int = 0;
	var difference:Vector2 = Vector2(.08,.08);
	while(counter < times)
	{
		object.transform.position.x = origin.x + difference.x;
		object.transform.position.y = origin.y + difference.y;
		difference.x = difference.x * -.8;
		difference.y = difference.y * -.8;
		counter ++;
		yield WaitForSeconds(.03);
	}
	object.transform.position = origin;
}