#pragma strict

var sprites:Sprite[];

static var currentTarget:float;

static var clickCounter:float;
static var clickWait:float;
static var counter:float;

static var active:boolean;

static var soundsOn:boolean;

@HideInInspector var currentSprite:int;
@HideInInspector var finished:boolean;

var clickSound:AudioClip;
var bellSound:AudioClip;

function Start () {
	active = true;
	counter = 0;
	currentSprite = 0;
	finished = false;
	clickCounter = -1;
	clickWait = .5;
	soundsOn = false;
}

function Update () {
	counter += Time.deltaTime;
	currentSprite = Mathf.Floor(((counter*sprites.length)/currentTarget)/2);
	
	//Debug.Log(Mathf.Floor((counter*sprites.length)/currentTarget));
	
	if(Mathf.Floor(((counter*sprites.length)/currentTarget)/2) < sprites.Length && active)
	{
		GetComponent(SpriteRenderer).sprite = sprites[currentSprite];
	}
	else if(!active)
	{
		GetComponent(SpriteRenderer).sprite = sprites[0];
	}	

	if(currentSprite > sprites.Length*3/5 && currentSprite < sprites.Length && transform.name == "Vertical" && active && soundsOn)
	{
		clickCounter -= Time.deltaTime;
		if(clickCounter < 0)
		{
			var wholeLength:float = currentTarget/3;
			var currentPos:float = (counter/2) - (2*currentTarget/3);
			clickCounter = Mathf.Lerp(.5,.1,currentPos/wholeLength);
			AudioManager.PlaySound(clickSound,.3);
		}	
	}
	if(currentSprite == sprites.Length && !finished && active && soundsOn)
	{
		AudioManager.PlaySound(bellSound,.25);
		finished = true;
	}
}

function TimerPause () {
	finished = false;
	active = false;
}

function TimerStart () {
	active = true;
	counter = 0;
}