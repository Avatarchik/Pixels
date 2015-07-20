#pragma strict

@HideInInspector var material:Material;
@HideInInspector var origin:float;
@HideInInspector var destination:float;
@HideInInspector var counter:float;
@HideInInspector var speed:float;


function Start () {
	material = GetComponent(Renderer).material;
	origin = 0;
	destination = -1.28;
	speed = 4;
	counter = 0;
}

function Update () {
	if(Master.hardMode)
	{
		counter = Mathf.MoveTowards(counter,-1,Time.deltaTime * speed);
	}
	else
	{
		counter = Mathf.MoveTowards(counter,0,Time.deltaTime * speed);
	}
	transform.localPosition.x = Mathf.Lerp(origin,destination,counter * -1);
	material.mainTextureOffset.x = counter;
}