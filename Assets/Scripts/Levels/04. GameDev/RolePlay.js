#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var normalMonsterSprites:Sprite[];
var dyingMonsterSprites:Sprite[];

var monster:SpriteRenderer;
var player:GameObject;

var defendButton:SpriteRenderer;
var fightButton:SpriteRenderer;
var healthBar:GameObject;

@HideInInspector var healthBarMin:float;
@HideInInspector var healthBarMax:float;
@HideInInspector var enemyAttacking:boolean;
@HideInInspector var enemyHealth:int;
@HideInInspector var playerCooldown:float;
@HideInInspector var waitTime:float;
@HideInInspector var playerDefending:boolean;
@HideInInspector var playerHealth:float;
@HideInInspector var clicked:boolean;

@HideInInspector var canDefend:boolean;
@HideInInspector var canFight:boolean;

@HideInInspector var enemyDead:boolean;

@HideInInspector var cooldownTime:float;

@HideInInspector var playerHealthChange:float;

var fightOn:Sprite;
var fightOff:Sprite;
var defendOn:Sprite;
var defendOff:Sprite;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	healthBarMin = 0;
	healthBarMax = 13.6;
	playerDefending = false;
	playerHealth = 100;
	clicked = false;
	canDefend = false;
	canFight = true;
	enemyDead = false;
	
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
	for(var i:int = 0; i<speed; i++)
	{
		waitTime -= .1;
	}
	
	//IMPORTANT THINGS
	playerHealthChange = 25;
	cooldownTime = .3;
	playerCooldown = cooldownTime;
	waitTime = 1;
	enemyHealth = 5;
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	EnemyMovement();
	EnemyAttacks();
	Play();
}

function Update () {
	healthBar.transform.localScale.x = Mathf.Lerp(healthBarMin,healthBarMax,playerHealth/100);
	playerCooldown -= Time.deltaTime;
	timer -= Time.deltaTime;
	
	if(playerCooldown < 0)
	{
		fightButton.sprite = fightOn;
		canFight = true;
	}
	else
	{
		fightButton.sprite = fightOff;
		canFight = false;
	}
	
	if(enemyAttacking)
	{
		canDefend = true;
		defendButton.sprite = defendOn;
	}
	else
	{
		defendButton.sprite = defendOff;
		canDefend = false;
	}
	
	if(timer < 0 && !finished)
	{
		Finish(true,0);
	}
	
	if(Input.GetKeyDown("left") && playerCooldown < 0)
	{
		playerCooldown = cooldownTime;
		Defend();
	}
	if(Input.GetKeyDown("right") && playerCooldown < 0)
	{
		playerCooldown = cooldownTime;
		Fight();
	}
	// Get important finger.
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i) && Finger.GetInGame(i) && playerCooldown < 0 && !clicked)
			{
				playerCooldown = cooldownTime;
				clicked = true;
				if(Finger.GetPosition(i).x < 0)
				{
					Defend();
				}
				else 
				{
					Fight();
				}
				importantFinger = i;
				break;
			}
		}
	}
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		clicked = false;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
}

function Play () {

}

function EnemyAttacks () {
	while(!finished)
	{
		yield WaitForSeconds(Random.Range(waitTime-.2,waitTime+.2));
		enemyAttacking = true;
		var counter:float = 0;
		while(counter < waitTime/2)
		{
			counter += Time.deltaTime;
			yield;
		}
		if(!playerDefending)
		{
			playerHealth -= playerHealthChange;
		}
		enemyAttacking = false;
	yield;
	}
}

function Defend () {
		playerDefending = true;
		yield WaitForSeconds(cooldownTime*2);
		playerDefending = false;
}

function EnemyMovement () {
	var placeHolder:int = 0;
	while(true)
	{
		if(!enemyDead && !enemyAttacking)
		{
			monster.sprite = normalMonsterSprites[placeHolder];
			yield WaitForSeconds(.2);
			placeHolder ++;
			if(placeHolder >= normalMonsterSprites.Length)
			{
				placeHolder = 0;
			}
		}
		else if(!enemyDead && enemyAttacking)
		{
		
		}
		else if(enemyDead)
		{
		
		}
		yield;
	}
}

function Fight () {
	player.transform.position.x -= 1;
	enemyHealth --;
	Shake(monster.gameObject,20);
	yield WaitForSeconds(cooldownTime * .8);
	player.transform.position.x += 1;
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

function Shake (object:GameObject, times:int) {
	var origin:Vector3 = object.transform.position;
	var counter:int = 0;
	var difference:Vector2 = Vector2(.25,.25);
	while(counter < times)
	{
		object.transform.position.x = origin.x + difference.x;
		object.transform.position.y = origin.y + difference.y;
		difference.x = difference.x * -1;
		if(Random.Range(0,2) == 0)
		{
			difference.y = difference.y * -1;
		}
		counter ++;
		yield WaitForSeconds(.03);
	}
	object.transform.position = origin;
}