#pragma strict

private var finished:boolean;

private var darknessObject;

var failBack:GameObject;
var failBackMove:boolean;

var darknessAmount:Color;

var plates:GameObject[];

var buttons:SpriteRenderer[];

var offColor:Color;

var food0Sprites:Sprite[];
var food1Sprites:Sprite[];
var food2Sprites:Sprite[];
var food3Sprites:Sprite[];

var overfillSprite:Sprite;

@HideInInspector var plateFullness:int[];
@HideInInspector var plateSpeed:float[];
@HideInInspector var plateFoodType:int[];

@HideInInspector var clicked:boolean[];

@HideInInspector var distance:float;

var people:GameObject[];
@HideInInspector var peopleSpeed:float[];

@HideInInspector var firstNotify:boolean;

@HideInInspector var clickWait:float;

@HideInInspector var score:float;

@HideInInspector var gameSpeed:float;

function Start () {
	gameSpeed = .5;
	score = 0;
	failBackMove = false;
	failBack.transform.position.y = 12;
	clickWait = .1;
	firstNotify = false;
	distance = 5;
	clicked = new boolean[5];
	clicked = [false,false,false,false,false];
	peopleSpeed = new float[people.length];
	for(var i:int = 0; i < peopleSpeed.length; i++)
	{
		peopleSpeed[i] = Random.Range(2.5,10.5);
		if(people[i].transform.position.x > 0)
		{
			peopleSpeed[i] = -peopleSpeed[i];
		}
	}
	plateFullness = new int[plates.length];
	plateSpeed = new float[plates.length];
	plateFoodType = new int[plates.length];
	for(i = 0;i<plates.length;i++)
	{
		plateFullness[i] = 1;
		plateSpeed[i] = 1;
		plateFoodType[i] = Random.Range(0,food1Sprites.Length);
	}
	Play();
}

function Update () {
	if(finished)
	{
		
	}
	else
	{
		gameSpeed += (.1 * Time.deltaTime)/gameSpeed;
		score += Time.deltaTime;
		ArcadeTimer.currentTime = score;
	}
	if(failBackMove)
	{
		failBack.transform.position.y = Mathf.MoveTowards(failBack.transform.position.y,0,Time.deltaTime * 10);
	}
	clickWait -= Time.deltaTime;
	for(var i:int = 0;i<plates.length;i++)
	{
		if(!finished)
		{
			if(plateFoodType[i] == 0)
			{
				plates[i].GetComponent(SpriteRenderer).sprite = food0Sprites[plateFullness[i]];
			}
			if(plateFoodType[i] == 1)
			{
				plates[i].GetComponent(SpriteRenderer).sprite = food1Sprites[plateFullness[i]];
			}
			if(plateFoodType[i] == 2)
			{
				plates[i].GetComponent(SpriteRenderer).sprite = food2Sprites[plateFullness[i]];
			}
			if(plateFoodType[i] == 3)
			{
				plates[i].GetComponent(SpriteRenderer).sprite = food3Sprites[plateFullness[i]];
			}
		}
		if(plateFullness[i] <= 1)
		{
			buttons[i].color = Color.white;
		}
		else
		{
			buttons[i].color = offColor;
		}
	}
	for(i = 0; i < peopleSpeed.length; i++)
	{
		if(Mathf.Abs(people[i].transform.position.x + (peopleSpeed[i] * Time.deltaTime)) > 9)
		{
			people[i].transform.localScale.x = people[i].transform.localScale.x * -1;
			peopleSpeed[i] = -peopleSpeed[i];
		}
		else
		{
			people[i].transform.position.x += peopleSpeed[i] * Time.deltaTime;
		}
	}
	for(i = 0; i < Finger.identity.length; i++)
	{
		if(Finger.GetExists(i) && Finger.GetInGame(i) && !clicked[i] && !finished)
		{
			clicked[i] = true;
			var nearestNum:float = 1000;
			var rightPlate:int = -1;
			for(var plate:int = 0; plate < plates.length; plate++)
			{
				if(Mathf.Abs(Finger.GetPosition(i).x - plates[plate].transform.position.x) < nearestNum)
				{
					nearestNum = Mathf.Abs(Finger.GetPosition(i).x - plates[plate].transform.position.x);
					rightPlate = plate;
				}
			}
			clickWait = .1;
			ClickPlate(rightPlate);
			break;
		}
		else if(!Finger.GetExists(i) || !Finger.GetInGame(i))
		{
			clicked[i] = false;
		}
	}
}

function Play () {
	ClickPlate(0);
	ClickPlate(1);
	ClickPlate(2);
	ClickPlate(3);
	yield WaitForSeconds(.4);
	FoodServe(0);
	FoodServe(1);
	FoodServe(2);
	FoodServe(3);
}

function ClickPlate(thisPlate:int) {
	if(plateFullness[thisPlate] > 1)
	{
		if(!finished)
		{
			plates[thisPlate].GetComponent(SpriteRenderer).sprite = overfillSprite;
			finished = true;
			failBackMove = true;
			yield WaitForSeconds(1.2);
			Finish();
		}
	}
	else
	{
		plateFoodType[thisPlate] = Random.Range(0,4);
		plateFullness[thisPlate] = 3;
		plateSpeed[thisPlate] = Random.Range(1.7,3.1) + (Random.Range(.4,.9) * gameSpeed);
	}
}

function FoodServe(thisPlate:int) {
	while(true && !finished)
	{
		var counter:float = 2.5;
		while(counter > 0)
		{
			counter -= plateSpeed[thisPlate] * Time.deltaTime;
			yield;
		}
		if(plateFullness[thisPlate]>0)
		{
			plateFullness[thisPlate]--;
		}
		else if(!finished)
		{
			Finish();
		}
	}
	yield;
}		

function Finish() {
	if(!finished)
	{
		finished = true;
		GameObject.FindGameObjectWithTag("ArcadeManager").GetComponent(ArcadeManager).FinishGame(score);
	}
}