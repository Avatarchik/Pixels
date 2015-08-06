#pragma strict

public enum Type{Switch,Fade,Progression};

var sprites:Sprite[];
var type:Type;
var fade:boolean;
var min:float;
var max:float;
var speed:float;
var fadeOptions:FadeOptions;

@HideInInspector var progressMarker:int;
@HideInInspector var goal:float = min;

function Start () {
	progressMarker = 0;
	if(type == Type.Fade)
	{
		GetComponent(SpriteRenderer).color.a = fadeOptions.minimum;
	}
	if(type == Type.Progression)
	{
		GetComponent(SpriteRenderer).sprite = sprites[progressMarker];
	}
}

function Update () {
	if(type == Type.Fade)
	{
		GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,goal,Time.deltaTime*fadeOptions.speed);
	}
}

function SetSongSprite (spriteNumber:int) {
	switch(type)
	{
		case Type.Switch:
			if(spriteNumber < sprites.Length)
			{
				GetComponent(SpriteRenderer).sprite = sprites[spriteNumber];
			}
			break;
		case Type.Fade:
			if(spriteNumber == 1)
			{	
				goal = fadeOptions.maximum;
			}
			else
			{
				goal = fadeOptions.minimum;
			}
			break;
		case Type.Progression:
			if(spriteNumber == 1)
			{
				progressMarker ++;
				if(progressMarker < sprites.Length)
				{
					GetComponent(SpriteRenderer).sprite = sprites[progressMarker];
				}
				else
				{
					GetComponent(SpriteRenderer).sprite = null;
				}
			}
			break;
		default:
			break; 
	}
}

class FadeOptions {
	var minimum:float;
	var maximum:float;
	var speed:float;
}