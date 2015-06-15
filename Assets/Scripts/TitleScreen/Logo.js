﻿#pragma strict

var plain:Sprite;
var logo:Sprite;

var origin:Vector3;

function Start () {
	GetComponent(SpriteRenderer).sprite = plain;
	origin = transform.localPosition;
	transform.localPosition.y += 1;
	StartCoroutine(Appear());
}

function Appear () {
	while(transform.localPosition != origin)
	{
		transform.localPosition = Vector3.MoveTowards(transform.localPosition, origin, Time.time * Time.deltaTime * 3);
		yield;
	}
	StartCoroutine(Shake(10, Vector2(0,.03)));
	if(Master.initialLoad)
	{
		yield WaitForSeconds(1.4);
	}
	else
	{
		yield WaitForSeconds(2.5);
	}
	StartCoroutine(Shake(10, Vector2(0.01,.01)));
	GetComponent(SpriteRenderer).sprite = logo;
	yield;
}

function Shake (numberShakes:int, distance:Vector2){
	var count:int = 0;
	var origin:Vector2 = transform.localPosition;
	transform.localPosition = transform.localPosition + distance;
	while(count < numberShakes)
	{
		transform.localPosition = -transform.localPosition * .85;
		yield WaitForSeconds(.004);
		count ++;
		yield;
	}
	yield;
}