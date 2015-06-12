#pragma strict

var text:String;

public enum MiniGameControlType{Tap,Tilt,LeftRight,Drag};
var gameControl:MiniGameControlType;

// Sprites
var tap:Sprite;
var tilt:Sprite;
var leftRight:Sprite;
var drag:Sprite;

var origin:float;
var target:float;
var children:GameObject[];

function Start () {
	transform.position.y = 20;
	origin = transform.position.y;
	if(GameObject.FindGameObjectWithTag("MicroGame") != null)
	{
		//gameControl = GameObject.FindGameObjectWithTag("MicroGame").GetComponent(MicroGameManager).controls;
	}
	switch(gameControl)
	{
		case MiniGameControlType.Tap:
			GetComponent(SpriteRenderer).sprite = tap;
			break;
		case MiniGameControlType.Tilt:
			GetComponent(SpriteRenderer).sprite = tilt;
			break;
		case MiniGameControlType.LeftRight:
			GetComponent(SpriteRenderer).sprite = leftRight;
			break;	
		case MiniGameControlType.Drag:
			GetComponent(SpriteRenderer).sprite = drag;
			break;
		default:
			break;
	}
	if(Camera.main.GetComponent(Master) != null)
	{
		GetComponent(SpriteRenderer).color = Camera.main.GetComponent(Master).currentWorld.basic.colors[Random.Range(0,Camera.main.GetComponent(Master).currentWorld.basic.colors.Length)];
	}
	MoveTo();
}

function MoveTo(){
	yield WaitForSeconds(.3);
	while(transform.position.y > target + .1)
	{
		transform.position.y = Mathf.Lerp(transform.position.y,target,Time.deltaTime*8);
		yield;
	}
	yield WaitForSeconds(.6);
	MoveBack();
	yield;
}

function MoveBack(){
	while(transform.position.y < origin - .1)
	{
		transform.position.y = Mathf.Lerp(transform.position.y,origin,Time.deltaTime*3);
		yield;
	}
	Destroy(gameObject);
}