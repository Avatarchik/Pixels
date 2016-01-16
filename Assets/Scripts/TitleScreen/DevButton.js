#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var step:int;

function Start () {
	step = 0;
	if(!Camera.main.GetComponent(Master).settings.devButton || ObscuredPrefs.GetInt("SaveSystemAvailable") == 1)
	{
		Destroy(gameObject);
	}
}

function Clicked () {
	step ++;
	if(step > 2)
	{
		ObscuredPrefs.SetInt("SaveSystemAvailable",1);
		ObscuredPrefs.SetInt("PaidSongOneUnlocked",1);
		ObscuredPrefs.SetInt("PaidSongTwoUnlocked",1);
		Destroy(gameObject);
	}
	
}