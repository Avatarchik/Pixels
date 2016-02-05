#pragma strict

function Start () {
	GetComponent(TextMesh).color.a = 0;
	Opening();
}

function Update () {
	if(TitleManager.currentState == TitleStatus.Leaving)
	{
		GetComponent(TextMesh).color.a = Mathf.MoveTowards(GetComponent(TextMesh).color.a,0,Time.deltaTime * 6);
	}
}

function Opening () {
	while((AudioManager.GetLocation() < 2.2 || TitleManager.currentState == TitleStatus.Intro))
	{
		yield;
	}
	if(TitleManager.currentState != TitleStatus.Leaving)
	{
		GetComponent(TextMesh).color.a = 1;
	}
}	