#pragma strict

// Set in editor.
var textObject:TextMesh;
var glow:SpriteRenderer;
var sprite:SpriteRenderer;
var colors:Color[];


// Set in code when instantiated.
@HideInInspector var manager:HS;
@HideInInspector var text:String;
@HideInInspector var tapTime:float;
@HideInInspector var thisOneNumber:int;

// Set in code when born.
@HideInInspector var currentBrightness:float;
@HideInInspector var leadUp:float;
@HideInInspector var window:float;
@HideInInspector var maxBrightness:float;
@HideInInspector var glowed:boolean;
@HideInInspector var hittable:boolean;
@HideInInspector var done:boolean;

function Start () {
	leadUp = 1;
	window = .7;
	glow.color.a = 0;
	textObject.color.a = 0;
	sprite.color = colors[0];
	sprite.color.a = 0;
	currentBrightness = 0;
	maxBrightness = .4;
	glowed = false;
	hittable = false;
	done = false;
}

function Update () {
	var distance:float = tapTime - ShowManager.currentMusicLocation;
	textObject.text = text;
	if(!done)
	{
		if(distance < leadUp)
		{
			if(distance <= 0)
			{
				glow.color.a = 1 + distance * 2;
				if(distance < -window)
				{
					done = true;
					hittable = false;
					Bad();
				}
				else
				{
					hittable = true;
					currentBrightness = 1;
				}
			}
			else
			{
				hittable = false;
				currentBrightness = (1 - distance/leadUp) * maxBrightness;
			}
		}
		else
		{
			hittable = false;
			currentBrightness = 0;
		}
	}
	sprite.color.a = currentBrightness;
	textObject.color.a = currentBrightness;
}

function Clicked () {
	if(hittable)
	{
		done = true;
		Good();
	}
}

function Good () {
	if(hittable)
	{
		manager.GoodHit();
		sprite.color = colors[2];
		currentBrightness = 1;
		while(currentBrightness != 0)
		{
			currentBrightness = Mathf.MoveTowards(currentBrightness,0,Time.deltaTime*4);
			yield;
		}
		Destroy(gameObject);
	}
}

function Bad () {
	manager.BadHit();
	sprite.color = colors[1];
	currentBrightness = 1;
	yield WaitForSeconds(.2);
	while(currentBrightness != 0)
	{
		currentBrightness = Mathf.MoveTowards(currentBrightness,0,Time.deltaTime*4);
		yield;
	}
	Destroy(gameObject);
}