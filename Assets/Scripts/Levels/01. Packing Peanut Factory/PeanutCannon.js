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

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;

@HideInInspector var playerLocation:int;
@HideInInspector var playerManager:PlayerManager;
@HideInInspector var target:int;
@HideInInspector var length:float;
@HideInInspector var timer:float;
@HideInInspector var finished:boolean;
@HideInInspector var previous:int;
@HideInInspector var importantFinger:int;

var peanutShot:AudioClip;

function Start () {
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
	
	length = 3 + 3/speed;
	if(difficulty == 3)
	{
		UITimer.currentTarget = length + .5;
		timer = length + .5;
	}
	else
	{
		UITimer.currentTarget = length;
		timer = length;
	}
	UITimer.counter = 0;
	PlayerManager.speed = .05;
	Play();
}

function Update () {
	player.transform.position.x = Mathf.Lerp(player.transform.position.x, target, Time.deltaTime * speed * 10);
	if(Mathf.Abs(player.transform.position.x - target) < .3)
	{
		playerManager.currentState = PlayerState.StandingBack;
	}
	else if(player.transform.position.x > target)
	{
		playerManager.currentState = PlayerState.WalkingBack;
		playerManager.transform.GetComponent(AnimationManager).flipped = -1;
	}
	else if(player.transform.position.x < target)
	{
		playerManager.currentState = PlayerState.WalkingBack;
		playerManager.transform.GetComponent(AnimationManager).flipped = 1;
	}
	else
	{
		playerManager.currentState = PlayerState.StandingBack;
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true);
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
	if(difficulty < 3)
	{
		yield WaitForSeconds(length * .1);
		Choice();
		yield WaitForSeconds(length * .3);
		Choice();
		yield WaitForSeconds(length * .3);
		Choice();
	}
	else
	{
		yield WaitForSeconds(length * .1);
		Choice();
		yield WaitForSeconds(length * .15);
		Choice();
		yield WaitForSeconds(length * .15);
		Choice();
		yield WaitForSeconds(length * .15);
		Choice();
		yield WaitForSeconds(length * .15);
		Choice();
		yield WaitForSeconds(length * .15);
		Choice();
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
	if(difficulty == 2)
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
	cannon1.SendMessage("ShakeSmall", length * .1, SendMessageOptions.DontRequireReceiver);
	cannon1.GetComponent(SpriteRenderer).sprite = cannonStep2;
	yield WaitForSeconds(length * .1);
	cannon1.SendMessage("ShakeMedium", length * .05, SendMessageOptions.DontRequireReceiver);
	cannon1.GetComponent(SpriteRenderer).sprite = cannonStep3;
	yield WaitForSeconds(length * .1);
	newNut1 = Instantiate(peanut,cannon1.transform.position - Vector3(0,1.8,0),Quaternion.identity);
	newNut1.transform.parent = transform;
	cannon1.GetComponent(SpriteRenderer).sprite = cannonStep1;
	AudioManager.PlaySound(peanutShot,.6,Random.Range(.5,.8));
	while(newNut1.transform.position.y > player.transform.position.y)
	{
		yield;
	}
	if(playerLocation == 1 && !finished)
	{
		finished = true;
		Finish(false);
	}
	
}

function fireCannon2() {
	var newNut2:GameObject;
	cannon2.SendMessage("ShakeSmall", length * .1, SendMessageOptions.DontRequireReceiver);
	cannon2.GetComponent(SpriteRenderer).sprite = cannonStep2;
	yield WaitForSeconds(length * .1);
	cannon2.SendMessage("ShakeMedium", length * .05, SendMessageOptions.DontRequireReceiver);
	cannon2.GetComponent(SpriteRenderer).sprite = cannonStep3;
	yield WaitForSeconds(length * .1);
	newNut2 = Instantiate(peanut,cannon2.transform.position - Vector3(0,1.8,0),Quaternion.identity);
	newNut2.transform.parent = transform;
	cannon2.GetComponent(SpriteRenderer).sprite = cannonStep1;
	AudioManager.PlaySound(peanutShot,.6,Random.Range(.5,.8));
	while(newNut2.transform.position.y > player.transform.position.y)
	{
		yield;
	}
	if(playerLocation == 2 && !finished)
	{
		finished = true;
		Finish(false);
	}
}

function fireCannon3() {
	var newNut3:GameObject;
	cannon3.SendMessage("ShakeSmall", length * .1, SendMessageOptions.DontRequireReceiver);
	cannon3.GetComponent(SpriteRenderer).sprite = cannonStep2;
	yield WaitForSeconds(length * .1);
	cannon3.SendMessage("ShakeMedium", length * .05, SendMessageOptions.DontRequireReceiver);
	cannon3.GetComponent(SpriteRenderer).sprite = cannonStep3;
	yield WaitForSeconds(length * .1);
	newNut3 = Instantiate(peanut,cannon3.transform.position - Vector3(0,1.8,0),Quaternion.identity);
	newNut3.transform.parent = transform;
	cannon3.GetComponent(SpriteRenderer).sprite = cannonStep1;
	AudioManager.PlaySound(peanutShot,.6,Random.Range(.5,.8));
	while(newNut3.transform.position.y > player.transform.position.y)
	{
		yield;
	}
	if(playerLocation == 3 && !finished)
	{
		finished = true;
		Finish(false);
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

function Finish(completionStatus:boolean) {
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
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).TurnOnNotification("Drag Peter out of the way of the peanut cannons!");
		PlayerPrefs.SetInt("TutorialFor:" + transform.name,-1);
	}
}