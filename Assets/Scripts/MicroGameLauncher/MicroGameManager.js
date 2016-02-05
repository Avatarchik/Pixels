#pragma strict

public enum AnimationType{SingleImage,RotatingImage,ChangingImage,Choice};

var clockSounds:boolean;
var firstTimeNotifyType:AnimationType;
var images:Sprite[];
var firstTimeRenderer:SpriteRenderer;
private var firstTimeStep:int;
var speed:float;
var marker:int;
var glow:boolean;
var flash:boolean;
var flashSpeed:float;

var instruction:String;
var controls:Sprite;

static var choice:int;

var firstTime:boolean;

var gameSounds:AudioClip[];
var likeliness:float = .25;
var volume:float = 1;

function Start () {
	if(likeliness == 0)
	{
		likeliness = .25;
	}	
	if(gameSounds.length > 0 && Random.value < likeliness && Master.currentWorld.basic.worldNameVar != "VRTraining")
	{
		AudioManager.PlayCutscene(gameSounds[Random.Range(0,gameSounds.length)],volume);
	}
	firstTime = false;
	UITimer.soundsOn = clockSounds;
	marker = 0;
	firstTimeStep = 0;
	if(Application.loadedLevelName == "MicroGameLauncher")
	{
		for(var nameCheck:int = 0; nameCheck < GameManager.gameNames.length; nameCheck ++)
		{
			if(transform.name.Contains(GameManager.gameNames[nameCheck]))
			{
				if(GameManager.firstTimeValues[nameCheck])
				{
					Destroy(firstTimeRenderer.gameObject);
				}
				else
				{
					firstTime = true;
					if(glow)
					{
						StartCoroutine(Glow());
					}
					if(flash)
					{
						StartCoroutine(Flash());
					}
					StartCoroutine(FirstTimeNotify());
					break;
				}
			}
		}
	}
	else
	{
		StartCoroutine(FirstTimeNotify());
		if(glow)
		{
			StartCoroutine(Glow());
		}
	}
}

function Glow () {
	while(true)
	{
		firstTimeRenderer.color.a =  Mathf.Abs(Mathf.Sin(Time.time *2)/1.5) + .3;
		yield;
	}
	yield;
}

function Flash () {
	var on:boolean = true;
	while(true)
	{
		yield WaitForSeconds(flashSpeed);
		if(on)
		{
			firstTimeRenderer.color.a = 1;
		}
		else
		{
			firstTimeRenderer.color.a = 0;
		}	
		on = !on;
		yield;
	}
	yield;
}

function FirstTimeNotify () {
	while(true && firstTimeRenderer != null)
	{
		
		switch(firstTimeNotifyType)
		{
			case AnimationType.SingleImage:
				firstTimeRenderer.sprite = images[0];
				break;
			case AnimationType.RotatingImage:
				yield WaitForSeconds(speed);
				firstTimeRenderer.sprite = images[marker];
				marker ++;
				if(marker >= images.Length)
				{
					marker = 0;
				}
				break;
			case AnimationType.ChangingImage:
				firstTimeRenderer.sprite = images[firstTimeStep];
				break;
			case AnimationType.Choice:
				firstTimeRenderer.sprite = images[choice];
			default:
				break;
		}
		yield;
	}
	yield;
}

function NextNotify () {
	firstTimeStep = Mathf.MoveTowards(firstTimeStep,images.Length-1,1);
}