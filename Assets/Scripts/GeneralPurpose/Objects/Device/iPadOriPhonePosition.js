#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var location169:Vector3;
var location43:Vector3;

var text:boolean;

function Start () {
	if(text)
	{
		if(Master.device == "4:3")
		{
			if(transform.localPosition.x == 12.5 && transform.localPosition.y == 7.3)
			{
				transform.localPosition.x = 12;
				transform.localPosition.y = 10;
			}
			if(transform.localPosition.x == 12.5 && transform.localPosition.y == -7.3)
			{
				transform.localPosition.x = 12;
				transform.localPosition.y = -10.5;
			}
			if(transform.localPosition.x == 5.29 && transform.localPosition.y == 14)
			{
				transform.localPosition.x = 8;
				transform.localPosition.y = 14;
			}
			if(transform.localPosition.x == 5.29 && transform.localPosition.y == -14)
			{
				transform.localPosition.x = 8;
				transform.localPosition.y = -14.5;
			}
		}
	}
	else
	{
		if(Master.device == "16:9")
		{
			transform.localPosition = location169;
		}
		else if(Master.device == "4:3")
		{
			transform.localPosition = location43;
		}
	}
}

function Update () {

}