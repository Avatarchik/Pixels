#pragma strict

var cannon1:GameObject;
var cannon2:GameObject;
var cannon3:GameObject;
var playerPrefab:GameObject;
@HideInInspector var player:GameObject;
var peanut:GameObject;

var cannonStep1:Sprite;
var cannonStep2:Sprite;
var cannonStep3:Sprite;

@HideInInspector var playerLocation:int;
@HideInInspector var playerManager:PlayerManager;
@HideInInspector var target:int;
@HideInInspector var timer:float;
@HideInInspector var finished:boolean;
@HideInInspector var previous:int;
@HideInInspector var importantFinger:int;

var score:float;

@HideInInspector var waitTime:float;

var peanutShot:AudioClip;

function Start () {
	cannon1.transform.position.x = -5.4231;
	cannon2.transform.position.x = 0;
	cannon3.transform.position.x = 5.4231;
	Debug.Log(cannon1.transform.position.x);
	importantFinger = -1;
	player = Instantiate(playerPrefab, Vector3(0,-6.5,0), Quaternion.identity);
	player.transform.localScale = Vector3(1.5,1.5,1.5);
	player.transform.parent = transform;
	player.transform.localPosition.z = -.1;
	playerManager = player.GetComponent(PlayerManager);
	finished = false;
	playerLocation = 2;
	target = 0;
	previous = -1;
	score = 0;
	waitTime = 2;
	
	PlayerManager.speed = .05;
	Play();
}

function Update () {
	if(finished)
	{
		player.transform.position.y -= Time.deltaTime * 40;
	}
	else
	{
		score += Time.deltaTime;
		ArcadeTimer.currentTime = score;
	}
	player.transform.position.x = Mathf.Lerp(player.transform.position.x, target, Time.deltaTime * 10);
	if(Mathf.Abs(player.transform.position.x - target) < .3)
	{
		playerManager.currentState = PlayerState.StandingBack;
	}
	else if(player.transform.position.x > target)
	{
		playerManager.currentState = PlayerState.WalkingBack;
		player.transform.GetComponent(AnimationManager).flipped = -1;
	}
	else if(player.transform.position.x < target)
	{
		playerManager.currentState = PlayerState.WalkingBack;
		player.transform.GetComponent(AnimationManager).flipped = 1;
	}
	else
	{
		playerManager.currentState = PlayerState.StandingBack;
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
	}
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		
		if(Finger.GetPosition(importantFinger).x > 3 && Finger.GetPosition(importantFinger).x < 9)
		{
			playerLocation = 3;
		}
		else if(Finger.GetPosition(importantFinger).x < -3 && Finger.GetPosition(importantFinger).x > -9)
		{
			playerLocation = 1;
		}
		else if(Finger.GetPosition(importantFinger).x > -3 && Finger.GetPosition(importantFinger).x < 3)
		{
			playerLocation = 2;
		}
		SetDestination();
	}
	else if(!Finger.GetExists(importantFinger))
	{

		importantFinger = -1;
	}
}

function Play() {
	while(true)
	{
		Choice();
		yield WaitForSeconds(waitTime);
		if(waitTime > .65)
		{
			waitTime *= .965;
		}
		else
		{
			waitTime *= .985;
		}
	}
}

function Choice() {
	var randomStop:int = 0;
	var choice:int;
	choice = Random.Range(1,4);
	while(choice == previous && randomStop < 10)
	{
		choice = Random.Range(1,4);
	}
	previous = choice;
	switch(choice) {
		case 1:
			fireCannon1();
			break;
		case 2:
			fireCannon2();
			break;
		case 3:
			fireCannon3();
			break;
		default:
			break;
	}
	if(Random.value > .7)
	{
		var other:int = choice;
		randomStop = 0;
		while(choice == other && randomStop < 10)
		{
			 choice = Random.Range(1,4);
			 randomStop++;
		}
			switch(choice) {
				case 1:
					fireCannon1();
					break;
				case 2:
					fireCannon2();
					break;
				case 3:
					fireCannon3();
					break;
				default:
					break;
			}
	}
}

function fireCannon1() {
	var newNut1:GameObject;
	cannon1.SendMessage("ShakeSmall", waitTime * .4, SendMessageOptions.DontRequireReceiver);
	cannon1.GetComponent(SpriteRenderer).sprite = cannonStep2;
	yield WaitForSeconds(waitTime * .4);
	cannon1.SendMessage("ShakeMedium", waitTime * .2, SendMessageOptions.DontRequireReceiver);
	cannon1.GetComponent(SpriteRenderer).sprite = cannonStep3;
	yield WaitForSeconds(waitTime * .25);
	newNut1 = Instantiate(peanut,cannon1.transform.position - Vector3(0,1.8,0),Quaternion.identity);
	newNut1.transform.parent = transform;
	cannon1.GetComponent(SpriteRenderer).sprite = cannonStep1;
	AudioManager.PlaySound(peanutShot,.9,Random.Range(.5,.8));
	while(newNut1.transform.position.y > player.transform.position.y)
	{
		yield;
	}
	if(playerLocation == 1 && !finished)
	{
		finished = true;
		Finish();
	}
	
}

function fireCannon2() {
	var newNut2:GameObject;
	cannon2.SendMessage("ShakeSmall", waitTime * .4, SendMessageOptions.DontRequireReceiver);
	cannon2.GetComponent(SpriteRenderer).sprite = cannonStep2;
	yield WaitForSeconds(waitTime * .4);
	cannon2.SendMessage("ShakeMedium", waitTime * .2, SendMessageOptions.DontRequireReceiver);
	cannon2.GetComponent(SpriteRenderer).sprite = cannonStep3;
	yield WaitForSeconds(waitTime * .25);
	newNut2 = Instantiate(peanut,cannon2.transform.position - Vector3(0,1.8,0),Quaternion.identity);
	newNut2.transform.parent = transform;
	cannon2.GetComponent(SpriteRenderer).sprite = cannonStep1;
	AudioManager.PlaySound(peanutShot,.9,Random.Range(.5,.8));
	while(newNut2.transform.position.y > player.transform.position.y)
	{
		yield;
	}
	if(playerLocation == 2 && !finished)
	{
		finished = true;
		Finish();
	}
}

function fireCannon3() {
	var newNut3:GameObject;
	cannon3.SendMessage("ShakeSmall", waitTime * .4, SendMessageOptions.DontRequireReceiver);
	cannon3.GetComponent(SpriteRenderer).sprite = cannonStep2;
	yield WaitForSeconds(waitTime * .4);
	cannon3.SendMessage("ShakeMedium", waitTime * .2, SendMessageOptions.DontRequireReceiver);
	cannon3.GetComponent(SpriteRenderer).sprite = cannonStep3;
	yield WaitForSeconds(waitTime * .25);
	newNut3 = Instantiate(peanut,cannon3.transform.position - Vector3(0,1.8,0),Quaternion.identity);
	newNut3.transform.parent = transform;
	cannon3.GetComponent(SpriteRenderer).sprite = cannonStep1;
	AudioManager.PlaySound(peanutShot,.9,Random.Range(.5,.8));
	while(newNut3.transform.position.y > player.transform.position.y)
	{
		yield;
	}
	if(playerLocation == 3 && !finished)
	{
		finished = true;
		Finish();
	}
}

function SetDestination () {
	switch (playerLocation)
	{
		case 1:
			target = -5.5;
			break;
		case 2:
			target = 0;
			break;
		case 3:
			target = 5.5;
			break;
		default:
			break;
	}
}

function Finish() {
	finished = true;
	yield WaitForSeconds(.3);
	GameObject.FindGameObjectWithTag("ArcadeManager").GetComponent(ArcadeManager).FinishGame(score);
}