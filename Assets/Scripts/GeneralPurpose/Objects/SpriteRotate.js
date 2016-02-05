#pragma strict

var defaultSprite:Sprite;
var sprites:Sprite[];
var waitTime:float;
var destroyAfterFirstTime:boolean = false;
@HideInInspector var currentSprite:int;
@HideInInspector var shouldRotate:boolean;

function Start () {
	currentSprite = 0;
	GetComponent(SpriteRenderer).sprite = sprites[currentSprite];
	shouldRotate = true;
	StartCoroutine(SpriteRotate());
}

function SpriteRotate () {
	while(true)
	{
		yield WaitForSeconds(waitTime);
		currentSprite += 1;
		if(currentSprite == sprites.Length)
		{
			if(destroyAfterFirstTime)
			{
				Destroy(gameObject);
				shouldRotate = false;
			}
			else
			{
				currentSprite = 0;
			}
		}	
		if(shouldRotate)
		{
			GetComponent(SpriteRenderer).sprite = sprites[currentSprite];
		}
		yield;
	}
	yield;
}

function StopRotation () {
	shouldRotate = false;
	if(defaultSprite != null)
	{
		GetComponent(SpriteRenderer).sprite = defaultSprite;
	}
	else
	{
		GetComponent(SpriteRenderer).sprite = null;
	}
	
}

function StartRotation () {
	shouldRotate = true;
}