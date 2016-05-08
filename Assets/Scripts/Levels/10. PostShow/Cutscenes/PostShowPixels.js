#pragma strict

var colors:Color[];
var waitTime:float;
@HideInInspector var currentTime:float;
@HideInInspector var nextTime:float;
@HideInInspector var currentColor:int;

@HideInInspector var lastSprite:int;
@HideInInspector var currentSprite:int;

var colorFollowers:SpriteRenderer[];
var spriteFollowers:SpriteRenderer[];

var sprite:boolean;
var color:boolean;

var sprites:Sprite[];

var subSprites0:Sprite[];
var subSprites1:Sprite[];
var subSprites2:Sprite[];

function Start () {
	lastSprite = -1;
	currentSprite = -1;
	nextTime = 0;
	currentTime = 0;
	currentColor = -1;
	
	ColorShow();
}

function Update () {
	currentTime += Time.deltaTime;
}

function DoSpriteStuff () {
	while(currentSprite == lastSprite)
	{
		currentSprite = Random.Range(0,sprites.Length);
		yield;
	}
	Debug.Log(currentSprite);
	lastSprite = currentSprite;
	GetComponent(SpriteRenderer).sprite = sprites[currentSprite];
	for(var i:int = 0; i < spriteFollowers.length; i++)
	{
		if(currentSprite == 0)
		{
			spriteFollowers[i].sprite = subSprites0[i];
		}
		else if(currentSprite == 1)
		{
			spriteFollowers[i].sprite = subSprites1[i];
		}
		else
		{
			spriteFollowers[i].sprite = subSprites2[i];
		}
	}
}

function ColorShow () {
	var lastColor:int = -1;
	while(true)
	{
		while(currentColor == lastColor)
		{
			currentColor = Random.Range(0,colors.Length);
		}
		lastColor = currentColor;
		if(color)
		{
			GetComponent(SpriteRenderer).color = colors[currentColor];
			for(var i:int = 0; i < colorFollowers.length; i++)
			{
				colorFollowers[i].color = colors[currentColor];
			}
		}
		if(sprite)
		{
			DoSpriteStuff();
		}
		while(currentTime < nextTime)
		{
			yield;
		}
		nextTime += waitTime;
		yield;
	}
}