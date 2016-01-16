#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var movingObjects:GameObject[];
var speed:float[];

var title:GameObject[];
var text:String;

var controller:Master;

function Start () {
	DontDestroyOnLoad(gameObject);
	controller = Camera.main.GetComponent(Master);
	if(Application.loadedLevelName == "MicroTester")
	{
		text = GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).notificationText;
	}
	else 
	{
		text = GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).notificationText;
	}
	for(var y:int = 0; y < title.Length; y++)
	{
		title[y].GetComponent(TextMesh).text = text;
	}
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
		speed[i] = Random.Range(110,120.1);
	}
	Transition();
	Title();
}

function Transition () {
	while(true)
	{
		for(var y:int = 0; y < movingObjects.Length; y++)
		{
		 	movingObjects[y].transform.position.x -= speed[y] * 1.5 * Time.deltaTime;
		}
		yield;
	}
}

function Title () {
	yield WaitForSeconds(1);
	
	while(title[0].transform.position.x > .011)
	{
		title[0].transform.position.x = Mathf.Lerp(title[0].transform.position.x, 0, Time.deltaTime * 16);
		yield;
	}
	while(title[0].transform.position.x > -30)
	{
		title[0].transform.position.x = Mathf.Lerp(title[0].transform.position.x, -35, Time.deltaTime * 9);
		yield;
	}
	yield WaitForSeconds(2);
	Destroy(gameObject);
}