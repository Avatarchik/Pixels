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
var attackingMonsterSprite:Sprite;

var monster:SpriteRenderer;
@HideInInspector var player:GameObject;

var defendButton:SpriteRenderer;
var fightButton:SpriteRenderer;
var healthBar:GameObject;

var enemyHP:TextMesh;
var attacking:TextMesh;

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

var origin:Vector3;

@HideInInspector var monsterPosition:int;

var playerPrefab:GameObject;
var customMaterial:Material;

var swordSound:AudioClip;
var killSound:AudioClip;

function Awake () {
	player = Instantiate(playerPrefab);
	player.transform.position = Vector3(4.8928,-1.476,transform.position.z+5);
	player.transform.localScale = Vector3(1.2654,1.2654,1.2654);
	player.GetComponent(AnimationManager).flipped = -1;
	player.transform.parent = transform;
	player.AddComponent(ChangeHue);
	player.GetComponent(ChangeHue).hueMaterial = customMaterial;
	player.GetComponent(ChangeHue).hue = .6;
	player.GetComponent(ChangeHue).saturation = .9;
	player.GetComponent(ChangeHue).doToChildren = true;
	player.GetComponent(ChangeHue).Instant();
}

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	origin = monster.transform.position;
	healthBarMin = 0;
	healthBarMax = 13.6;
	playerDefending = false;
	playerHealth = 100;
	clicked = false;
	canDefend = false;
	canFight = true;
	enemyDead = false;
	monsterPosition = 1;
	
	// Speed and difficulty information.
	if(Application.loadedLevelName == "MicroTester")
	{
		speed = MicroTester.timeMultiplier;
		difficulty = MicroTester.difficulty;
	}
	else
	{
		speed = GameManager.bossDifficulty + 2;
		difficulty = GameManager.bossDifficulty;
	}
	length = 3 + 5/speed;
	length = 20;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	for(var i:int = 0; i<speed; i++)
	{
		waitTime -= .1;
	}
	
	//IMPORTANT THINGS
	playerHealthChange = 10 + 15 * difficulty;
	cooldownTime = .5;
	playerCooldown = cooldownTime;
	waitTime = 1.5;
	enemyHealth = 10;
	
	for(i = 0; i < speed; i++)
	{
		waitTime = Mathf.MoveTowards(waitTime,.8,.2);
		cooldownTime = Mathf.MoveTowards(cooldownTime,.3,.05);
	}
	
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
	enemyHP.text = "HP: " + enemyHealth.ToString();
	healthBar.transform.localScale.x = Mathf.Lerp(healthBarMin,healthBarMax,playerHealth/100);
	playerCooldown -= Time.deltaTime;
	timer -= Time.deltaTime;
	
	if(enemyHealth <= 0)
	{
		enemyDead = true;
		Finish(true,2);
	}
	if(playerHealth <= 0)
	{
		Finish(false,1);
		player.transform.position.x += Time.deltaTime * 5;
		player.transform.position.y -= Time.deltaTime * 5;
		monster.transform.position.x += Time.deltaTime * 2;
	}
	if(playerCooldown < 0)
	{
		fightButton.sprite = fightOn;
		fightButton.color.a = 1;
		canFight = true;
	}
	else
	{
		fightButton.sprite = fightOff;
		fightButton.color.a = 0;
		canFight = false;
	}
	
	if(enemyAttacking)
	{
		attacking.transform.position.x = 1.8;
		defendButton.color.a = 1;
		canDefend = true;
		defendButton.sprite = defendOn;
	}
	else
	{
		attacking.transform.position.x = 1000;
		defendButton.sprite = defendOff;
		defendButton.color.a = 0;
		canDefend = false;
	}
	
	if(timer < 0 && !finished)
	{
		Finish(true,0);
	}
	
	if(Input.GetKeyDown("left") && playerCooldown < 0 && canDefend)
	{
		playerCooldown = cooldownTime;
		Defend();
	}
	if(Input.GetKeyDown("right") && playerCooldown < 0 && canFight)
	{
		playerCooldown = cooldownTime;
		Fight();
	}
	// Get important finger.
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i) && Finger.GetInGame(i) && playerCooldown < 0 && !clicked && !finished)
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
	if(!Finger.GetExists(importantFinger))
	{
		clicked = false;
		importantFinger = -1;
	}
}

function Play () {

}

function EnemyAttacks () {
	while(!finished)
	{
		monster.transform.position.x = -3.37;
		yield WaitForSeconds(Random.Range(waitTime-.2,waitTime+.2));
		enemyAttacking = true;
		var counter:float = 0;
		while(counter < waitTime/2 && !finished)
		{
			counter += Time.deltaTime;
			yield;
		}
		if(!playerDefending && !finished)
		{
			playerHealth -= playerHealthChange;
		}
		if(!finished)
		{
			monster.transform.position.x += 3;
		}
		enemyAttacking = false;
		yield WaitForSeconds(.3);
		monster.transform.position.x = -3.37;
	yield;
	}
}

function Defend () {
		playerDefending = true;
		player.transform.position.x += 2;
		player.transform.position.y -= 2;
		yield WaitForSeconds(cooldownTime*1.1);
		player.transform.position.x -= 2;
		player.transform.position.y += 2;
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
			monster.sprite = attackingMonsterSprite;
		}
		else if(enemyDead)
		{
			AudioManager.PlaySound(killSound);
			Shake(monster.gameObject,300);
			monster.sprite = dyingMonsterSprites[0];
			yield WaitForSeconds(.5);
			monster.sprite = dyingMonsterSprites[1];
			yield WaitForSeconds(.5);
			monster.sprite = dyingMonsterSprites[2];
			yield WaitForSeconds(.5);
			monster.sprite = dyingMonsterSprites[3];
			yield WaitForSeconds(.5);
			monster.sprite = dyingMonsterSprites[4];
			yield WaitForSeconds(10);
		}
		yield;
	}
}

function Fight () {
	AudioManager.PlaySound(swordSound,.7,Random.Range(.8,1.2));
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
		yield WaitForSeconds(waitTime);
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
	var counter:int = 0;
	var difference:Vector2 = Vector2(.25,.25);
	while(counter < times && !enemyAttacking)
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
	if(!enemyAttacking)
	{
		object.transform.position = origin;
	}
}