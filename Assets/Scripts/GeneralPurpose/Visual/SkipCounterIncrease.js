 #pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

static var speed:boolean;

function Start () {
}

function Update () {
}

function Clicked () {
	if(transform.parent.parent.GetComponent(NotificationManager) != null)
	{
		transform.parent.parent.GetComponent(TextManager).Next();
	}
	else if(transform.parent.parent.GetComponent(TextManager) != null)
	{
		transform.parent.parent.GetComponent(TextManager).Clicked();
	}
}