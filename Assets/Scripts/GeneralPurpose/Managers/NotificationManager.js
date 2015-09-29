﻿#pragma strict

public enum NotificationType{tutorial,lockedWorld,lockedGame,notEnoughCoins,unlockedItems};

var lockedIcon:GameObject;

var type:NotificationType;

var unlockSign:Sprite;

function SetType(words:String,type:NotificationType) {
	GetComponent(TextManager).lines[0].dialogue = words;
	switch (type)
	{
		case NotificationType.tutorial:
			Destroy(lockedIcon);
			transform.position.y = 1;
			break;
		case NotificationType.lockedWorld:
			transform.position.y = -2;
			break;
		case NotificationType.lockedGame:
			transform.position.y = -2;
			break;
		case NotificationType.notEnoughCoins:
			Destroy(lockedIcon);
			transform.position.y = 1;
			break;
		case NotificationType.unlockedItems:
			lockedIcon.GetComponent(SpriteRenderer).sprite = unlockSign;
			break;
		default:
			Destroy(lockedIcon);
			transform.position.y = 1;
			break;
	}
}