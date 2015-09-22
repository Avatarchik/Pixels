#pragma strict

@HideInInspector var paidUnlock:boolean;
@HideInInspector var paidUnlockCost:int;
@HideInInspector var playCost:int;
@HideInInspector var unlocked:boolean;
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

var moneyPlayNotification:GameObject;

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
				manager.LaunchNotification(moneyPlayNotification);
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
					AudioManager.PlaySound(unlockSounds[Random.Range(0,unlockSounds.length)]);
				}
				else
				{
					manager.LaunchNotification(moneyPlayNotification);
				}
			}
			else
			{
				AudioManager.PlaySound(lockedSounds[Random.Range(0,lockedSounds.length)]);
			}
		}
	}
	else
	{
	}
}

function Switch (shouldShow:boolean,thisPaidUnlock:boolean,thisPaidUnlockCost:int,thisPlayCost:int,thisUnlocked:boolean) {
	shown = shouldShow;
	if(costText != null)
	{
		paidUnlock = thisPaidUnlock;
		paidUnlockCost = thisPaidUnlockCost;
		playCost = thisPlayCost;
		unlocked = thisUnlocked;
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