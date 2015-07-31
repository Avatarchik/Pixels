#pragma strict


var destination:float;

var speed:float;

function Start () {
	speed = 6;
}

function Update () {
	transform.position.x = Mathf.MoveTowards(transform.position.x,destination,Time.deltaTime * speed);
	if(transform.position.x == destination)
	{
		Destroy(gameObject);
	}
}