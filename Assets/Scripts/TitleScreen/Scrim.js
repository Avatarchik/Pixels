#pragma strict

var plain:Sprite;
var sprite1:Sprite;
var sprite2:Sprite;
var sprite3:Sprite;
var sprite4:Sprite;
var sprite5:Sprite;
var finished:Sprite;


var origin:Vector3;

function Start () {
	GetComponent(SpriteRenderer).sprite = plain;
	StartCoroutine(Appear());
}

function Appear () {
	if(Master.initialLoad)
	{
		yield WaitForSeconds(3);
	}
	else
	{
		yield WaitForSeconds(4.1);
	}
	GetComponent(SpriteRenderer).sprite = sprite1;
	yield WaitForSeconds(.15);
	GetComponent(SpriteRenderer).sprite = sprite2;
	yield WaitForSeconds(1);
	GetComponent(SpriteRenderer).sprite = sprite3;
	yield WaitForSeconds(.15);
	GetComponent(SpriteRenderer).sprite = sprite4;
	yield WaitForSeconds(.15);
	GetComponent(SpriteRenderer).sprite = sprite5;
	yield WaitForSeconds(.15);
	GetComponent(SpriteRenderer).sprite = finished;
	yield;
}
