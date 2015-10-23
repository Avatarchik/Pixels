﻿#pragma strict

var standing:Sprite;
var moving1:Sprite;
var moving2:Sprite;

var evil:Sprite;

function Start () {
	StartCoroutine(TreeCycle());
}

function Update () {
}

function TreeCycle () {
	if(PlayerPrefs.GetInt("Neverland") == 1 && evil != null)
	{
		GetComponent(SpriteRenderer).sprite = evil;
	}
	else
	{
		while(true)
		{
			while(Mathf.Abs(transform.localPosition.x - WorldMapVisualsManager.wind) >= 1)
			{
				yield;
			}
			GetComponent(SpriteRenderer).sprite = moving1;
			yield WaitForSeconds(.3);
			GetComponent(SpriteRenderer).sprite = moving2;
			yield WaitForSeconds(.3);
			GetComponent(SpriteRenderer).sprite = moving1;
			yield WaitForSeconds(.3);
			GetComponent(SpriteRenderer).sprite = standing;
			yield WaitForSeconds(.3);
			GetComponent(SpriteRenderer).sprite = moving1;
			yield WaitForSeconds(.3);
			GetComponent(SpriteRenderer).sprite = standing;
			yield;
		}
		yield;
	}
}