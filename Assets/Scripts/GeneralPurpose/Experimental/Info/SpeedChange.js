#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

static var textThing:String;

function Start () {

}

function Update () {
	GetComponent(TextMesh).text = textThing;
}