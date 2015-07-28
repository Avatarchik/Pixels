#pragma strict

var sprites:Sprite[];
var fade:boolean;
var min:float;
var max:float;
var speed:float;

@HideInInspector var goal:float = min;

function Start () {
	if(fade)
	{
		GetComponent(SpriteRenderer).color.a = min;
	}
}

function Update () {
	if(fade)
	{
		GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,goal,Time.deltaTime*speed);
	}
}

function SetSongSprite (spriteNumber:int) {
	if(fade)
	{
		if(spriteNumber == 1)
		{	
			goal = max;
		}
		else
		{
			goal = min;
		}
	}
	else
	{
		if(spriteNumber < sprites.Length)
		{
			GetComponent(SpriteRenderer).sprite = sprites[spriteNumber];
		}
	}
}