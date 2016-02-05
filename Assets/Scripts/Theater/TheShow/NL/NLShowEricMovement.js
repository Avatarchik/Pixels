#pragma strict

var mouth:SpriteRenderer;

var mouthClosed:Sprite;
var mouthOpen:Sprite;

var times:float[];
var timeNumber:int[];

function Start () {
	Talk();
}

function Update () {
	if(Input.GetKeyDown("a"))
	{
		times = AddNumber(times,ShowManager.currentMusicLocation);
		timeNumber = AddNumber(timeNumber,1);
	}
	if(Input.GetKeyUp("a"))
	{
		times = AddNumber(times,ShowManager.currentMusicLocation);
		timeNumber = AddNumber(timeNumber,0);
	}
}

function StartEvent (which:int) {
	switch(which)
	{
		case 0:
			MoveGradual(Vector3(-7.84,-1.22322,8.6406),12);
			break;
		case 1:
			break;
		case 2:
			break;
		case 3:
			break;
		case 4:
			break;
		case 5:
			break;
		case 6:
			break;
		case 7:
			break;
		case 8:
			break;
		case 9:
			MoveImmediate(Vector3(-6.6,-1.22322,8.6406));
			break;
		case 10:
			MoveImmediate(Vector3(-1.58,0.35,8.6406));
			break;
		case 11:
			MoveImmediate(Vector3(-8.46,1.88,8.6406));
			break;
		case 12:
			MoveImmediate(Vector3(-.16,-2.93,8.6406));
			break;
		case 13:
			MoveImmediate(Vector3(-3.63,-2.79,8.6406));
			break;
		case 14:
			MoveImmediate(Vector3(-4.74,-1.82,8.6406));
			break;
		case 15:
			MoveImmediate(Vector3(-3.63,-2.79,8.6406));
			break;
		case 16:
			MoveImmediate(Vector3(-.16,-2.93,8.6406));
			break;
		default:
			break;
	}
}

function MoveGradual (newPos:Vector3,speed:float) {
	while(transform.localPosition != newPos)
	{
		transform.localPosition = Vector3.MoveTowards(transform.localPosition,newPos,Time.deltaTime*speed);
		yield;
	}
}

function MoveImmediate (newPos:Vector3) {
	transform.localPosition = newPos;
}	

function Talk () {
	for(var i:int = 0; i < times.length; i++)
	{
		while(ShowManager.currentMusicLocation < times[i])
		{
			yield;
		}
		if(timeNumber[i] == 0)
		{
			mouth.sprite = mouthClosed;
		}
		else
		{
			mouth.sprite = mouthOpen;
		}
	}
}

function AddNumber (original:int[],addition:int):int[] {
	var finalArray:int[] = new int[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function AddNumber (original:float[],addition:float):float[] {
	var finalArray:float[] = new float[original.length+1];
	for(var y:float = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}