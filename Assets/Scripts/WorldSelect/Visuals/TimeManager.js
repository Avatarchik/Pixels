#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

public enum TimeState{DayNormal,NightNormal,DayEvil,NightEvil}

@HideInInspector var currentTime:int;

var level1Objects:GameObject[];
var level2Objects:GameObject[];
var level3Objects:GameObject[];

var nightColorsNormal:Color[];
var morningColorsNormal:Color[];
var dayColorsNormal:Color[];
var eveningColorsNormal:Color[];

var nightColorsEvil:Color[];
var morningColorsEvil:Color[];
var dayColorsEvil:Color[];
var eveningColorsEvil:Color[];

var currentColors:Color[];

var overrideNumber:int;

static var state:TimeState;
function Awake () {
	currentTime = System.DateTime.Now.Hour;
	if(overrideNumber >= 0)
	{
		currentTime = overrideNumber;
	}
	GetColors();
	if(ObscuredPrefs.GetInt("IgnoreTimeOfDay") == 1)
	{
		currentColors = dayColorsNormal;
		state = TimeState.DayNormal;
	}
	if(level1Objects.Length > 0)
	{
		ChangeColors(level1Objects,currentColors[0]);
	}
	if(level2Objects.Length > 0)
	{
		ChangeColors(level2Objects,currentColors[1]);
	}
	if(level3Objects.Length > 0)
	{
		ChangeColors(level3Objects,currentColors[2]);
	}
}

function Update () {
	/*
	if(Input.GetKeyDown("space"))
	{
		currentTime ++;
		if(currentTime > 24)
		{
			currentTime = 0;
		}
		GetColors();
	}
	if(level1Objects.Length > 0)
	{
		LerpColors(level1Objects,currentColors[0]);
	}
	if(level2Objects.Length > 0)
	{
		LerpColors(level2Objects,currentColors[1]);
	}
	if(level3Objects.Length > 0)
	{
		LerpColors(level3Objects,currentColors[2]);
	}
	*/
}

function GetColors () {
	if(ObscuredPrefs.GetInt("WorldMapState") == 1)
	{
		if(currentTime < 6 || currentTime > 21)
		{
			currentColors = nightColorsEvil;
			state = TimeState.NightEvil;
		}
		else if(currentTime < 10)
		{
			currentColors = morningColorsEvil;
			state = TimeState.DayEvil;
		}
		else if(currentTime > 18)
		{
			currentColors = eveningColorsEvil;
			state = TimeState.NightEvil;
		}
		else
		{
			currentColors = dayColorsEvil;
			state = TimeState.DayEvil;
		}
	}
	else
	{
		if(currentTime < 5 || currentTime > 21)
		{
			currentColors = nightColorsNormal;
			state = TimeState.NightNormal;
		}
		else if(currentTime < 10)
		{
			currentColors = morningColorsNormal;
			state = TimeState.DayNormal;
		}
		else if(currentTime > 18)
		{
			currentColors = eveningColorsNormal;
			state = TimeState.NightNormal;
		}
		else
		{
			currentColors = dayColorsNormal;
			state = TimeState.DayNormal;
		}
	}
}

function ChangeColors (objects:GameObject[],color:Color) {
	for(var i:int = 0; i < objects.length; i++)
	{
		if(objects[i].GetComponent(SpriteRenderer) != null && objects[i].GetComponent(DoNotIncludeInTODEffect) == null && objects[i].GetComponent(AnimationManager) == null)
		{
			objects[i].GetComponent(SpriteRenderer).color = color;
		}
		var components:Component[] = objects[i].GetComponentsInChildren(Transform);
		for(var x:int = 0; x < components.length; x++)
		{
			if(components[x].GetComponent(SpriteRenderer) != null && components[x].GetComponent(DoNotIncludeInTODEffect) == null && components[x].GetComponent(AnimationManager) == null)
			{
				components[x].GetComponent(SpriteRenderer).color = color;
			}
		}
	}
}

function LerpColors (objects:GameObject[],color:Color) {
	for(var i:int = 0; i < objects.length; i++)
	{
		if(objects[i].GetComponent(SpriteRenderer) != null && objects[i].GetComponent(DoNotIncludeInTODEffect) == null && objects[i].GetComponent(AnimationManager) == null)
		{
			objects[i].GetComponent(SpriteRenderer).color = Color.Lerp(objects[i].GetComponent(SpriteRenderer).color,color,Time.deltaTime);
		}
		
		var components:Component[] = objects[i].GetComponentsInChildren(Transform);
		for(var x:int = 0; x < components.length; x++)
		{
			if(components[x].GetComponent(SpriteRenderer) != null && components[x].GetComponent(DoNotIncludeInTODEffect) == null && components[x].GetComponent(AnimationManager) == null)
			{
				components[x].GetComponent(SpriteRenderer).color = Color.Lerp(components[x].GetComponent(SpriteRenderer).color,color,Time.deltaTime);
			}
		}
	}
}