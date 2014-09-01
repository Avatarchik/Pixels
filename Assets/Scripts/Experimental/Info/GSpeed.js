#pragma strict

function Start () {

}

function Update () {
	GetComponent(TextMesh).text = "GSpeed: " + GameManager.timeMultiplier;
}