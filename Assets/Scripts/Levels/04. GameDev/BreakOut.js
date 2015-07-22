#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var bricks:SpriteRenderer[];
@HideInInspector var brickExists:boolean[];
@HideInInspector var bricksToDestroy:int;
var paddle:GameObject;
var ballPrefab:GameObject;
@HideInInspector var balls:GameObject[];
@HideInInspector var momentum:Vector2[];

@HideInInspector var brickHeight:float;
@HideInInspector var brickWidth:float;
@HideInInspector var paddleHeight:float;
@HideInInspector var paddleWidth:float;

var burst:GameObject;
@HideInInspector var mostRecentBurst:GameObject;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	brickExists = new boolean[bricks.length];
	brickHeight = 1.3;
	brickWidth = 3.1;
	paddleHeight = 2.2;
	paddleWidth = 7;
	
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
	length = 6;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	
	balls = new GameObject[4-difficulty];
	momentum = new Vector2[balls.length];
	switch(difficulty)
	{
		case 1: 
			bricksToDestroy = 16;
			break;
		case 2:
			bricksToDestroy = 10; 
			break;
		case 3: 
			bricksToDestroy = 5;
			break;
		default:
			break;
	}
	for(var i:int = 0; i < bricks.length; i++)
	{
		brickExists[i] = true;
	}
	for(i = 0; i < bricksToDestroy; i++)
	{
		DestroyBrick();
	}
	for(i =0; i < balls.length; i++)
	{
		balls[i] = Instantiate(ballPrefab,Vector3(0,0,transform.position.z), Quaternion.identity);
		balls[i].transform.parent = transform;
		balls[i].transform.localScale = Vector3(1,1,1);
		momentum[i].x = Random.Range(-16.0 - speed*2,16.0 + speed*2);
		momentum[i].y = Random.Range(14 + speed * 6,18 + speed * 6);
		momentum *= speed;
	}
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
}

function DestroyBrick() {
	var randomBrickChoice:int = Random.Range(0,bricks.length);
	var randomChecker:int = 0;
	while(!brickExists[randomBrickChoice] && randomChecker < 30)
	{
		randomBrickChoice = Random.Range(0,bricks.length);
		randomChecker ++;
	}
	if(!brickExists[randomBrickChoice])
	{
		for(var i:int = 0; i < bricks.length; i++)
		{
			if(brickExists[i])
			{
				randomBrickChoice = i;
				break;
			}
		}
	}
	bricks[randomBrickChoice].color.a = 0;
	brickExists[randomBrickChoice] = false;
}

function Update () {
	
	if(timer < length * .85)
	{
		var deadBallCounter:int = 0;
		for(var ball:int = 0; ball < balls.length; ball++)
		{
			var deadBrickCounter:int = 0;
			if(Mathf.Abs(balls[ball].transform.position.x + momentum[ball].x * Time.deltaTime) >= 9)
			{
				momentum[ball].x *= -1;
			}
			balls[ball].transform.position.x += momentum[ball].x * Time.deltaTime;
			if(balls[ball].transform.position.y + momentum[ball].y * Time.deltaTime >= 9)
			{
				momentum[ball].y *= -1;
			}
			else if(balls[ball].transform.position.y + momentum[ball].y * Time.deltaTime <= -9)
			{
				momentum[ball].y = 0 ;
				balls[ball].transform.position.y = -30;
			}
			if(Mathf.Abs(balls[ball].transform.position.y - paddle.transform.position.y) < paddleHeight/2 && Mathf.Abs(balls[ball].transform.position.x - paddle.transform.position.x) < paddleWidth/2)
			{
				balls[ball].transform.position.y = paddle.transform.position.y + paddleHeight/1.9;
				momentum[ball].y *= -1;
				momentum[ball].x += (balls[ball].transform.position.x - paddle.transform.position.x) * 5;
				if(momentum[ball].x > 9)
				{
					momentum[ball].x = 9;
				}
				else if(momentum[ball].x < -9)
				{
					momentum[ball].x = -9;
				}
			}
			balls[ball].transform.position.y += momentum[ball].y * Time.deltaTime;
			if(momentum[ball].y == 0)
			{
				deadBallCounter ++;
			}
			for(var brick:int = 0; brick < bricks.length; brick++)
			{
				if(brickExists[brick])
				{
					if(Mathf.Abs(bricks[brick].transform.position.x-balls[ball].transform.position.x) < brickWidth/2 && Mathf.Abs(bricks[brick].transform.position.y-balls[ball].transform.position.y) < brickHeight/2)
					{
						mostRecentBurst = Instantiate(burst,bricks[brick].transform.position,Quaternion.identity);
						mostRecentBurst.transform.parent = transform;
						brickExists[brick] = false;
						bricks[brick].color.a = 0;
						if(Mathf.Abs(bricks[brick].transform.position.x-balls[ball].transform.position.x) > brickWidth*2/3)
						{
							momentum[ball].x *= -1;
						}
						if(balls[ball].transform.position.y > bricks[brick].transform.position.x)
						{
							momentum[ball].y = Mathf.Abs(momentum[ball].y);
						}
						else
						{
							momentum[ball].y = Mathf.Abs(momentum[ball].y) * -1;
						}
					}	
				}
				if(!brickExists[brick])
				{
					deadBrickCounter++;
				}
			}
			if(deadBrickCounter == bricks.Length)
			{
				Finish(true,0);
			}
		}
		if(deadBallCounter == balls.Length)
		{
			Finish(false,0);
		}
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true,0);
	}
	// Get important finger.
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i) && Finger.GetInGame(i))
			{
				importantFinger = i;
				break;
			}
		}
	}
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		if(Mathf.Abs(Finger.GetPosition(importantFinger).x-paddle.transform.position.x) < paddleWidth)
		{
			paddle.transform.position.x = Finger.GetPosition(importantFinger).x;
			if(paddle.transform.position.x > 8)
			{
				paddle.transform.position.x = 8;
			}
			if(paddle.transform.position.x < -8)
			{
				paddle.transform.position.x = -8;
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
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