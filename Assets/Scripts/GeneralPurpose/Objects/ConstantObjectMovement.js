#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

enum TypeOfMovement{Rotate,Move,Float};
var jumpy:boolean = false;
var jumpWait:float = .1;

var movement:TypeOfMovement;
var speed:Vector3;
var floatFrequency:float;
var floatOffset:float;
var destroy:boolean;
var timeToDestroy:float;

var origin:Vector3;

function Start () {
	origin = transform.localPosition;
	if(speed == null)
	{
		speed = Vector3(0,0,0);
	}
	if(floatFrequency == null)
	{
		floatFrequency = 0;
	}
	if(jumpy)
	{
		StartCoroutine(Jumpy(jumpWait));
	}
}

function Update () {
	if(destroy)
	{
		timeToDestroy -= Time.deltaTime;
		if(timeToDestroy < 0)
		{
			Destroy(gameObject);
		}
	}
	if(!jumpy)
	{
		switch(movement)
			{
				case TypeOfMovement.Rotate:
					transform.Rotate(speed * Time.deltaTime);
					break;
				case TypeOfMovement.Move:
					transform.position += Time.deltaTime * speed;
					break;
				case TypeOfMovement.Float:
					if(speed.x !=0)
					{
						transform.localPosition.x = origin.x + Vector3(Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.x,Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.y, Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.z).x;
					}
					if(speed.y !=0)
					{
						transform.localPosition.y = origin.y + Vector3(Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.x,Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.y, Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.z).y;
					}
					if(speed.z !=0)
					{
						transform.localPosition.z = origin.z + Vector3(Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.x,Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.y, Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.z).z;
					}
					break;
				default:
					break;
			}
	}
}

function Jumpy (time:float) {
	var start:float = time;
	var distance:Vector3 = Vector3.zero;
	while(true)
	{
	//	Debug.Log(time);
		if(time > 0)
		{
			time -= Time.deltaTime;
			distance += Time.deltaTime * speed;
		}
		else
		{
			transform.position += distance;
			distance = Vector3.zero;
			time = start;
		}
		yield;
	}
	yield;
}