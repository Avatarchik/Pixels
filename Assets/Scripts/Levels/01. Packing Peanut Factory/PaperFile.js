#pragma strict

@HideInInspector var controller:Component;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var greenPapers:GameObject[];
var redPapers:GameObject[];
var trashPapers:GameObject[];
@HideInInspector var paperPile:GameObject[];
@HideInInspector var paperValue:int[];
var highlight:GameObject;

@HideInInspector var startLocation:Vector2;
@HideInInspector var greenLocation:Vector2;
@HideInInspector var redLocation:Vector2;
@HideInInspector var trashLocation:Vector2;

var clockHand:GameObject;
var clockSprites:Sprite[];
@HideInInspector var distance:float;

var successNumber:int;

var paperStick:AudioClip;

function Start () {
	if(Application.loadedLevelName == "MicroTester")
	{
		speed = MicroTester.timeMultiplier;
		difficulty = MicroTester.difficulty;
	}
	else
	{
		speed = GameManager.speed;
		difficulty = GameManager.difficulty;
	}
	distance = 2.7;
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
		if(difficulty > 2)
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
				paperPile[i] = Instantiate(trashPapers[Random.Range(0,trashPapers.Length)],Vector3(startLocation.x,startLocation.y,transform.position.z - 3.5 + (i * (3.0/paperPile.Length))),Quaternion.identity);
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
	length = paperPile.Length * Mathf.Max((1.2 - speed * .12),.7);
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	timer = length;
}

function Update () {
	if(successNumber < paperPile.Length)
	{
		if(paperPile[successNumber].transform.position.x > 8.5)
		{
			paperPile[successNumber].transform.position.x = 8.5;
		}
		if(paperPile[successNumber].transform.position.x < -8.5)
		{
			paperPile[successNumber].transform.position.x = -8.5;
		}
		if(paperPile[successNumber].transform.position.y > 8.5)
		{
			paperPile[successNumber].transform.position.y = 8.5;
		}
		if(paperPile[successNumber].transform.position.y < -8.5)
		{
			paperPile[successNumber].transform.position.y = -8.5;
		}
		highlight.transform.position = paperPile[successNumber].transform.position + Vector3(0,0,.01);
		highlight.GetComponent(SpriteRenderer).color.a =  Mathf.Abs(Mathf.Sin(Time.time *2)/1.5) + .3;
	}
	for(var i:int = 0; i < paperPile.Length; i++)
	{
		if(Vector2.Distance(paperPile[i].transform.position,greenLocation) < distance && paperValue[i] == 0)
		{
			AudioManager.PlaySound(paperStick,.07,Random.Range(.9,1.1));
			paperPile[successNumber].GetComponent(ObjectMovementManager).allowMovement = false;
			paperValue[i] = 10;
			successNumber ++;
		}
		if(Vector2.Distance(paperPile[i].transform.position,redLocation) < distance && paperValue[i] == 1)
		{
			AudioManager.PlaySound(paperStick,.07,Random.Range(.9,1.1));
			paperPile[successNumber].GetComponent(ObjectMovementManager).allowMovement = false;
			paperValue[i] = 11;
			successNumber ++;
		}
		if(Vector2.Distance(paperPile[i].transform.position,trashLocation) < distance && paperValue[i] == 2)
		{
			AudioManager.PlaySound(paperStick,.07,Random.Range(.9,1.1));
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

function Finish(completionStatus:boolean) {
	UITimer.soundsOn = !completionStatus;
	if(!completionStatus)
	{
		SendTutorial();
	}
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

function SendTutorial () {
	if(PlayerPrefs.HasKey("TutorialFor:" + transform.name))
	{
		PlayerPrefs.SetInt("TutorialFor:" + transform.name,PlayerPrefs.GetInt("TutorialFor:" + transform.name) + 1);
	}
	else
	{
		PlayerPrefs.SetInt("TutorialFor:" + transform.name,1);
	}
	if((PlayerPrefs.GetInt("TutorialFor:" + transform.name) > 1) && Application.loadedLevelName == "MicroGameLauncher" && PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"BeatEndPlayed") == 0 && !Master.hardMode)
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).TurnOnNotification("Drag each paper into the correct pile!");
		PlayerPrefs.SetInt("TutorialFor:" + transform.name,-1);
	}
}