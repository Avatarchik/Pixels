#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var arcadeManager:ArcadeManager;

var change:int;


function Start () {
	arcadeManager = GameObject.FindGameObjectWithTag("ArcadeManager").GetComponent(ArcadeManager);
}

function Update () {
	if(arcadeManager.currentState == ArcadeState.Playing || arcadeManager.currentState == ArcadeState.Results)
	{
		GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,0,Time.deltaTime*5);
	}
	else
	{
		GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,1,Time.deltaTime*5);
	}
}

function Clicked () {
	if(arcadeManager.currentState == ArcadeState.Selecting)
	{
		arcadeManager.Scroll(change);
	}
}