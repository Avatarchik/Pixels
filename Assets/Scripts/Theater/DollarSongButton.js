#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var deleteOn:String;
var variableToCheck:String;
var unlockPrefab:GameObject;
var song:GameObject;
@HideInInspector var allowed:boolean;

function Start () {
	allowed = false;
	if(ObscuredPrefs.GetInt(deleteOn) != 1 && deleteOn != null && deleteOn != "")
	{
		Destroy(gameObject);
	}
	if(ObscuredPrefs.GetInt(variableToCheck) == 1)
	{
		allowed = true;
	}
}

function Update () {

}

function Clicked () {
	if(!Master.notifying)
	{
		if(allowed)
		{
			if(Application.loadedLevelName == "Theater")
			{
				GameObject.FindGameObjectWithTag("LedgerController").SendMessage("VideoButtonPress",variableToCheck,SendMessageOptions.DontRequireReceiver);
			}
			else
			{
				Master.notifying = true;
				var newText:GameObject;
				newText = Instantiate(song);
				while(newText != null)
				{
					yield;
				}
				Master.notifying = false;
			}
		}
		else
		{
			if(!Master.notifying)
			{
				Master.notifying = true;
				var newUnlockNote:GameObject = Instantiate(unlockPrefab);
				newUnlockNote.BroadcastMessage("SkipTheSpeaking");
				while(newUnlockNote != null)
				{
					yield;
				}
				if(ObscuredPrefs.GetInt(variableToCheck) == 1)
				{
					allowed = true;
				}
				Master.notifying = false;
			}
		}
	}
}