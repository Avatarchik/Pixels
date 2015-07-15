#pragma strict

var origin:Vector3;
var difference:float;

function Start () {
	origin = transform.position;
}

function ShakeSmall (time:float) {
	difference = .07;
	while(time > 0)
	{
		transform.position = Vector3(Random.Range(origin.x-difference,origin.x+difference),Random.Range(origin.y-difference,origin.y+difference),origin.z);
		time -= Time.deltaTime;
		yield WaitForSeconds(.03);
	}
	transform.position = origin;
}

function ShakeMedium (time:float) {
	Debug.Log("hey");
	origin = transform.position;
	difference = .15;
	while(time > 0)
	{
		transform.position = Vector3(Random.Range(origin.x-difference,origin.x+difference),Random.Range(origin.y-difference,origin.y+difference),origin.z);
		time -= Time.deltaTime;
		yield WaitForSeconds(.03);
	}
	transform.position = origin;
}

function InstructionShake (time:float) {
	Debug.Log("hey");
	origin = transform.position;
	difference = .15;
	while(time > 0)
	{
		transform.position = Vector3(Random.Range(origin.x-difference,origin.x+difference),Random.Range(origin.y-difference,origin.y+difference),origin.z);
		time -= Time.deltaTime;
		yield WaitForSeconds(.01);
	}
	transform.position = origin;
}