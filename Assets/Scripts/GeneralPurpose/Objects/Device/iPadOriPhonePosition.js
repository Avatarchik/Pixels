#pragma strict

var location169:Vector3;
var location43:Vector3;

function Start () {
	if(Master.device == "16:9")
	{
		transform.localPosition = location169;
	}
	else if(Master.device == "4:3")
	{
		transform.localPosition = location43;
	}
}

function Update () {

}