#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

function Start () {

}

function Update () {
	GetComponent(TextMesh).text = "SpdProg: " + GameManager.speedProgress;
}