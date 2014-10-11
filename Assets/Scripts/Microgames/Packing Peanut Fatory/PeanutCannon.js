#pragma strict

var cannon1:GameObject;
var cannon2:GameObject;
var cannon3:GameObject;
var playerPrefab:GameObject;
var player:GameObject;
var peanut:GameObject;

var cannonStep1:Sprite;
var cannonStep2:Sprite;
var cannonStep3:Sprite;

var speed:int;
var difficulty:int;

var playerLocation:int;
var target:int;
var length:float;
var timer:float;
var finished:boolean;
var previous:int;

function Start () {
	player = Instantiate(playerPrefab, Vector3(0,-6.5,0), Quaternion.identity);
	player.transform.localScale = Vector3(3,3,3);
	player.transform.parent = transform;
	player.transform.localPosition.z = -.1;
	GetComponent(ScreenTouchManager).relativeObject = player;
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
		speed = GameManager.timeMultiplier;
		difficulty = GameManager.difficulty;
	}
	
	length = 3 + 5/speed;
	timer = length;
	PlayerManager.speed = .05;
	Play();
}

function Update () {
	player.transform.position.x = Mathf.Lerp(player.transform.position.x, target, Time.deltaTime * speed * 10);
	if(Mathf.Abs(player.transform.position.x - target) < .3)
	{
		PlayerManager.currentState = PlayerState.StandingBack;
	}
	else if(player.transform.position.x > target)
	{
		PlayerManager.currentState = PlayerState.WalkingLeft;
	}
	else if(player.transform.position.x < target)
	{
		PlayerManager.currentState = PlayerState.WalkingRight;
	}
	else
	{
		PlayerManager.currentState = PlayerState.StandingBack;
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true);
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
	var newNut:GameObject;
	cannon1.SendMessage("ShakeSmall", length * .1, SendMessageOptions.DontRequireReceiver);
	cannon1.GetComponent(SpriteRenderer).sprite = cannonStep2;
	yield WaitForSeconds(length * .1);
	cannon1.SendMessage("ShakeMedium", length * .05, SendMessageOptions.DontRequireReceiver);
	cannon1.GetComponent(SpriteRenderer).sprite = cannonStep3;
	yield WaitForSeconds(length * .1);
	newNut = Instantiate(peanut,cannon1.transform.position - Vector3(0,1.8,0),Quaternion.identity);
	newNut.transform.parent = transform.parent;
	cannon1.GetComponent(SpriteRenderer).sprite = cannonStep1;
	yield WaitForSeconds(.05);
	if(playerLocation == 1)
	{
		Finish(false);
	}
	
}

function fireCannon2() {
	var newNut:GameObject;
	cannon2.SendMessage("ShakeSmall", length * .1, SendMessageOptions.DontRequireReceiver);
	cannon2.GetComponent(SpriteRenderer).sprite = cannonStep2;
	yield WaitForSeconds(length * .1);
	cannon2.SendMessage("ShakeMedium", length * .05, SendMessageOptions.DontRequireReceiver);
	cannon2.GetComponent(SpriteRenderer).sprite = cannonStep3;
	yield WaitForSeconds(length * .1);
	newNut = Instantiate(peanut,cannon2.transform.position - Vector3(0,1.8,0),Quaternion.identity);
	newNut.transform.parent = transform.parent;
	cannon2.GetComponent(SpriteRenderer).sprite = cannonStep1;
	yield WaitForSeconds(.05);
	if(playerLocation == 2 && !finished)
	{
		Finish(false);
	}
}

function fireCannon3() {
	var newNut:GameObject;
	cannon3.SendMessage("ShakeSmall", length * .1, SendMessageOptions.DontRequireReceiver);
	cannon3.GetComponent(SpriteRenderer).sprite = cannonStep2;
	yield WaitForSeconds(length * .1);
	cannon3.SendMessage("ShakeMedium", length * .05, SendMessageOptions.DontRequireReceiver);
	cannon3.GetComponent(SpriteRenderer).sprite = cannonStep3;
	yield WaitForSeconds(length * .1);
	newNut = Instantiate(peanut,cannon3.transform.position - Vector3(0,1.8,0),Quaternion.identity);
	newNut.transform.parent = transform.parent;
	cannon3.GetComponent(SpriteRenderer).sprite = cannonStep1;
	yield WaitForSeconds(.05);
	if(playerLocation == 3 && !finished)
	{
		Finish(false);
	}
}

function Left () {
	if(playerLocation > 1)
	{
		playerLocation --;
	}
	SetDestination();
}

function Right () {
	if(playerLocation < 3)
	{
		playerLocation ++;
	}
	SetDestination();
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

function Finish(completionStatus) {
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