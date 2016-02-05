#pragma strict

@HideInInspector var allWorlds:World[];
@HideInInspector var thisWorld:World;

var worldVar:String;

@HideInInspector var games:GameObject[];
@HideInInspector var bossGame:GameObject;

@HideInInspector var selected:boolean;

var upSprite:Sprite;
var downSprite:Sprite;

var icon:GameObject;

function Start () {
	icon = transform.Find("Icon").gameObject;
	allWorlds = Camera.main.GetComponent(Master).worlds;
	for(var i:int = 0; i< allWorlds.length; i++)
	{
		if(allWorlds[i].basic.worldNameVar == worldVar)
		{
			games = allWorlds[i].basic.games;
			bossGame = allWorlds[i].basic.bossGame;
		}
	}
	if(games.Length <= 0)
	{
		transform.position.z = -100;
		transform.position.y = 1000;
	}
	if(PlayerPrefs.HasKey(worldVar+"RemixIsSelected") && PlayerPrefs.GetInt(worldVar+"RemixIsSelected") == 1)
	{
		selected = true;
	}
	else
	{
		PlayerPrefs.SetInt(worldVar+"RemixIsSelected",0);
		selected = false;
	}
}

function Update () {
	if(selected)
	{
		GetComponent(SpriteRenderer).sprite = downSprite;
		icon.transform.localPosition.y = -.01;
		icon.transform.localPosition.x = -.01;
		icon.GetComponent(SpriteRenderer).color = Color.gray;
	}
	else
	{
		GetComponent(SpriteRenderer).sprite = upSprite;
		icon.transform.localPosition.y = 0;
		icon.transform.localPosition.x = 0;
		icon.GetComponent(SpriteRenderer).color = Color.white;
	}
}	

function Clicked () {
	if(games.Length > 0 && RemixManager.step == 1)
	{
		selected = !selected;
		if(selected)
		{
			PlayerPrefs.SetInt(worldVar+"RemixIsSelected",1);
		}
		else
		{
			PlayerPrefs.SetInt(worldVar+"RemixIsSelected",0);
		}
	}
}