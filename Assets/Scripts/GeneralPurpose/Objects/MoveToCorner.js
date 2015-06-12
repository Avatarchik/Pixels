#pragma strict

var vertical:Vector2;
var horizontal:Vector2;

function Start () {

}

function Update () {
	if(Master.vertical)
	{
		transform.position.x = vertical.x;
		transform.position.y = vertical.y;
	}
	else
	{
		transform.position.x = horizontal.x;
		transform.position.y = horizontal.y;
	}
}