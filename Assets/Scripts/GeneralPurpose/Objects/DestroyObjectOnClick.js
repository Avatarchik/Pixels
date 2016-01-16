#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var target:GameObject;

function Start () {

}

function Update () {

}

function Clicked () {
	if(target != null)
	{
		Destroy(target);
	}
}