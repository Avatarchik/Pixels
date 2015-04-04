#pragma strict

var controller:Master;

var unlocksLevel1:String[];
var unlocksLevel2:String[];
var unlocksLevel3:String[];

var unlockNotificationTextLine1:String[];
var unlockNotificationTextLine2:String[];


function Start () {
	controller = Camera.main.GetComponent(Master);
}

function Update () {

}

function ReplaceMaster () {
	controller.selectedWorldUnlocksLevel1 = unlocksLevel1;
	controller.selectedWorldUnlocksLevel2 = unlocksLevel2;
	controller.selectedWorldUnlocksLevel3 = unlocksLevel3;
	controller.selectedWorldUnlockNotificationsLine1 = unlockNotificationTextLine1;
	controller.selectedWorldUnlockNotificationsLine2 = unlockNotificationTextLine2;
}