#pragma strict

enum TypeOfMovement{Rotate,Move};

var movement:TypeOfMovement;
var speed:Vector3;
var destroy:boolean;
var timeToDestroy:float;

function Start () {
	if(speed == null)
	{
		speed = Vector3(0,0,0);
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
		default:
			break;
	}
}