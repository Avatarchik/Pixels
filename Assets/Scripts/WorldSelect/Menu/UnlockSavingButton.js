#pragma strict

var unlockPrefab:GameObject;
var menuManager:WorldMenuManager;

function Start () {
	if(PlayerPrefs.GetInt("SaveSystemAvailable") == 1 || Application.loadedLevelName == "MicroGameLauncher")
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
	if(PlayerPrefs.GetInt("SaveSystemAvailable") == 1)
	{
		Destroy(gameObject);
	}
}