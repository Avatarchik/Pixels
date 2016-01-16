#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var hard:boolean;

var upSprite:Sprite;

var downSprite:Sprite;

var icon:GameObject;

function Start () {
	if(ObscuredPrefs.HasKey("RemixIsHardMode") && ObscuredPrefs.GetInt("RemixIsHardMode") == 1)
	{
		RemixManager.hardMode = true;
	}
	else
	{
		ObscuredPrefs.SetInt("RemixIsHardMode",0);
		RemixManager.hardMode = false;
	}
	icon = transform.Find("Icon").gameObject;
}

function Update () {
	if(RemixManager.hardMode)
	{
		if(hard)
		{
			GetComponent(SpriteRenderer).sprite = upSprite;
			icon.transform.localPosition.y = 0;
			icon.GetComponent(SpriteRenderer).color = Color.white;
		}	
		else
		{
			GetComponent(SpriteRenderer).sprite = downSprite;
			icon.transform.localPosition.y = -.01;
			icon.GetComponent(SpriteRenderer).color = Color.gray;
		}
	}
	else
	{
		if(hard)
		{
			GetComponent(SpriteRenderer).sprite = downSprite;
			icon.transform.localPosition.y = -.01;
			icon.GetComponent(SpriteRenderer).color = Color.gray;
		}	
		else
		{
			GetComponent(SpriteRenderer).sprite = upSprite;
			icon.transform.localPosition.y = 0;
			icon.GetComponent(SpriteRenderer).color = Color.white;
		}
	}
}

function Clicked () {
	if(RemixManager.step == 2)
	{
		if(hard)
		{
			RemixManager.hardMode = true;
			ObscuredPrefs.SetInt("RemixIsHardMode",1);
		}
		else
		{
			RemixManager.hardMode = false;
			ObscuredPrefs.SetInt("RemixIsHardMode",0);
		}
	}
}