#pragma strict

var text:String;

var origin:float;
var target:float;
var children:GameObject[];

function Start () {
	transform.position.y = 20;
	origin = transform.position.y;
	if(Application.loadedLevelName == "MicroTester")
	{
		text = GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).game.GetComponent(MicroGameManager).instruction;
	}
	else 
	{
		text = GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).currentGames[GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).gameToLoad].GetComponent(MicroGameManager).instruction;
	}
	for(var i:int = 0; i < children.Length; i++)
	{
		children[i].GetComponent(TextMesh).text = text;
	}
	MoveTo();
}

function MoveTo(){
	while(transform.position.y > target + .1)
	{
		transform.position.y = Mathf.Lerp(transform.position.y,target,Time.deltaTime*8);
		yield;
	}
	yield WaitForSeconds(.2);
	if(Application.loadedLevelName == "MicroTester")
	{
		while(MicroTester.pausable)
		{
			yield;
		}
	}
	else
	{
		while(GameManager.pausable)
		{
			yield;
		}
	}
	MoveBack();
	yield;
}

function MoveBack(){
	while(transform.position.y < origin - .1)
	{
		transform.position.y = Mathf.Lerp(transform.position.y,origin,Time.deltaTime*5);
		yield;
	}
	Destroy(gameObject);
}