#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:float;
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

@HideInInspector var score:float;

var flapSound:AudioClip;

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
	score = 0;
	
	// Speed and difficulty information.
	speed = 1;
	pipes = new GameObject[3];
	pipeMovement = new boolean[pipes.length];
	pipeMovementRandomizer = new float[pipes.length];
	pipeSpeed = 14.5 + 2.5 * speed;
	momentumChange = 40 + 4.5 * speed;
	for(var i:int = 0; i < pipes.length; i++)
	{
		pipes[i] = Instantiate(pipePrefab,Vector3(pipeStartLocation + (i*distanceBetweenPipes),Random.Range(minPipeHeight,maxPipeHeight),transform.position.z),Quaternion.identity);
		pipes[i].transform.parent = transform;
		if(i != 0)
		{
			if(Random.value < .2)
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
	
	// If The game doesn't just run in Update.
	Play();
}

function Update () {
	if(!finished)
	{
		score += Time.deltaTime;
		ArcadeTimer.currentTime = score;
		speed += Time.deltaTime * .1;
		pipeSpeed = 14.5 + 2.5 * speed;
		momentumChange = 40 + 4.5 * speed;
	}
	timer -= Time.deltaTime;
	if(timer < length-.5)
	{
		if(pipes[0].transform.position.x < -12)
		{
			pipes[0].transform.position.x = pipes[2].transform.position.x + distanceBetweenPipes;
			pipes[0].transform.position.y = Random.Range(minPipeHeight,maxPipeHeight);
			if(Random.value < .2)
			{
				pipeMovement[0] = true;
			}
			else
			{
				pipeMovement[0] = false;
			}
		}
		if(pipes[1].transform.position.x < -12)
		{
			pipes[1].transform.position.x = pipes[0].transform.position.x + distanceBetweenPipes;
			pipes[1].transform.position.y = Random.Range(minPipeHeight,maxPipeHeight);
			if(Random.value < .2)
			{
				pipeMovement[1] = true;
			}
			else
			{
				pipeMovement[1] = false;
			}
		}
		if(pipes[2].transform.position.x < -12)
		{
			pipes[2].transform.position.x = pipes[1].transform.position.x + distanceBetweenPipes;
			pipes[2].transform.position.y = Random.Range(minPipeHeight,maxPipeHeight);
			if(Random.value < .2)
			{
				pipeMovement[2] = true;
			}
			else
			{
				pipeMovement[2] = false;
			}
		}
		momentum = Mathf.Lerp(momentum,-maximumMomentum,pipeSpeed * .17 * Time.deltaTime);
		for(var pipe:int = 0; pipe < pipes.length; pipe ++)
		{
			if(pipes[pipe].transform.position.x < 11 && pipes[pipe].transform.position.x > - 11)
			{
				pipes[pipe].transform.position.z = transform.position.z-.1;
			}
			else
			{
				pipes[pipe].transform.position.z = 200;
			}
			pipes[pipe].transform.position.x -= pipeSpeed * Time.deltaTime;
			if(Mathf.Abs(pipes[pipe].transform.position.x-bird.transform.position.x) < pipeWidth/2 && Mathf.Abs(pipes[pipe].transform.position.y-bird.transform.position.y) > gapHeight/2 && !dead)
			{
				bird.transform.rotation.eulerAngles.z = 90;
				dead = true;
				Finish();
			}
			if(pipeMovement[pipe])
			{
				pipes[pipe].transform.position.y = Mathf.Sin((Time.time + pipeMovementRandomizer[pipe]) * (2.2)) * 4;
			}
		}
		bird.transform.position.y += momentum * Time.deltaTime;
	}
	if(bird.transform.position.y < -10 && !dead)
	{
		dead = true;
		Finish();
	}
	if(Input.GetKeyDown("space") && !dead)
	{
		Flap();
		AudioManager.PlaySound(flapSound,.2,1.4);
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
		AudioManager.PlaySound(flapSound,.2,1.4);
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

function Finish() {
	if(!finished)
	{
		finished = true;
		yield WaitForSeconds(.35);
		GameObject.FindGameObjectWithTag("ArcadeManager").GetComponent(ArcadeManager).FinishGame(score);
	}
}