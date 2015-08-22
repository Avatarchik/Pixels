#pragma strict

@HideInInspector var paidUnlock:boolean;
@HideInInspector var paidUnlockCost:int;
@HideInInspector var playCost:int;
@HideInInspector var unlocked:boolean;
var hide:Vector3;
var show:Vector3;

var playSprite:Sprite;
var buySprite:Sprite;

var openColor:Color;
var closedColor:Color;
var unlockColor:Color;

var subIcon:SpriteRenderer;
var costText:TextMesh;

static var shown:boolean;

function Start () {
	shown = false;
}

function Update () {
	if(shown)
	{
		transform.position = Vector3.MoveTowards(transform.position,show,Time.deltaTime * 30);
	}
	else
	{
		transform.position = Vector3.MoveTowards(transform.position,hide,Time.deltaTime * 30);
	}
}

function Clicked () {
	if(ArcadeManager.currentState == ArcadeState.Selecting && shown)
	{
		if(unlocked)
		{
			if(PlayerPrefs.GetInt("CurrencyNumber") > playCost)
			{
				PlayerPrefs.SetInt("CurrentNumber",PlayerPrefs.GetInt("CurrencyNumber") - playCost);
			}
			else
			{
				
			}
		}
		else
		{
		
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