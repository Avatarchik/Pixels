#pragma strict

var sprites:Sprite[];
var waitTime:float;
var currentSprite:int;

function Start () {
	currentSprite = 0;
	GetComponent(SpriteRenderer).sprite = sprites[currentSprite];
	StartCoroutine(SpriteRotate());
}

function SpriteRotate () {
	while(true)
	{
		yield WaitForSeconds(waitTime);
		currentSprite += 1;
		if(currentSprite == sprites.Length)
		{
			currentSprite = 0;
		}	
		GetComponent(SpriteRenderer).sprite = sprites[currentSprite];
		yield;
	}
	yield;
}