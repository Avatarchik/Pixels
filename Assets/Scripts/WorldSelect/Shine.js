#pragma strict

@HideInInspector var material:Material;
@HideInInspector var counter:float;

function Start () {
	material = GetComponent(Renderer).material;
	counter = 0;
}

function Update () {
	counter -= Time.deltaTime * 4;
	if(counter < -20)
	{
		counter = 1;
	}
	material.mainTextureOffset.x = counter;
}