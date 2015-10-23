﻿#pragma strict

var sprites:Sprite[];

var object1:SpriteRenderer;
var object2:SpriteRenderer;

var waitTime:float;

var color1:Color;
var color2:Color;

var grow:boolean;

@HideInInspector var initialSize:Vector3;

@HideInInspector var placeHolder1:int;

@HideInInspector var placeHolder2:int;

function Start () {
	initialSize = transform.localScale;
	if(grow)
	{
		transform.localScale = Vector3.zero;
	}	
	object1.color = color1;
	object2.color = color2;
	placeHolder1 = 0;
	placeHolder2 = 2;
	Rotate();
}

function Update () {
	transform.localScale = Vector3.MoveTowards(transform.localScale,initialSize,Time.deltaTime * 50);
}

function Rotate () {
	while(true)
	{
		object1.sprite = sprites[placeHolder1];
		object2.sprite = sprites[placeHolder2];
		placeHolder1 ++;
		placeHolder2 ++;
		if(placeHolder1 >= sprites.Length)
		{
			placeHolder1 = 0;
		}
		if(placeHolder2 >= sprites.Length)
		{
			placeHolder2 = 0;
		}
		yield WaitForSeconds(waitTime);
		yield;
	}
}