#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var manager:PlayerManager;

var bodyPart:String;

var colorButtons1:GameObject[];
var colorButtons2:GameObject[];
var colors1:GameObject[];
var colors2:GameObject[];

function Start () {
	manager = GameObject.FindGameObjectWithTag("Player").GetComponent(PlayerManager);
}

function Update () {
}

function Clicked () {
	for(var i:int = 0; i < colorButtons1.Length; i++)
	{
		if(Application.loadedLevelName == "TitleScreen")
		{
			TitleManager.currentState = TitleStatus.CustomizeColor;
		}
		else if(Application.loadedLevelName == "Theater")
		{
			Debug.Log("Hey");
			TheaterController.currentState = TheaterStatus.CustomizeColor;
		}
		switch(bodyPart)
		{
			case "hair":
				colors1[i].GetComponent(SpriteRenderer).color = manager.hairColor[i];
				colorButtons1[i].GetComponent(ChangeColor).colorSelection = i;
				colorButtons1[i].GetComponent(ChangeColor).bodyPart = "hair";
				colors2[i].GetComponent(SpriteRenderer).color = manager.hairColor[i];
				colorButtons2[i].GetComponent(ChangeColor).colorSelection = i;
				colorButtons2[i].GetComponent(ChangeColor).bodyPart = "hair";
				break;
			case "eyes":
				colors1[i].GetComponent(SpriteRenderer).color = manager.eyesColor[i];
				colorButtons1[i].GetComponent(ChangeColor).colorSelection = i;
				colorButtons1[i].GetComponent(ChangeColor).bodyPart = "eyes";
				colors2[i].GetComponent(SpriteRenderer).color = manager.eyesColor[i];
				colorButtons2[i].GetComponent(ChangeColor).colorSelection = i;
				colorButtons2[i].GetComponent(ChangeColor).bodyPart = "eyes";
				break;
			case "top":
				colors1[i].GetComponent(SpriteRenderer).color = manager.topsColor[i];
				colorButtons1[i].GetComponent(ChangeColor).colorSelection = i;
				colorButtons1[i].GetComponent(ChangeColor).bodyPart = "top";
				colors2[i].GetComponent(SpriteRenderer).color = manager.topsColor[i];
				colorButtons2[i].GetComponent(ChangeColor).colorSelection = i;
				colorButtons2[i].GetComponent(ChangeColor).bodyPart = "top";
				break;
				break;
			case "bottom":
				colors1[i].GetComponent(SpriteRenderer).color = manager.bottomsColor[i];
				colorButtons1[i].GetComponent(ChangeColor).colorSelection = i;
				colorButtons1[i].GetComponent(ChangeColor).bodyPart = "bottom";
				colors2[i].GetComponent(SpriteRenderer).color = manager.bottomsColor[i];
				colorButtons2[i].GetComponent(ChangeColor).colorSelection = i;
				colorButtons2[i].GetComponent(ChangeColor).bodyPart = "bottom";
				break;
			default:
				break;
		}
	}
}