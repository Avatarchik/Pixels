#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var colors:Color[];

var bars:SpriteRenderer[];

@HideInInspector var decreaseColorSpeed:float;

@HideInInspector var waitTime:float;

function Start () {
	decreaseColorSpeed = 1.7;
	waitTime = .2;
}

function Update () {
	for(var i:int = 0; i < bars.length; i++)
	{
		bars[i].color.a = Mathf.MoveTowards(bars[i].color.a,0,Time.deltaTime * decreaseColorSpeed);
	}
}

function ShootColor (which:int) {
	for(var i:int; i < bars.length; i++)
	{
		bars[i].color = colors[Mathf.Min(colors.length,which)];
		yield WaitForSeconds(waitTime);
	}
}