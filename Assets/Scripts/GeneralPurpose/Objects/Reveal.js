#pragma strict

var movingObjects:GameObject[];
var speed:float[];

var controller:Master;
@HideInInspector var baseSpeed:float;
@HideInInspector var textSpeed:float;

function Start () {
	baseSpeed = 90;
	controller = Camera.main.GetComponent(Master);
	speed = new float[movingObjects.Length];
	for(var i:int = 0; i < movingObjects.Length; i++)
	{
		if(i%2==0)
		{
			movingObjects[i].GetComponent.<Renderer>().material.color = controller.currentWorld.basic.colors[0];
		}
		if(i%2==1)
		{
			movingObjects[i].GetComponent.<Renderer>().material.color = controller.currentWorld.basic.colors[1];
		}
		speed[i] = Random.Range(baseSpeed,baseSpeed + 10.1);
	}
	Transition();
	Title();
}

function Transition () {
	while(true)
	{
		for(var y:int = 0; y < movingObjects.Length; y++)
		{
		 	movingObjects[y].transform.position.y += speed[y] * Time.deltaTime;
		}
		yield;
	}
}

function Title () {
	yield WaitForSeconds(6);
	Destroy(gameObject);
}