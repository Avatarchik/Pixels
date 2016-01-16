#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var initialAmount:float;
var endIntroAmount:float;

function Start () {
	yield WaitForEndOfFrame;
	if(TitleManager.currentState == TitleStatus.Intro)
	{
		Intro();
	}
}	

function Intro () {
	if(GetComponent(ButtonRectangle) != null)
	{
		GetComponent(ButtonRectangle).enabled = false;
	}
	GetComponent(SpriteRenderer).color.a = initialAmount;
	while(TitleManager.currentState == TitleStatus.Intro)
	{
		yield;
	}
	if(GetComponent(ButtonRectangle) != null)
	{
		GetComponent(ButtonRectangle).enabled = true;
	}
	while(GetComponent(SpriteRenderer).color.a != endIntroAmount)
	{
		GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,endIntroAmount,Time.deltaTime*1);
		yield;
	}
}