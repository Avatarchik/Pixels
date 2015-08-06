#pragma strict

var sprites:Sprite[];

var object1:SpriteRenderer;
var object2:SpriteRenderer;

var waitTime:float;

var color1:Color;
var color2:Color;

@HideInInspector var placeHolder1:int;

@HideInInspector var placeHolder2:int;

function Start () {
	object1.color = color1;
	object2.color = color2;
	placeHolder1 = 0;
	placeHolder2 = 2;
	Rotate();
}

function Rotate () {
	while(true)
	{
		object1.sprite = sprites[placeHolder1];
		object2.sprite = sprites[placeHolder2];
		placeHolder1 ++;
		placeHolder2 ++;
		if(placeHolder1 >= sprites.Length)
		{
			placeHolder1 = 0;
		}
		if(placeHolder2 >= sprites.Length)
		{
			placeHolder2 = 0;
		}
		yield WaitForSeconds(waitTime);
		yield;
	}
}