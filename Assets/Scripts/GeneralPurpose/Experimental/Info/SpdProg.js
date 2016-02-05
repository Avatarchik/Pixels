#pragma strict

function Start () {

}

function Update () {
	GetComponent(TextMesh).text = "SpdProg: " + GameManager.speedProgress;
}