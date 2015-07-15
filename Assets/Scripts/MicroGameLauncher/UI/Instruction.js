#pragma strict

var text:String;

var origin:float;
var target:float;
var children:TextMesh[];

var drum:AudioClip;

function Start () {
	transform.position.y = 0;
	transform.position.x = .2;
	if(Application.loadedLevelName == "MicroTester")
	{
		text = GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).game.GetComponent(MicroGameManager).instruction;
	}
	else 
	{
		text = GameManager.instructionText;
	}
	for(var i:int = 0; i < children.Length; i++)
	{
		children[i].GetComponent(TextMesh).text = text;
	}
	if(Application.loadedLevelName != "MicroTester")
	{
		Debug.Log(Camera.main.GetComponent(Master).currentWorld.basic.colors[0]);
		children[5].transform.GetComponent(Renderer).material.SetColor("_Color",Color(Camera.main.GetComponent(Master).currentWorld.basic.colors[0].r,Camera.main.GetComponent(Master).currentWorld.basic.colors[0].g,Camera.main.GetComponent(Master).currentWorld.basic.colors[0].b,1));
		children[6].transform.GetComponent(Renderer).material.SetColor("_Color",Color(Camera.main.GetComponent(Master).currentWorld.basic.colors[1].r,Camera.main.GetComponent(Master).currentWorld.basic.colors[1].g,Camera.main.GetComponent(Master).currentWorld.basic.colors[1].b,1));
	}
	MoveTo();
}

function MoveTo(){
	var length:float = 1.1;
	var numberOfIncreases:int = 2;
	var lengthOfIncrease: float = (length / 2);
	var amountOfIncrease:float = 1.3;
	GetComponent(ObjectShake).InstructionShake(length);
	yield WaitForSeconds(length-lengthOfIncrease);
	for(var i:int = 0; i < numberOfIncreases; i++)
	{
		transform.localScale *= amountOfIncrease;
		yield WaitForSeconds(lengthOfIncrease/numberOfIncreases);
	}
	Destroy(gameObject);
	yield;
}

function MoveBack(){
	
	
}