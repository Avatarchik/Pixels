#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var times:float[];

@HideInInspector var which:int;

var sprites:Sprite[];

function Start () {
	which = sprites.Length -1;
	if(Master.allowShow)
	{
		GamePlay ();
	}
}

function Update () {
	if(Input.GetKeyDown("a"))
	{
		times = AddNumber(times,ShowManager.currentMusicLocation);
	}
}

function GamePlay () {
	for(var i:int = 0; i < times.length; i ++)
	{
		while(ShowManager.currentMusicLocation < times[i])
		{
			yield;
		}
		GetComponent(SpriteRenderer).sprite = sprites[which];
		which ++;
		if(which >= sprites.length)
		{
			which = 0;
		}
	}
}

function AddNumber (original:float[],addition:float):float[] {
	var finalArray:float[] = new float[original.length+1];
	for(var y:float = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}