#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

private var speed:int;
private var difficulty:int;
private var finished:boolean;
private var length:float;
private var timer:float;

private var darknessObject;

var failBack:GameObject;
var failBackMove:boolean;

var darknessAmount:Color;

var slider1:GameObject;
var slider2:GameObject;

var rockets:GameObject[];
var particles:ParticleSystem[];

var rocketOrder:int[];

@HideInInspector var explodeHeighMinimum:float;
@HideInInspector var explodeHeightMaximum:float;

@HideInInspector var launchHeight:float;

@HideInInspector var leftLimit:float;
@HideInInspector var centerLimit:float;
@HideInInspector var rightLimit:float;

@HideInInspector var exploded:boolean[];

var importantFinger:int;

var doneness:boolean[];

@HideInInspector var whichSlider:int;

var launchSound:AudioClip;
var explodeSound:AudioClip;

function Start () {
	failBackMove = false;
	failBack.transform.position.y = 12;
	whichSlider = 0;
	rocketOrder = new int[3];
	rocketOrder[0] = Random.Range(0,3);
	if(Random.value < .5)
	{
		rocketOrder[0] = 2;
		if(Random.value < .5)
		{
			rocketOrder[1] = 0;
			rocketOrder[2] = 1;
		}
		else
		{
			rocketOrder[1] = 1;
			rocketOrder[2] = 0;
		}
	}
	else
	{
		rocketOrder[0] = 0;
		if(Random.value < .5)
		{
			rocketOrder[1] = 1;
			rocketOrder[2] = 2;
		}
		else
		{
			rocketOrder[1] = 2;
			rocketOrder[2] = 1;
		}
	}
	exploded = new boolean[3];
	exploded = [false,false,false];
	importantFinger = -1;
	explodeHeighMinimum = .2;
	explodeHeightMaximum = 6;
	
	launchHeight = 1.25;
	
	leftLimit = slider1.transform.position.x;
	centerLimit = 0;
	rightLimit = slider2.transform.position.x;
	
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
	length = 3 + (5/speed * difficulty);
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	doneness = new boolean[difficulty];
	StartCoroutine(ColorChange());
	StartCoroutine(Play());
}

function Update () {
	if(failBackMove)
	{
		failBack.transform.position.y = Mathf.MoveTowards(failBack.transform.position.y,0,Time.deltaTime * 10);
	}
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
		if(Mathf.Abs(slider1.transform.position.x - leftLimit) < 2)
		{
			slider1.transform.position.x = Mathf.MoveTowards(slider1.transform.position.x,leftLimit,Time.deltaTime*4);
		}
		else if(Mathf.Abs(slider1.transform.position.x - centerLimit) < 2)
		{
			slider1.transform.position.x = Mathf.MoveTowards(slider1.transform.position.x,centerLimit,Time.deltaTime*4);
		}
		if(Mathf.Abs(slider2.transform.position.x - rightLimit) < 2)
		{
			slider2.transform.position.x = Mathf.MoveTowards(slider2.transform.position.x,rightLimit,Time.deltaTime*4);
		}
		else if(Mathf.Abs(slider2.transform.position.x - centerLimit) < 2)
		{
			slider2.transform.position.x = Mathf.MoveTowards(slider2.transform.position.x,centerLimit,Time.deltaTime*4);
		}
	}
	if(Finger.GetExists(importantFinger) && !finished && !Master.paused)
	{
		if(Mathf.Abs(Finger.GetPosition(importantFinger).x-slider1.transform.position.x) < Mathf.Abs(Finger.GetPosition(importantFinger).x-slider2.transform.position.x) && whichSlider == 0)
		{
			whichSlider = -1;
		}
		else if(whichSlider == 0)
		{
			whichSlider = 1;
		}
		if(whichSlider == -1 && Mathf.Abs(Finger.GetPosition(importantFinger).x-slider1.transform.position.x) < 9 && Finger.GetPosition(importantFinger).y > 0)
		{
			if(Finger.GetPosition(importantFinger).x >leftLimit && Finger.GetPosition(importantFinger).x < centerLimit + .2 && Mathf.Abs(slider2.transform.position.x-Finger.GetPosition(importantFinger).x) > 4.5)
			{
				slider1.transform.position.x = Finger.GetPosition(importantFinger).x;
			}
			else if(Finger.GetPosition(importantFinger).x <= leftLimit)
			{
				slider1.transform.position.x = Mathf.MoveTowards(slider1.transform.position.x,leftLimit,Time.deltaTime * 5);
			}
			else if(Finger.GetPosition(importantFinger).x >= centerLimit + .2)
			{
				slider1.transform.position.x = Mathf.MoveTowards(slider1.transform.position.x,centerLimit + .5,Time.deltaTime * 5);
			}
		}
		else if(whichSlider == 1 && Mathf.Abs(Finger.GetPosition(importantFinger).x-slider2.transform.position.x) < 9 && Finger.GetPosition(importantFinger).y > 0)
		{
			if(Finger.GetPosition(importantFinger).x >centerLimit - .2 && Finger.GetPosition(importantFinger).x < rightLimit && Mathf.Abs(slider1.transform.position.x-Finger.GetPosition(importantFinger).x) > 4.5)
			{
				slider2.transform.position.x = Finger.GetPosition(importantFinger).x;
			}
			else if(Finger.GetPosition(importantFinger).x >= rightLimit)
			{
				slider2.transform.position.x = Mathf.MoveTowards(slider2.transform.position.x,rightLimit,Time.deltaTime * 5);
			}
			else if(Finger.GetPosition(importantFinger).x <= centerLimit - .2)
			{
				slider2.transform.position.x = Mathf.MoveTowards(slider2.transform.position.x,centerLimit - .5,Time.deltaTime * 5);
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		whichSlider = 0;
		importantFinger = -1;
	}
	
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		finished = true;
		Finish(true);
	}
	for(i = 0; i < 3; i++)
	{
		if(rockets[i].transform.position.y > explodeHeighMinimum && rockets[i].transform.position.y < explodeHeightMaximum)
		{
			if(Mathf.Abs(rockets[i].transform.position.x-slider1.transform.position.x) < 2 && !finished)
			{
				AudioManager.PlaySound(explodeSound,.3);
				exploded[i] = true;
				finished = true;
				failBackMove = true;
				Finish(false);
			}
			if(Mathf.Abs(rockets[i].transform.position.x-slider2.transform.position.x) < 2 && !finished)
			{
				exploded[i] = true;
				finished = true;
				failBackMove = true;
				Finish(false);
			}
		}
	}
}

function Play () {
	var emissionAmount:float = 100;
	yield WaitForSeconds(1);
	if(difficulty == 1)
	{
		StartCoroutine(Launch(rockets[rocketOrder[0]],rocketOrder[0]));
		particles[rocketOrder[0]].emissionRate = emissionAmount;
		while(rockets[rocketOrder[0]].transform.position.y < explodeHeightMaximum)
		{yield;}
		if(!finished)
		{
			finished = true;
			Finish(true);
		}
		yield;
	}
	else if(difficulty == 2)
	{
		StartCoroutine(Launch(rockets[rocketOrder[0]],rocketOrder[0]));
		particles[rocketOrder[0]].emissionRate = emissionAmount;
		while(rockets[rocketOrder[0]].transform.position.y < launchHeight)
		{yield;}
		StartCoroutine(Launch(rockets[rocketOrder[1]],rocketOrder[1]));
		particles[rocketOrder[1]].emissionRate = emissionAmount;
		while(rockets[rocketOrder[1]].transform.position.y < explodeHeightMaximum)
		{yield;}
		if(!finished)
		{
			finished = true;
			Finish(true);
		}
		yield;
	}
	else
	{
		StartCoroutine(Launch(rockets[rocketOrder[0]],rocketOrder[0]));
		particles[rocketOrder[0]].emissionRate = emissionAmount;
		while(rockets[rocketOrder[0]].transform.position.y < launchHeight)
		{yield;}
		StartCoroutine(Launch(rockets[rocketOrder[1]],rocketOrder[1]));
		particles[rocketOrder[1]].emissionRate = emissionAmount;
		while(rockets[rocketOrder[1]].transform.position.y < launchHeight)
		{yield;}
		StartCoroutine(Launch(rockets[rocketOrder[2]],rocketOrder[2]));
		particles[rocketOrder[2	]].emissionRate = emissionAmount;
		while(rockets[rocketOrder[2]].transform.position.y < explodeHeightMaximum)
		{yield;}
		if(!finished)
		{
			finished = true;
			Finish(true);
		}
		yield;
		yield;
	}
	yield;
}

function Launch (rocket:GameObject, rocketNumber:int) {
	var rocketSpeed:float = .2;
	var origin:float = rocket.transform.position.x;
	AudioManager.PlaySound(launchSound);
	//Debug.Log(Time.time);
	while(rocket.transform.position.y < 30)
	{
		if(!exploded[rocketNumber])
		{
			rocket.transform.position.x = origin + (Random.Range(-.01,.01) * rocketSpeed);
			rocketSpeed += Time.deltaTime * (1 + (speed*1.5));
			rocket.transform.position.y += Time.deltaTime * rocketSpeed;
		}
		else
		{
			rocket.transform.position.x = origin + (Random.Range(-.03,.03) * rocketSpeed);
			rocketSpeed += Time.deltaTime * (1.9 + (speed*.9));
			particles[rocketNumber].startColor = Color.black;
			particles[rocketNumber].emissionRate = 200;
		}
		yield;
	}
	yield;
}

function Finish(completionStatus:boolean) {
	if(Application.loadedLevelName == "MicroTester")
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(completionStatus);
	}
	else 
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).GameComplete(completionStatus);
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", Color(1,1,1,1),SendMessageOptions.DontRequireReceiver);
	finished = true;
}

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", darknessAmount,SendMessageOptions.DontRequireReceiver);
	yield;
}