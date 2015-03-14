#pragma strict

public enum AnimationType{SingleImage,RotatingImage,ChangingImage};

var firstTimeNotifyType:AnimationType;
var images:Sprite[];
var firstTimeRenderer:SpriteRenderer;
var speed:float;
var marker:int;
var glow:boolean;

var instruction:String;
var controls:Sprite;
var length:float;

function Start () {
	marker = 0;
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
					if(glow)
					{
						StartCoroutine(Glow());
					}
					StartCoroutine(FirstTimeNotify());
					GameManager.firstTimeValues[nameCheck] = true;
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
				break;
			default:
				break;
		}
		yield;
	}
	yield;
}