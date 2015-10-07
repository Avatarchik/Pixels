#pragma strict

@HideInInspector var paidUnlock:boolean;
@HideInInspector var paidUnlockCost:int;
@HideInInspector var playCost:int;
@HideInInspector var unlocked:boolean;
@HideInInspector var currentLockText:String;
var hide:Vector3;
var show:Vector3;
var gameplay:Vector3;

var playSprite:Sprite;
var buySprite:Sprite;

var openColor:Color;
var closedColor:Color;
var unlockColor:Color;

var subIcon:SpriteRenderer;
var costText:TextMesh;

var speed:float;

@HideInInspector var manager:ArcadeManager;

var lockedSounds:AudioClip[];
var unlockSounds:AudioClip[];

static var shown:boolean;

function Start () {
	shown = false;
	speed = 50;
	manager = GameObject.FindGameObjectWithTag("ArcadeManager").GetComponent(ArcadeManager);
}

function Update () {
	if(manager.currentState == ArcadeState.Playing || manager.currentState == ArcadeState.Results)
	{
		transform.position = Vector3.MoveTowards(transform.position,gameplay,Time.deltaTime * speed);
	}
	else
	{
		if(shown)
		{
			transform.position = Vector3.MoveTowards(transform.position,show,Time.deltaTime * speed);
		}
		else
		{
			transform.position = Vector3.MoveTowards(transform.position,hide,Time.deltaTime * speed);
		}
	}
}

function Clicked () {
	if(ArcadeManager.currentState == ArcadeState.Selecting && shown)
	{
		if(unlocked)
		{
			if(PlayerPrefs.GetInt("CurrencyNumber") > playCost)
			{
				PlayerPrefs.SetInt("CurrencyNumber",PlayerPrefs.GetInt("CurrencyNumber") - playCost);
				manager.StartGame();
			}
			else
			{
				Camera.main.GetComponent(Master).LaunchNotification("You don't have enough money to play this game!",NotificationType.notEnoughCoins);
				ArcadeManager.currentState = ArcadeState.Notification;
				while(Master.notifying)
				{
					yield;
				}
				ArcadeManager.currentState = ArcadeState.Selecting;
			}
		}
		else
		{
			if(paidUnlock)
			{
				if(PlayerPrefs.GetInt("CurrencyNumber") > paidUnlockCost)
				{
					PlayerPrefs.SetInt("CurrencyNumber",PlayerPrefs.GetInt("CurrencyNumber") - paidUnlockCost);
					Camera.main.GetComponent(Master).UnlockArcadeGames(ArcadeManager.lastGameVariable);
					if(TalkButton.talkWait < 0)
					{
						var tempVar:float = Random.Range(0,unlockSounds.length);
						AudioManager.PlaySound(unlockSounds[tempVar]);
						TalkButton.talkWait = unlockSounds[tempVar].length;
					}
				}
				else
				{
					Camera.main.GetComponent(Master).LaunchNotification("You don't have enough money to buy this game!",NotificationType.notEnoughCoins);
					ArcadeManager.currentState = ArcadeState.Notification;
					while(Master.notifying)
					{
						yield;
					}
					ArcadeManager.currentState = ArcadeState.Selecting;
				}
			}
			else
			{
				if(TalkButton.talkWait < 0)
				{
					tempVar = Random.Range(0,lockedSounds.length);
					AudioManager.PlaySound(lockedSounds[tempVar]);
					TalkButton.talkWait = lockedSounds[tempVar].length;
				}
				Camera.main.GetComponent(Master).LaunchNotification(currentLockText,NotificationType.notEnoughCoins);
				ArcadeManager.currentState = ArcadeState.Notification;
				while(Master.notifying)
				{
					yield;
				}
				ArcadeManager.currentState = ArcadeState.Selecting;
			}
		}
	}
	else
	{
	}
}

function Switch (shouldShow:boolean,thisPaidUnlock:boolean,thisPaidUnlockCost:int,thisPlayCost:int,thisUnlocked:boolean,unlockText:String) {
	shown = shouldShow;
	if(costText != null)
	{
		paidUnlock = thisPaidUnlock;
		paidUnlockCost = thisPaidUnlockCost;
		playCost = thisPlayCost;
		unlocked = thisUnlocked;
		currentLockText = unlockText;
		if(unlocked)
		{
			costText.text = thisPlayCost.ToString();
			GetComponent(SpriteRenderer).color = openColor;
			subIcon.sprite = playSprite;
			costText.characterSize = .4;
		}
		else
		{
			if(paidUnlock)
			{
				if(thisPaidUnlockCost > 999)
				{
					costText.characterSize = .2;
				}	
				else if(thisPaidUnlockCost > 99)
				{
					costText.characterSize = .28;
				}
				else
				{
					costText.characterSize = .4;
				}
				costText.text = thisPaidUnlockCost.ToString();
				subIcon.sprite = buySprite;
				GetComponent(SpriteRenderer).color = unlockColor;
			}
			else
			{
				costText.text = "";
				subIcon.sprite = playSprite;
				GetComponent(SpriteRenderer).color = closedColor;
				costText.characterSize = .4;
			}
		}	
	}
}