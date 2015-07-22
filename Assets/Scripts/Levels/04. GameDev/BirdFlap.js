#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var pipePrefab:GameObject;
var bird:GameObject;
var birdSprites:Sprite[];

@HideInInspector var pipes:GameObject[];
@HideInInspector var pipeMovement:boolean[];
@HideInInspector var pipeMovementRandomizer:float[];

@HideInInspector var pipeStartLocation:float;
@HideInInspector var distanceBetweenPipes:float;
@HideInInspector var minPipeHeight:float;
@HideInInspector var maxPipeHeight:float;
@HideInInspector var pipeWidth:float;
@HideInInspector var gapHeight:float;

@HideInInspector var terminalVelocity:float;
@HideInInspector var momentumChange:float;
@HideInInspector var maximumMomentum:float;

@HideInInspector var pipeSpeed:float;

@HideInInspector var momentum:float;

@HideInInspector var dead:boolean;

@HideInInspector var clicked:boolean;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = false;
	
	// Level specific variable initialization.
	pipeStartLocation = 10;
	distanceBetweenPipes = 15.5;
	minPipeHeight = -4.01;
	maxPipeHeight = 4.01;
	momentum = 0;
	terminalVelocity = -3;
	maximumMomentum = 30;
	pipeWidth = 4.6;
	gapHeight = 6;
	dead = false;
	
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
	pipes = new GameObject[5+difficulty];
	pipeMovement = new boolean[pipes.length];
	pipeMovementRandomizer = new float[pipes.length];
	pipeSpeed = 6.5 + 3.5 * speed;
	momentumChange = 23 + 7 * speed;
	length = (((pipes.length-1) + pipeStartLocation*2 + (pipes.length-1) * distanceBetweenPipes)/pipeSpeed);
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	for(var i:int = 0; i < pipes.length; i++)
	{
		pipes[i] = Instantiate(pipePrefab,Vector3(pipeStartLocation + (i*distanceBetweenPipes),Random.Range(minPipeHeight,maxPipeHeight),transform.position.z),Quaternion.identity);
		pipes[i].transform.parent = transform;
		if(difficulty == 3)
		{
			if(Random.Range(0,2) == 1)
			{
				pipeMovementRandomizer[i] = Random.Range(0,.99);
				pipeMovement[i] = true;
			}
			else
			{
				pipeMovementRandomizer[i] = 0;
				pipeMovement[i] = false;
			}
		}
		else
		{
			pipeMovement[i] = false;
		}
	}
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
		Finish(true,0);
	}
	if(timer < length-.5)
	{
		momentum = Mathf.Lerp(momentum,-maximumMomentum,pipeSpeed * .17 * Time.deltaTime);
		for(var pipe:int = 0; pipe < pipes.length; pipe ++)
		{
			pipes[pipe].transform.position.x -= pipeSpeed * Time.deltaTime;
			if(Mathf.Abs(pipes[pipe].transform.position.x-bird.transform.position.x) < pipeWidth/2 && Mathf.Abs(pipes[pipe].transform.position.y-bird.transform.position.y) > gapHeight/2 && !dead)
			{
				bird.transform.rotation.eulerAngles.z = 90;
				dead = true;
				Finish(false,.3);
			}
			if(pipeMovement[pipe])
			{
				pipes[pipe].transform.position.y = Mathf.Sin((Time.time + pipeMovementRandomizer[pipe]) * (.5 + .5*speed)) * 4;
			}
		}
		bird.transform.position.y += momentum * Time.deltaTime;
	}
	if(bird.transform.position.y < -10 && !dead)
	{
		dead = true;
		Finish(false,0);
	}
	if(Input.GetKeyDown("space") && !dead)
	{
		Flap();
		if(momentum < -momentumChange * .5)
		{
			momentum = momentumChange * .5;
		}	
		else
		{
			momentum = momentumChange * .7;
		}
	}
	if(dead)
	{
		bird.transform.position.x -= pipeSpeed * Time.deltaTime;
	}
	// Get important finger.
	if(importantFinger == -1)
	{
		clicked = false;
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
	if(Finger.GetExists(importantFinger) && !Master.paused && !clicked && !dead)
	{
		Flap();
		if(momentum < -momentumChange * .5)
		{
			momentum = momentumChange * .5;
		}	
		else
		{
			momentum = momentumChange * .7;
		}
		clicked = true;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
}

function Play () {

}

function Flap () { 
	bird.GetComponent(SpriteRenderer).sprite = birdSprites[1];
	yield WaitForSeconds(.1);
	bird.GetComponent(SpriteRenderer).sprite = birdSprites[2];
	yield WaitForSeconds(.1);
	bird.GetComponent(SpriteRenderer).sprite = birdSprites[0];
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