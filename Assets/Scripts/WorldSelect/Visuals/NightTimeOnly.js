#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var sprite:SpriteRenderer;

var worldVar:String;

function Start () {
	sprite = GetComponent(SpriteRenderer);
	if(TimeManager.state == TimeState.NightNormal || TimeManager.state == TimeState.NightEvil)
	{
	}
	else
	{
		sprite.enabled = false;
	}
	if(worldVar != "" && ObscuredPrefs.GetInt(worldVar) != 1)
	{
		sprite.enabled = false;
	}	
}

function Update () {
	
}