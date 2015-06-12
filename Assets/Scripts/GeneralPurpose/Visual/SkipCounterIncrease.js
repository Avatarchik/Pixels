#pragma strict

static var speed:boolean;

function Start () {
}

function Update () {
}

function Clicked () {
	if(transform.parent.parent.GetComponent(TextManager) != null)
	{
		transform.parent.parent.GetComponent(TextManager).Clicked();
	}
}