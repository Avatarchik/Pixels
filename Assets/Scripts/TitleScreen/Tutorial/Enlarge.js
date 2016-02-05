#pragma strict

function Start () {

}

function Update () {
	transform.localScale += Vector3(1,1,1) * Time.deltaTime * .2;
}