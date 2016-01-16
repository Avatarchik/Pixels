#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

function Start () {

}

function Update () {
	if(ArcadeButton.currentlyLocked)
	{
		GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,1,Time.deltaTime * 4);
	}
	else
	{
		GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,0,Time.deltaTime * 4);
	}
}

function Clicked () {
	GameObject.FindGameObjectWithTag("ArcadeButton").GetComponent(ArcadeButton).Clicked();
}