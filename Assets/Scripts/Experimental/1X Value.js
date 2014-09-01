#pragma strict

var text1:String;
var text2:String;
var text3:String;
var text4:String;
var text5:String;

function Start () {
	text1 = "None";
	text2 = "None";
	text3 = "None";
	text4 = "None";
	text5 = "None";
}

function Update () {
	if(!Finger.GetExists(0))
	{
		text1 = "None";
	}
	else
	{
		text1 = "X1: " + Finger.location[0].x.ToString("F3");
	}
	if(!Finger.GetExists(1))
	{
		text2 = "None";
	}
	else
	{
		text2 = "X2: " + Finger.location[1].x.ToString("F3");
	}
	if(!Finger.GetExists(2))
	{
		text3 = "None";
	}
	else
	{
		text3 = "X3: " + Finger.location[2].x.ToString("F3");
	}
	if(!Finger.GetExists(3))
	{
		text4 = "None";
	}
	else
	{
		text4 = "X4: " + Finger.location[3].x.ToString("F3");
	}
	if(!Finger.GetExists(4))
	{
		text5 = "None";
	}
	else
	{
		text5 = "X5: " + Finger.location[4].x.ToString("F3");
	}
	
	GetComponent(TextMesh).text = text1 + "\n" + text2 + "\n" + text3 + "\n" + text4 + "\n" + text5;
}