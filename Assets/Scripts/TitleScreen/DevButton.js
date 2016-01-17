#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var step:int;

function Start () {
	step = 0;
}

function Clicked () {
	step ++;
	if(step > 2)
	{
		if(!Camera.main.GetComponent(Master).settings.devButton || ObscuredPrefs.GetInt("SaveSystemAvailable") == 1)
		{
			ObscuredPrefs.SetInt("SaveSystemAvailable",1);
			ObscuredPrefs.SetInt("PaidSongOneUnlocked",1);
			ObscuredPrefs.SetInt("PaidSongTwoUnlocked",1);
			Destroy(gameObject);
		}
		else
		{
			ObscuredPrefs.SetInt("SaveSystemAvailable",0);
			ObscuredPrefs.SetInt("PaidSongOneUnlocked",0);
			ObscuredPrefs.SetInt("PaidSongTwoUnlocked",0);
			Destroy(gameObject);
		}
	}
	
}