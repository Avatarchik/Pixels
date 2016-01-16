#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var evilSprite:Sprite;

function Start () {
	if(ObscuredPrefs.GetInt("HighSchoolBeatEndPlayed") == 1)
	{
		if(GetComponent(SpriteRenderer) != null)
		{
			GetComponent(SpriteRenderer).sprite = evilSprite;
		}
	}
}