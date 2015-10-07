#pragma strict

var toCheck:String;
var notification:String;

function Clicked () {
	if(!PlayerPrefs.HasKey(toCheck) || PlayerPrefs.GetInt(toCheck) == 0)
	{
		Camera.main.GetComponent(Master).LaunchNotification(notification,NotificationType.notEnoughCoins);
		PlayerPrefs.SetInt(toCheck,1);
	}
}