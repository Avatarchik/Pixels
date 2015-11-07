#pragma strict

var iPad:boolean;

function Start () {
	if(!iPad && Master.device == "iPad")
	{
		Destroy(gameObject);
	}
	else if(iPad && Master.device != "iPad")
	{
		Destroy(gameObject);
	}
}

function Update () {

}