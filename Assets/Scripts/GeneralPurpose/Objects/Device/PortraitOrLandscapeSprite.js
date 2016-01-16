#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var vertical:boolean;

function Start () {
	if(GetComponent(SpriteRenderer) != null)
	{
		CheckSprite();
	}
	if(GetComponent(TextMesh) != null)
	{
		CheckText();
	}
	if(GetComponent(ButtonSquare) != null)
	{
		CheckButtonSquare();
	}
	if(GetComponent(ButtonRectangle) != null)
	{
		CheckButtonRectangle();
	}
}

function CheckSprite () {
	while(true)
	{
		if((Master.vertical && vertical) || (!Master.vertical && !vertical))
		{
			GetComponent(SpriteRenderer).enabled = true;
		}
		else
		{
			GetComponent(SpriteRenderer).enabled = false;
		}
		yield;
	}
}

function CheckText () {
	var previousSize:float;
	previousSize = GetComponent(TextMesh).characterSize;
	while(true)
	{
		if((Master.vertical && vertical) || (!Master.vertical && !vertical))
		{
			GetComponent(TextMesh).characterSize = previousSize;
			previousSize = GetComponent(TextMesh).characterSize;
		}
		else
		{
			GetComponent(TextMesh).characterSize = 0;
		}
		yield;
	}
}

function CheckButtonSquare () {
	while(true)
	{
		if((Master.vertical && vertical) || (!Master.vertical && !vertical))
		{
			
			GetComponent(ButtonSquare).enabled = true;
		}
		else
		{
			GetComponent(ButtonSquare).enabled = false;
		}
		yield;
	}
}

function CheckButtonRectangle () {
	while(true)
	{
		if((Master.vertical && vertical) || (!Master.vertical && !vertical))
		{
			GetComponent(ButtonRectangle).enabled = true;
		}
		else
		{
			GetComponent(ButtonRectangle).enabled = false;
		}
		yield;
	}
}