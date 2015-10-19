#pragma strict

static var leaving:boolean;

static var step:int;

var levelSelect:GameObject;

var difficultySelect:GameObject;

@HideInInspector var hidden:Vector3;
@HideInInspector var shown:Vector3;

function Start () {
	leaving = false;
	step = 1;
}

function Update () {
	if(step == 1)
	{
		levelSelect.transform.localScale = Vector3.Lerp(levelSelect.transform.localScale,shown,Time.deltaTime*5);
		difficultySelect.transform.localScale = Vector3.Lerp(difficultySelect.transform.localScale,hidden,Time.deltaTime*5);
	}
	else if(step == 2)
	{
		levelSelect.transform.localScale = Vector3.Lerp(levelSelect.transform.localScale,hidden,Time.deltaTime*5);
		difficultySelect.transform.localScale = Vector3.Lerp(difficultySelect.transform.localScale,shown,Time.deltaTime*5);
	}
	else
	{
		levelSelect.transform.localScale = Vector3.Lerp(levelSelect.transform.localScale,hidden,Time.deltaTime*5);
		difficultySelect.transform.localScale = Vector3.Lerp(difficultySelect.transform.localScale,hidden,Time.deltaTime*5);
		Load();
	}
}

function Load() {
	if(!leaving)
	{
		leaving = true;
	}
}