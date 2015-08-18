#pragma strict


function Start () {

}

function Update () {
	GetComponent(TextMesh).text = "Lives: " + GameManager.lives;
}