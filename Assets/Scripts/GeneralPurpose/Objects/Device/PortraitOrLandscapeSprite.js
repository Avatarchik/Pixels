#pragma strict

var vertical:boolean;

function Start () {
	if(GetComponent(SpriteRenderer) != null)
	{
		CheckSprite();
	}
	if(GetComponent(TextMesh) != null)
	{
		//CheckText();
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
	var previousText:String;
	while(true)
	{
		if((Master.vertical && vertical) || (!Master.vertical && !vertical))
		{
			GetComponent(TextMesh).text = previousText;
			previousText = GetComponent(TextMesh).text;
		}
		else
		{
			GetComponent(TextMesh).text = "";
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