﻿#pragma strict

enum TypeOfMovement{Rotate,Move,Float};

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
	switch(movement)
	{
		case TypeOfMovement.Rotate:
			transform.Rotate(speed * Time.deltaTime);
			break;
		case TypeOfMovement.Move:
			transform.position += Time.deltaTime * speed;
			break;
		case TypeOfMovement.Float:
			transform.localPosition = origin + Vector3(Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.x,Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.y, Mathf.Sin((floatOffset + Time.time) * floatFrequency) * speed.z);
			break;
		default:
			break;
	}
}