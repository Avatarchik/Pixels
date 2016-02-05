#pragma strict

function Start () {

}

function Update () {
	GetComponent(TextMesh).text = "Success: " + !GameManager.failure;
}