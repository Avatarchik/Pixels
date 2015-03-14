#pragma strict

var movingObjects:GameObject[];
var speed:float[];

var title:GameObject[];
var text:String;

var controller:Master;

function Start () {
	DontDestroyOnLoad(gameObject);
	controller = Camera.main.GetComponent(Master);
		
	for(var y:int = 0; y < title.Length; y++)
	{
		title[y].GetComponent(TextMesh).text = controller.worldNameFull;
	}
	speed = new float[movingObjects.Length];
	for(var i:int = 0; i < movingObjects.Length; i++)
	{
		if(i%2==0)
		{
			movingObjects[i].GetComponent.<Renderer>().material.color = controller.selectedWorldColors[0];
		}
		if(i%2==1)
		{
			movingObjects[i].GetComponent.<Renderer>().material.color = controller.selectedWorldColors[1];
		}
		speed[i] = Random.Range(90,100.1);
	}
	Transition();
	Title();
}

function Transition () {
	while(true)
	{
		for(var y:int = 0; y < movingObjects.Length; y++)
		{
		 	movingObjects[y].transform.position.x -= speed[y] * Time.deltaTime;
		}
		yield;
	}
}

function Title () {
	yield WaitForSeconds(1);
	
	while(title[0].transform.position.x > .011)
	{
		title[0].transform.position.x = Mathf.Lerp(title[0].transform.position.x, 0, Time.deltaTime * 5);
		yield;
	}
	while(title[0].transform.position.x > -30)
	{
		title[0].transform.position.x = Mathf.Lerp(title[0].transform.position.x, -50, Time.deltaTime * 3);
		yield;
	}
	yield WaitForSeconds(2);
	Destroy(gameObject);
}