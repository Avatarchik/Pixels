﻿#pragma strict

var option:String[] = new String[4];
var button:GameObject[] = new GameObject[4];
var buttonPrefab:GameObject;
var transition:GameObject;
var transitionColors:Color[];
var destination:float;

function Start () {
	if(!PlayerPrefs.HasKey("Sound"))
	{
		PlayerPrefs.SetInt("Sound", 1);
	}
	if(!PlayerPrefs.HasKey("Music"))
	{
		PlayerPrefs.SetInt("Music", 1);
	}
	option[0] = "Continue";
	option[1] = "Options";
	option[2] = "Title Screen";
	option[3] = "";
	StartCoroutine(UpdateNamesUp());
	if(Application.loadedLevelName == "TitleScreen")
	{
		MenuEffect("Options");
		destination = -1;
	}
	else
	{
		destination = 0;
	}
}

function Update () {
	if(WorldMapManager.currentState == MapStatus.Clear)
	{
		//StartCoroutine(Exit());
	}
}

// List of what happens depending on what button is pressed, and in what menu.
function MenuEffect(clicked:String) {
	switch(clicked)
	{
		// From initial menu.
		case "Continue":
			WorldMapManager.currentState = MapStatus.Clear;
			Exit();
			break;
		case "Options":
			option[0] = "Facebook";
			option[1] = "Music";
			option[2] = "Sound";
			option[3] = "Back";
			UpdateNamesUp();
			break;
		case "Title Screen":
			ReturnToTitle();
			break;
			
		// From options screen.
		case "Facebook":
			break;
		case "Music":
			if(PlayerPrefs.GetInt("Music") == 0)
			{
				PlayerPrefs.SetInt("Music", 1);
			}
			else
			{
				PlayerPrefs.SetInt("Music", 0);
			}
			button[1].GetComponent(WorldMenuButton).SetText(option[1]);
			break;
		case "Sound":
			if(PlayerPrefs.GetInt("Sound") == 0)
			{
				PlayerPrefs.SetInt("Sound", 1);
			}
			else
			{
				PlayerPrefs.SetInt("Sound", 0);
			}
			button[2].GetComponent(WorldMenuButton).SetText(option[2]);
			break;
		case "Back":
			if(Application.loadedLevelName == "TitleScreen")
			{
				TitleManager.currentState = TitleStatus.Home;
			}
			else
			{
				option[0] = "Continue";
				option[1] = "Options";
				option[2] = "Title Screen";
				option[3] = "";
				UpdateNamesDown();
			}
			break;
		default:
			break;
	}
}

// Transitions.
function UpdateNamesUp () {
	while(transform.position.y > -25 &&  WorldMapManager.currentState == MapStatus.Menu)
	{
		transform.position.y -= Time.deltaTime * 70;
		yield;
	}
	for(var i:float = 0; i < option.length; i++)
	{
		Destroy(button[i]);
		if(option[i] != null && option[i] != "")
		{	
			button[i] = Instantiate(buttonPrefab, transform.position + Vector3(0,3.8 - i * 2.9,-.01), Quaternion.identity);
			button[i].GetComponent(WorldMenuButton).SetText(option[i]);
			button[i].transform.parent = transform;
			if(option[3] == "")
			{
				button[i].transform.position.y -= .8 + i/3;
				if(option[2] == "")
				{
					button[i].transform.position.y -= 1.4 + i/3;
				}
			}
		}
	}
	transform.position.y = 25;
	while(transform.position.y > destination &&  WorldMapManager.currentState == MapStatus.Menu)
	{
		transform.position.y = Mathf.Lerp(transform.position.y, destination-.1, Time.deltaTime * 10);
		yield;
	}
	transform.position.y = destination;
	
	yield;
}

function UpdateNamesDown () {
	while(transform.position.y < 25 && WorldMapManager.currentState == MapStatus.Menu)
	{
		transform.position.y += Time.deltaTime * 70;
		yield;
	}
	for(var i:float = 0; i < option.length; i++)
	{
		Destroy(button[i]);
		if(option[i] != null && option[i] != "")
		{	
			button[i] = Instantiate(buttonPrefab, transform.position + Vector3(0,3.8 - i * 2.9,0), Quaternion.identity);
			button[i].GetComponent(WorldMenuButton).SetText(option[i]);
			button[i].transform.parent = transform;
			if(option[3] == "")
			{
				button[i].transform.position.y -= .8 + i/3;
				if(option[2] == "")
				{
					button[i].transform.position.y -= 1.4 + i/3;
				}
			}
		}
	}
	transform.position.y = -25;
	while(transform.position.y < destination &&  WorldMapManager.currentState == MapStatus.Menu)
	{
		transform.position.y = Mathf.Lerp(transform.position.y, destination+.1, Time.deltaTime * 10);
		yield;
	}
	transform.position.y = destination;
	
	yield;
}

function Exit () {
	while(transform.position.y < 25)
	{
		transform.position.y += Time.deltaTime * 70;
		yield;
	}
	Destroy(gameObject);
	yield;
}

function ReturnToTitle() {
		Camera.main.GetComponent(Master).selectedWorldColors = transitionColors;
		Camera.main.GetComponent(Master).worldNameFull = "";
		Camera.main.GetComponent(Master).worldNameLine1 = "";
		Camera.main.GetComponent(Master).worldNameLine2 = "";
		Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
		yield WaitForSeconds(2);
		Application.LoadLevel("TitleScreen");
}