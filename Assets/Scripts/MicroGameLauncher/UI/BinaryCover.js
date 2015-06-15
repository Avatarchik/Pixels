#pragma strict

function Start () {

}

function Update () {
	if(Mathf.Abs(transform.parent.position.x) < .3)
	{
		transform.position.x = 0;
	}
	else
	{
		transform.position.x = 100;
	}
}