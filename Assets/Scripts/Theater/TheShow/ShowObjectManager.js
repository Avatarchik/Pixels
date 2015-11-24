#pragma strict

var show:Vector3;
var hide:Vector3;
var movementSpeed:float;
var colorChangeSpeed:float;

@HideInInspector var showing:boolean;
@HideInInspector var hiding:boolean;
@HideInInspector var changingColor:boolean;

function Start () {
	showing = false;
	hiding = false;
	changingColor = false;
	if(colorChangeSpeed == 0)
	{
		colorChangeSpeed = 1;
	}
	if(movementSpeed == 0)
	{
		movementSpeed = 3;
	}
	if(show == Vector3.zero)
	{
		show = transform.position;
	}
	if(hide == Vector3.zero)
	{
		hide = transform.position;
	}
}

function Update () {

}

function Show () {
	showing = true;
	hiding = false;
	while(transform.position != show && showing)
	{
		transform.position = Vector3.MoveTowards(transform.position,show,Time.deltaTime*movementSpeed);
		yield;
	}
}

function Hide () {
	showing = false;
	hiding = true;
	while(transform.position != show && hiding)
	{
		transform.position = Vector3.MoveTowards(transform.position,hide,Time.deltaTime*movementSpeed);
		yield;
	}
}

function ChangeColor (newColor:Color) {
	changingColor = false;
	yield;
	changingColor = true;
	if(GetComponent(SpriteRenderer).color != newColor &&  changingColor)
	{
		GetComponent(SpriteRenderer).color.r = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.r,newColor.r,Time.deltaTime * colorChangeSpeed);
		GetComponent(SpriteRenderer).color.g = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.g,newColor.g,Time.deltaTime * colorChangeSpeed);
		GetComponent(SpriteRenderer).color.b = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.b,newColor.b,Time.deltaTime * colorChangeSpeed);
		GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,newColor.a,Time.deltaTime * colorChangeSpeed);
		yield;
	}
	changingColor = false;
}