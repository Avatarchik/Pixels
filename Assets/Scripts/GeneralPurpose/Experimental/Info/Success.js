#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

function Start () {

}

function Update () {
	GetComponent(TextMesh).text = "Success: " + !GameManager.failure;
}