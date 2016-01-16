#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var row:int;
var column:int;

var color1:Color;
var color2:Color;

@HideInInspector var progress:int;

@HideInInspector var sprite:SpriteRenderer;

function Start () {
	progress = 1;
	sprite = GetComponent(SpriteRenderer);
}

function SetSongSprite (spriteNumber:int) {
	switch(spriteNumber)
	{
		case 1:
			progress++;
			Below(progress);
			break;
		case 2:
			progress++;
			Above(progress);
			break;
		case 3:
			progress = 1;
			ChessBoard(true);
			break;
		case 4:
			progress = 1;
			ChessBoard(false);
			break;
		case 5:
			progress = 1;
			Border(true);
			break;
		case 6:
			progress = 1;
			Border(false);
			break;
		case 7:
			progress = 1;
			Above(progress);
			break;
		case 8:
			break;
		case 9:
			break;
		default:
			break;
	}
}

function Below (number:int) {
	if(row + column < number)
	{
		sprite.color = color1;
	}
	else
	{
		sprite.color = color2;
	}
}

function Above (number:int) {
	if(row + column > number)
	{
		sprite.color = color1;
	}
	else
	{
		sprite.color = color2;
	}
}

function ChessBoard(on:boolean) {
	if((row + column)%2 == 0)
	{
		if(on)
		{
			sprite.color = color1;
		}
		else
		{
			sprite.color = color2;
		}
	}
	else
	{
		if(on)
		{
			sprite.color = color2;
		}
		else
		{
			sprite.color = color1;
		}
	}
}

function Border(on:boolean) {
	if(column == 1 || column == 2 || column == 5 || column == 6)
	{
		if(row%2 == 0)
		{
			if(on)
			{
				sprite.color = color1;
			}
			else
			{
				sprite.color = color2;
			}
		}
		else
		{
			if(on)
			{
				sprite.color = color2;
			}
			else
			{
				sprite.color = color1;
			}
		}
	}
	else
	{
		sprite.color = color2;
	}
}