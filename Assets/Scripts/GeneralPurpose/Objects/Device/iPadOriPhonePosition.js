#pragma strict

var location169:Vector3;
var location43:Vector3;
var location32:Vector3;
var location85:Vector3;
var location53:Vector3;

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
		switch(Master.device)
		{
			case "16:9":
				transform.localPosition = location169;
				break;
			case "4:3":
				transform.localPosition = location43;
				break;
			case "3:2":
				transform.localPosition = location32;
				break;
			case "8:5":
				transform.localPosition = location85;
				break;
			case "5:3":
				transform.localPosition = location53;
				break;
			default:
				break;
		}
	}
}

function Update () {

}