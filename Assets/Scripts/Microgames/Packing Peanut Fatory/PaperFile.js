#pragma strict

var controller:Component;

var speed:int;
var difficulty:int;
var finished:boolean;
var length:float;
var timer:float;

var greenPapers:GameObject[];
var redPapers:GameObject[];
var trashPapers:GameObject[];
var paperPile:GameObject[];
var paperValue:int[];

var startLocation:Vector2;
var greenLocation:Vector2;
var redLocation:Vector2;
var trashLocation:Vector2;

var clockHand:GameObject;
var clockSprites:Sprite[];
var distance:float;

var successNumber:int;

function Start () {
	if(Application.loadedLevelName == "MicroTester")
	{
		speed = MicroTester.timeMultiplier;
		difficulty = MicroTester.difficulty;
	}
	else
	{
		speed = GameManager.timeMultiplier;
		difficulty = GameManager.difficulty;
	}
	distance = 1.5;
	successNumber = 0;
	
	paperPile = new GameObject[5+difficulty];
	paperValue = new int[paperPile.Length];
	
	startLocation = Vector2(-2.35,-4.3);
	greenLocation = Vector2(-7,-4.3);
	redLocation = Vector2(2.3,-4.3);
	trashLocation = Vector2(7,-6);
	
	for(var i:int = 0; i < paperPile.Length; i++)
	{
		var newPaper:int;
		if(difficulty > 1)
		{
			newPaper = Random.Range(0,3);
		}
		else
		{
			newPaper = Random.Range(0,2);
		}
		switch(newPaper)
		{
			case 0:
				paperPile[i] = Instantiate(greenPapers[Random.Range(0,greenPapers.Length)],Vector3(startLocation.x,startLocation.y,transform.position.z - 3.5 + (i * (3.0/paperPile.Length))),Quaternion.identity);
				paperValue[i] = 0;
				break;
			case 1:
				paperPile[i] = Instantiate(redPapers[Random.Range(0,redPapers.Length)],Vector3(startLocation.x,startLocation.y,transform.position.z - 3.5 + (i * (3.0/paperPile.Length))),Quaternion.identity);
				paperValue[i] = 1;
				break;
			case 2:
				paperPile[i] = Instantiate(trashPapers[Random.Range(0,redPapers.Length)],Vector3(startLocation.x,startLocation.y,transform.position.z - 3.5 + (i * (3.0/paperPile.Length))),Quaternion.identity);
				paperValue[i] = 2;
				break;
			default:
				break;
		}
		paperPile[i].transform.parent = transform;
		paperPile[i].GetComponent(ObjectMovementManager).allowMovement = false;
		paperPile[i].GetComponent(ObjectMovementManager).fingerRange = 2;
	}
	paperPile[0].GetComponent(ObjectMovementManager).allowMovement = true;
	length = paperPile.Length * (1.2 - speed * .12);
	timer = length;
}

function Update () {
	for(var i:int = 0; i < paperPile.Length; i++)
	{
		if(Vector2.Distance(paperPile[i].transform.position,greenLocation) < distance && paperValue[i] == 0)
		{
			paperPile[successNumber].GetComponent(ObjectMovementManager).allowMovement = false;
			paperValue[i] = 10;
			successNumber ++;
		}
		if(Vector2.Distance(paperPile[i].transform.position,redLocation) < distance && paperValue[i] == 1)
		{
			paperPile[successNumber].GetComponent(ObjectMovementManager).allowMovement = false;
			paperValue[i] = 11;
			successNumber ++;
		}
		if(Vector2.Distance(paperPile[i].transform.position,trashLocation) < distance && paperValue[i] == 2)
		{
			paperPile[successNumber].GetComponent(ObjectMovementManager).allowMovement = false;
			paperValue[i] = 12;
			successNumber ++;
		}
		if(paperValue[i] == 10)
		{
			paperPile[i].transform.position = Vector3.MoveTowards(paperPile[i].transform.position,Vector3(greenLocation.x,greenLocation.y,transform.position.z - (i * (3.0/paperPile.Length))),Time.deltaTime * 5);
		}
		if(paperValue[i] == 11)
		{
			paperPile[i].transform.position = Vector3.MoveTowards(paperPile[i].transform.position,Vector3(redLocation.x,redLocation.y,transform.position.z - (i * (3.0/paperPile.Length))),Time.deltaTime * 5);
		}
		if(paperValue[i] == 12)
		{
			paperPile[i].transform.position = Vector3.MoveTowards(paperPile[i].transform.position,Vector3(trashLocation.x,trashLocation.y,transform.position.z - (i * (3.0/paperPile.Length))),Time.deltaTime * 5);
		}
	}
	if(successNumber < paperPile.Length)
	{
		paperPile[successNumber].GetComponent(ObjectMovementManager).allowMovement = true;
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false);
	}
	if(successNumber >= paperPile.Length && !finished)
	{
		Finish(true);
	}
	// Sprites.
	if(timer < length && timer > 11/12f * length)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[0];
	}
	else if(timer < 11/12f * length && timer > 10/12f * length)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[1];
	}
	else if(timer < 10/12f * length && timer > 9/12f * length)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[2];
	}
	else if(timer < 9/12f * length && timer > 8/12f * length)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[3];
	}
	else if(timer < 8/12f * length && timer > 7/12f * length)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[4];
	}
	else if(timer < 7/12f * length && timer > 6/12f * length)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[5];
	}
	else if(timer < 6/12f * length && timer > 5/12f * length)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[6];
	}
	else if(timer < 5/12f * length && timer > 4/12f * length)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[7];
	}
	else if(timer < 4/12f * length && timer > 3/12f * length)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[8];
	}
	else if(timer < 3/12f * length && timer > 2/12f * length)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[9];
	}
	else if(timer < 2/12f * length && timer > 1/12f * length)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[10];
	}
	else if(timer < 1/12f * length && timer > 0)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[11];
	}
	else if(timer < 0)
	{
		clockHand.GetComponent(SpriteRenderer).sprite = clockSprites[0];
	}
}

function Finish(completionStatus) {
	if(Application.loadedLevelName == "MicroTester")
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(completionStatus);
	}
	else 
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).GameComplete(completionStatus);
	}
	finished = true;
}