#pragma strict

var sprites:Sprite[];

static var currentTarget:float;

static var counter:float;

var active:boolean;

function Start () {
	active = true;
	counter = 0;
}

function Update () {
	counter += Time.deltaTime;
	
	//Debug.Log(Mathf.Floor((counter*sprites.length)/currentTarget));
	
	if(Mathf.Floor(((counter*sprites.length)/currentTarget)/2) < sprites.Length && active)
	{
		GetComponent(SpriteRenderer).sprite = sprites[Mathf.Floor(((counter*sprites.length)/currentTarget)/2)];
	}
	else
	{
		GetComponent(SpriteRenderer).sprite = sprites[0];
	}	
}

function TimerPause () {
	active = false;
}

function TimerStart () {
	active = true;
	counter = 0;
}