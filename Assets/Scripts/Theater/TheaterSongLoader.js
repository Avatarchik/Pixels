#pragma strict

var type:String;
var offSprite:Sprite;
var onSprite:Sprite;

var allowed:boolean = false;

var lockText:String;

function Start () {
	
}

function Update () {
	if(LedgerController.songPlaying && type == "Entracte")
	{
		GetComponent(SpriteRenderer).sprite = GetComponent(ButtonRectangle).down;
		GetComponent(ButtonRectangle).subText.GetComponent(SpriteRenderer).sprite = offSprite;
	}
	else if(type == "Entracte")
	{
		if(LedgerController.videoPlaying)
		{
			GetComponent(SpriteRenderer).sprite = GetComponent(ButtonRectangle).up;
		}
		GetComponent(ButtonRectangle).subText.GetComponent(SpriteRenderer).sprite = onSprite;
	}
}

function Clicked () {
	if(allowed)
	{
		if(LedgerController.currentState == LedgerState.Worlds)
		{
			if(type == "Entracte")
			{
				LedgerController.songPlaying = !LedgerController.songPlaying;
			}
			GameObject.FindGameObjectWithTag("LedgerController").SendMessage("VideoButtonPress",type,SendMessageOptions.DontRequireReceiver);
		}
	}
	else
	{
		Camera.main.GetComponent(Master).LaunchNotification(lockText,NotificationType.lockedWorld);
	}
}