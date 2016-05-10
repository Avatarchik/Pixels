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

var leftFace:GameObject;
var rightFace:GameObject;

var leftSprites:Sprite[];
var rightSprites:Sprite[];

var heart:Transform;

@HideInInspector var moveSpeed:float;
@HideInInspector var returnSpeed:float;
@HideInInspector var goal:float;
@HideInInspector var start:float;
@HideInInspector var progress:float;
@HideInInspector var recedeSpeed:float;
@HideInInspector var changeAmount:float;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = new boolean[5];
	clicked = [false,false,false,false,false];
	goal = .55;
	start = 1.1;
	
	// Level specific variable initialization.
	leftFace.GetComponent(SpriteRenderer).sprite = leftSprites[Random.Range(0,leftSprites.Length)];
	rightFace.GetComponent(SpriteRenderer).sprite = rightSprites[Random.Range(0,rightSprites.Length)];
	progress = 0;
	
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
	length = 3 + 5/speed;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	changeAmount = .09 - (difficulty * .01);
	recedeSpeed = .1 + .03 * speed;
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
}

function Update () {
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false,0);
	}
	
	if(Input.GetKeyDown("space"))
	{
		progress = Mathf.MoveTowards(progress,1,changeAmount);
		heart.transform.localScale = Vector3.one * (1 + progress);
	}
	if(progress != 1)
	{
		progress = Mathf.MoveTowards(progress,0,Time.deltaTime * recedeSpeed);
	}
	leftFace.transform.localPosition.x = Mathf.Lerp(-start,-goal,progress);
	rightFace.transform.localPosition.x = Mathf.Lerp(start,goal,progress);
	
	if(progress == 1)
	{
		Finish(true,1);
		heart.transform.localScale = Vector3.MoveTowards(heart.transform.localScale,Vector3.one * 10,Time.deltaTime*5);
	}
	else
	{
		heart.transform.localScale = Vector3.MoveTowards(heart.transform.localScale,Vector3.one,Time.deltaTime*3);
	}

	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	for(var i:int = 0; i < Finger.identity.length; i++)
	{
		if(!Master.paused && Finger.GetExists(i) && Finger.GetInGame(i) && !clicked[i] && !finished)
		{
			progress = Mathf.MoveTowards(progress,1,changeAmount);
			heart.transform.localScale = Vector3.one * (1 + progress);
			clicked[i] = true;
		}
		else if(!Finger.GetExists(i) || !Finger.GetInGame(i))
		{
			clicked[i] = false;
		}
	}
}

function Play () {

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

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", colorForChange,SendMessageOptions.DontRequireReceiver);
	yield;
}