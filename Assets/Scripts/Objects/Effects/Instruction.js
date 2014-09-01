#pragma strict

var text:String;

var origin:float;
var target:float;
var children:GameObject[];

function Start () {
	transform.position.y = 20;
	origin = transform.position.y;
	text = GameObject.FindGameObjectWithTag("MicroGame").GetComponent(MicroGameManager).instruction;
	for(var i:int = 0; i < children.Length; i++)
	{
		children[i].GetComponent(TextMesh).text = text;
	}
	MoveTo();
}

function MoveTo(){
	Debug.Log("hey");
	while(transform.position.y > target + .1)
	{
		transform.position.y = Mathf.Lerp(transform.position.y,target,Time.deltaTime*8);
		yield;
	}
	yield WaitForSeconds(.2);
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