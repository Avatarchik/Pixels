#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var clicked:boolean[];

var cardsTop:SpriteRenderer[];
var cardsBottom:SpriteRenderer[];

var cardBackTop:Sprite;
var cardBackBottom:Sprite;

var cardSpritesTop:Sprite[];
var cardSpritesBottom:Sprite[];

var correctTop:SpriteRenderer;
var correctBottom:SpriteRenderer;

var potentialOrders:Order[];

@HideInInspector var selectionTopLocation:Vector3;
@HideInInspector var selectionBottomLocation:Vector3;

@HideInInspector var topValues:int[];
@HideInInspector var bottomValues:int[];

var topHighlights:SpriteRenderer[];
var bottomHighlights:SpriteRenderer[];

@HideInInspector var topSelection:int;
@HideInInspector var bottomSelection:int;

@HideInInspector var correctTopNumber:int;
@HideInInspector var correctBottomNumber:int;	

@HideInInspector var progress:int;
@HideInInspector var goal:int;

var difficulty1Progress:Sprite[];
var difficulty2Progress:Sprite[];
var difficulty3Progress:Sprite[];

@HideInInspector var difficultyProgress:Sprite[];
var progressBar:SpriteRenderer;

@HideInInspector var scoring:boolean;

@HideInInspector var clickDistance:float;

@HideInInspector var checking:boolean;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = new boolean[5];
	clicked = [false,false,false,false,false];
	
	// Level specific variable initialization.
	selectionTopLocation = Vector3(0,-2.53,0);
	selectionBottomLocation = Vector3(0,-3.93,0);
	progress = 0;
	scoring = false;
	clickDistance = 1.5;
	checking = false;
	topValues = new int[4];
	bottomValues = new int[4];
	
	// Speed and difficulty information.
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
	if(difficulty == 1)
	{
		difficultyProgress = difficulty1Progress;
	}
	else if(difficulty == 2)
	{
		difficultyProgress = difficulty2Progress;
	}
	else
	{
		difficultyProgress = difficulty3Progress;
	}
	goal = difficulty + 2;
	length = goal * (7 - .48 * speed);
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
}

function Update () {
	progressBar.sprite = difficultyProgress[Mathf.Min(progress,difficultyProgress.Length)];
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false,0);
	}
	// Get important finger.
	for(var i:int = 0; i < Finger.identity.length; i++)
	{
		if(!Master.paused && Finger.GetExists(i) && Finger.GetInGame(i) && !clicked[i] && !finished)
		{
			if(!checking)
			{
				Debug.Log(Vector2.Distance(Finger.GetPosition(i),cardsTop[0].transform.position));
				for(var x:int = 0; x < cardsTop.length; x++)
				{
					if(Vector2.Distance(Finger.GetPosition(i),cardsTop[x].transform.position) < clickDistance)
					{
						topSelection = x;
					}
				}
				for(x = 0; x < cardsBottom.length; x++)
				{
					if(Vector2.Distance(Finger.GetPosition(i),cardsBottom[x].transform.position) < clickDistance)
					{
						bottomSelection = x;
					}
				}
			}
			clicked[i] = true;
		}
		else if(!Finger.GetExists(i) || !Finger.GetInGame(i))
		{
			clicked[i] = false;
		}
	}
	for(i = 0; i < topHighlights.length; i++)
	{
		if(i == topSelection)
		{
			topHighlights[i].color.a = Mathf.MoveTowards(topHighlights[i].color.a,1,Time.deltaTime * 2);
		}
		else
		{
			topHighlights[i].color.a = Mathf.MoveTowards(topHighlights[i].color.a,0,Time.deltaTime * 2);
		}
	}
	for(i = 0; i < bottomHighlights.length; i++)
	{
		if(i == bottomSelection)
		{
			bottomHighlights[i].color.a = Mathf.MoveTowards(bottomHighlights[i].color.a,1,Time.deltaTime * 2);
		}
		else
		{
			bottomHighlights[i].color.a = Mathf.MoveTowards(bottomHighlights[i].color.a,0,Time.deltaTime * 2);
		}
	}
}

function Play () {
	while(progress < goal)
	{
		while(cardsTop[0].transform.localScale.x != 0)
		{
			for(var i:int = 0; i < cardsTop.length; i++)
			{
				cardsTop[i].transform.localScale.x = Mathf.MoveTowards(cardsTop[i].transform.localScale.x,0,Time.deltaTime * 5);
				cardsBottom[i].transform.localScale.x = Mathf.MoveTowards(cardsBottom[i].transform.localScale.x,0,Time.deltaTime * 5);
				correctTop.transform.localScale.x = Mathf.MoveTowards(correctTop.transform.localScale.x,0,Time.deltaTime * 5);
				correctBottom.transform.localScale.x = Mathf.MoveTowards(correctBottom.transform.localScale.x,0,Time.deltaTime * 5);
			}
			yield;
		}
		RandomizeCards();
		while(cardsTop[0].transform.localScale.x != 1)
		{
			for(i = 0; i < cardsTop.length; i++)
			{
				cardsTop[i].transform.localScale.x = Mathf.MoveTowards(cardsTop[i].transform.localScale.x,1,Time.deltaTime * 5);
				cardsBottom[i].transform.localScale.x = Mathf.MoveTowards(cardsBottom[i].transform.localScale.x,1,Time.deltaTime * 5);
				correctTop.transform.localScale.x = Mathf.MoveTowards(correctTop.transform.localScale.x,1,Time.deltaTime * 5);
				correctBottom.transform.localScale.x = Mathf.MoveTowards(correctBottom.transform.localScale.x,1,Time.deltaTime * 5);
			}
			yield;
		}
		checking = false;
		while(topSelection == -1 || bottomSelection == -1)
		{
			yield;
		}
		checking = true;
		scoring = true;
		ScoreSuccess();
		while(scoring)
		{
			yield;
		}
		if(progress < goal)
		{
			while(cardsTop[0].transform.localScale.x != 0)
			{
				for(i = 0; i < cardsTop.length; i++)
				{
					cardsTop[i].transform.localScale.x = Mathf.MoveTowards(cardsTop[i].transform.localScale.x,0,Time.deltaTime * 5);
					cardsBottom[i].transform.localScale.x = Mathf.MoveTowards(cardsBottom[i].transform.localScale.x,0,Time.deltaTime * 5);
					correctTop.transform.localScale.x = Mathf.MoveTowards(correctTop.transform.localScale.x,0,Time.deltaTime * 5);
					correctBottom.transform.localScale.x = Mathf.MoveTowards(correctBottom.transform.localScale.x,0,Time.deltaTime * 5);
				}
				yield;
			}
			HideCards();
			while(cardsTop[0].transform.localScale.x != 1)
			{
				for(i = 0; i < cardsTop.length; i++)
				{
					cardsTop[i].transform.localScale.x = Mathf.MoveTowards(cardsTop[i].transform.localScale.x,1,Time.deltaTime * 5);
					cardsBottom[i].transform.localScale.x = Mathf.MoveTowards(cardsBottom[i].transform.localScale.x,1,Time.deltaTime * 5);
					correctTop.transform.localScale.x = Mathf.MoveTowards(correctTop.transform.localScale.x,1,Time.deltaTime * 5);
					correctBottom.transform.localScale.x = Mathf.MoveTowards(correctBottom.transform.localScale.x,1,Time.deltaTime * 5);
				}
				yield;
			}
		}
		yield;
	}
	Finish(true,.5);
}

function RandomizeCards () {
	topSelection = -1;
	bottomSelection = -1;
	var order1:Order = potentialOrders[Random.Range(0,potentialOrders.length)];
	var order2:Order = potentialOrders[Random.Range(0,potentialOrders.length)];
	topValues[0] = order1.one;
	topValues[1] = order1.two;
	topValues[2] = order1.three;
	topValues[3] = order1.four;
	cardsTop[0].sprite = cardSpritesTop[order1.one];
	cardsTop[1].sprite = cardSpritesTop[order1.two];
	cardsTop[2].sprite = cardSpritesTop[order1.three];
	cardsTop[3].sprite = cardSpritesTop[order1.four];
	
	bottomValues[0] = order2.one;
	bottomValues[1] = order2.two;
	bottomValues[2] = order2.three;
	bottomValues[3] = order2.four;
	cardsBottom[0].sprite = cardSpritesBottom[order2.one];
	cardsBottom[1].sprite = cardSpritesBottom[order2.two];
	cardsBottom[2].sprite = cardSpritesBottom[order2.three];
	cardsBottom[3].sprite = cardSpritesBottom[order2.four];
	
	correctTopNumber = Random.Range(0,cardSpritesTop.length);
	correctBottomNumber = Random.Range(0,cardSpritesBottom.length);
	correctTop.sprite = cardSpritesTop[correctTopNumber];
	correctBottom.sprite = cardSpritesBottom[correctBottomNumber];
}

function HideCards () {
	for(var x:int = 0; x < cardsTop.length; x++)
	{
		cardsTop[x].sprite = cardBackTop;
	}
	for(x = 0; x < cardsBottom.length; x++)
	{
		cardsBottom[x].sprite = cardBackBottom;
	}
	correctTop.sprite = cardBackTop;
	correctBottom.sprite = cardBackBottom;
}

function ScoreSuccess () {
	if(topValues[topSelection] == correctTopNumber &&  bottomValues[bottomSelection] == correctBottomNumber)
	{
		var topReturn:Vector3 = cardsTop[topSelection].transform.position;
		var bottomReturn:Vector3 = cardsBottom[bottomSelection].transform.position;
		while(cardsTop[topSelection].transform.position != selectionTopLocation || cardsBottom[bottomSelection].transform.position != selectionBottomLocation)
		{
			cardsTop[topSelection].transform.position = Vector3.MoveTowards(cardsTop[topSelection].transform.position,selectionTopLocation,Time.deltaTime * 10);
			cardsBottom[bottomSelection].transform.position = Vector3.MoveTowards(cardsBottom[bottomSelection].transform.position,selectionBottomLocation,Time.deltaTime * 10);
			yield;
		}
		yield WaitForSeconds(.4);
		cardsTop[topSelection].transform.position = topReturn;
		cardsBottom[bottomSelection].transform.position = bottomReturn;
		progress++;
	}
	else 
	{
		yield WaitForSeconds(.4);
	}
	scoring = false;
}

function Finish(completionStatus:boolean,waitTime:float) {
	if(!finished)
	{
		finished = true;
		GameObject.FindGameObjectWithTag("GameController").BroadcastMessage("GameComplete",completionStatus,SendMessageOptions.DontRequireReceiver);
		if(colorChange)
		{
			GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", Color(0,0,0,0),SendMessageOptions.DontRequireReceiver);
		}
	}
}

class Order {
	var one:int;
	var two:int;
	var three:int;
	var four:int;
}

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", colorForChange,SendMessageOptions.DontRequireReceiver);
	yield;
}