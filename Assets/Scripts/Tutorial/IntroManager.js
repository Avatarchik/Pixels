#pragma strict

@HideInInspector var step:int;

var introObjects:GameObject[];

@HideInInspector var createdObjects:GameObject[];

function Start () {
	step = 0;
	createdObjects = new GameObject[introObjects.length];
	createdObjects[step] = Instantiate(introObjects[step]);
}

function Update () {
	if(createdObjects[step] == null && introObjects[step] != null)
	{
		createdObjects[step] = Instantiate(introObjects[step]);
	}
}

function IncreaseStep () {
	step ++;
}

function End () {
	for(var i:int = 0; i < createdObjects.length; i++)
	{
		if(createdObjects[i] != null)
		{
			createdObjects[i].GetComponent(TutorialObject).done = true;
		}
	}
}