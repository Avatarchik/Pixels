#pragma strict

var thingValue:int;
function Start () {
	thingValue = 0;
}

function Update () {
	if(Input.GetKeyDown("space"))
	{
		thingValue ++;
	}
	switch(thingValue)
	{
		case 0:
		case 1:
		case 2:
			break;
		case 3:
		case 4:
		case 5:
			break;
		case 6:
		case 7:
			break;
		default:
			break;
	}
}