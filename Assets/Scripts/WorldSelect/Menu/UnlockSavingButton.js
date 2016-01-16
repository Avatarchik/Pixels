#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var unlockPrefab:GameObject;
var menuManager:WorldMenuManager;

function Start () {
	if(ObscuredPrefs.GetInt("SaveSystemAvailable") == 1 || Application.loadedLevelName == "MicroGameLauncher")
	{
		Destroy(gameObject);
	}
}

function Update () {

}

function Clicked () {
	if(!Master.notifying)
	{
		Master.notifying = true;
		var newUnlockNote:GameObject = Instantiate(unlockPrefab);
		newUnlockNote.BroadcastMessage("SkipTheSpeaking");
		while(newUnlockNote != null)
		{
			yield;
		}
		Master.notifying = false;
	}
	if(ObscuredPrefs.GetInt("SaveSystemAvailable") == 1)
	{
		Destroy(gameObject);
	}
}