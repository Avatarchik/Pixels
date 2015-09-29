#pragma strict

function Start () {

}

function Update () {
	if(Input.GetKeyDown("space"))
	{
		Clicked();
	}
}

function Clicked () {
	Destroy(gameObject);
}