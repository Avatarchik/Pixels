#pragma strict

var thisName:String;
var target:GameObject;

function Start () {

}

function Update () {

}

function Clicked () {
	if(UnlockWheelManager.currentState == UnlockWheelStatus.Clear && !Master.notifying)
	{
		target.SendMessage(thisName,SendMessageOptions.DontRequireReceiver);
	}
}