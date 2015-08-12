#pragma strict

@HideInInspector var sprite:SpriteRenderer;

var speed:float = 1.5;
var amount:float = .2;
static var flash:boolean;

function Start () {
	flash = false;
	sprite = GetComponent(SpriteRenderer);
	if(Application.loadedLevelName == "WorldSelect")
	{
		WorldUpdate();
	}
	else
	{
		TheaterUpdate();
	}
}

function TheaterUpdate () {
	while(true)
	{
		if(TheaterPieceChange.automatic)
		{
			if(flash)
			{
				sprite.color.a = 1;
				flash = false;
			}
			sprite.color.a = Mathf.MoveTowards(sprite.color.a,0,Time.deltaTime * 5);
		}
		else
		{
			if(TheaterController.customizing)
			{
				sprite.color.a = Mathf.Abs(Mathf.Sin(Time.time)/speed) + amount;
			}
			else
			{
				sprite.color.a = 0;
			}
		}
		yield;
	}
}

function WorldUpdate () {
	while(true)
	{
		sprite.color.a = Mathf.Abs(Mathf.Sin(Time.time)/speed) + amount;
		yield;
	}
}