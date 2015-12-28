#pragma strict

@HideInInspector var emily:SpriteRenderer;
var mouth:SpriteRenderer;

var hipSprite:Sprite;
var swordSprite:Sprite;

var mouthClosed:Sprite;
var mouthOpen:Sprite;

var times:float[];
var timeNumber:int[];


function Start () {
	emily = GetComponent(SpriteRenderer);
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
			break;
		case 1:
			MoveGradual(Vector3(7.49,-4.73,8.45),24);
			break;
		case 8:
			emily.sprite = swordSprite;
			Fly();
			break;
		case 9:
			MoveImmediate(Vector3(-1.32,-.65,8.45));
			break;
		case 10:
			MoveImmediate(Vector3(4.7,0.93,8.45));
			break;
		case 11:
			MoveImmediate(Vector3(-3.18,2.46,8.45));
			break;
		case 12:
			MoveImmediate(Vector3(5.85,-.69,8.45));
			break;
		case 13:
			MoveImmediate(Vector3(2.05,-1.89,8.45));
			break;
		case 14:
			MoveImmediate(Vector3(.89,-2.22,8.45));
			break;
		case 15:
			MoveImmediate(Vector3(2.05,-1.89,8.45));
			break;
		case 16:
			MoveImmediate(Vector3(5.85,-.69,8.45));
			break;
		default:
			break;
	}
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

function Fly () {
	var sinNumber:float = 0;
	while(transform.localPosition.x != -.65)
	{
		transform.localPosition.x = Mathf.MoveTowards(transform.localPosition.x,-.65,Time.deltaTime * 2);
		transform.localPosition.y += Mathf.Sin(sinNumber) * .06;
		sinNumber += Time.deltaTime * 1.15;
		yield;
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