#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var toCheck:String;
var notification:String;

function Clicked () {
	if((!ObscuredPrefs.HasKey(toCheck) || ObscuredPrefs.GetInt(toCheck) == 0) && !Master.notifying)
	{
		Camera.main.GetComponent(Master).LaunchNotification(notification,NotificationType.notEnoughCoins);
		ObscuredPrefs.SetInt(toCheck,1);
	}
}