 #pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var leftLaneLocation:float;
@HideInInspector var centerLaneLocation:float;
@HideInInspector var rightLaneLocation:float;

@HideInInspector var leftLaneHeights:float[];
@HideInInspector var centerLaneHeights:float[];
@HideInInspector var rightLaneHeights:float[];
@HideInInspector var maxEnemies:float;

@HideInInspector var maxDistance:float;

var normalEnemy:GameObject;
var hardEnemy:GameObject;

var normalEnemySprites:Sprite[];
var hardEnemySprites:Sprite[];

var health:TextMesh;
var ammo:TextMesh;
var blocker:SpriteRenderer;
var deadColor:Color;

var front:GameObject;

@HideInInspector var healthLeft:int;
@HideInInspector var ammoLeft:float;

@HideInInspector var ammoChangeAmount:float;
@HideInInspector var healthChangeAmount:float;
@HideInInspector var enemySpeed:float;

@HideInInspector var leftEnemy:GameObject;
@HideInInspector var centerEnemy:GameObject;
@HideInInspector var rightEnemy:GameObject;

@HideInInspector var leftEnemyPosition:int;
@HideInInspector var centerEnemyPosition:int;
@HideInInspector var rightEnemyPosition:int;

@HideInInspector var pauseTime:float;
@HideInInspector var movementWaitTime:float;

@HideInInspector var clicked:boolean[];

var playerPrefab:GameObject;
var customMaterial:Material;
@HideInInspector var player:GameObject;

var location:SpriteRenderer;

var outOfAmmo:AudioClip;
var gunshot:AudioClip;

function Awake () {
	player = Instantiate(playerPrefab);
	player.transform.position = Vector3(.1827,-7.662,transform.position.z);
	player.transform.localScale = Vector3(1.2654,1.2654,1.2654);
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
	blocker.color.a = 0;
	
	// Level specific variable initialization.
	leftLaneLocation = -6;
	centerLaneLocation = 0;
	rightLaneLocation = 6;
	leftLaneHeights = new float[5];
	centerLaneHeights = new float[5];
	rightLaneHeights = new float[5];
	healthLeft = 100;
	ammoLeft = 100;
	maxDistance = 4;
	clicked = new boolean[5];
	clicked = [false,false,false,false,false];
	
	leftLaneHeights = [-.5,-.85,-1.25,-1.65,-2];
	centerLaneHeights = [2,1.0,0,-1,-2];
	rightLaneHeights = leftLaneHeights;
	
	leftEnemyPosition = 0;
	centerEnemyPosition = 0;
	rightEnemyPosition = 0;
	
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
	length = 2 + .1/speed;
	length = 10 + 2 * difficulty;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	
	pauseTime = 1.4;
	movementWaitTime = .3;
	maxEnemies = length / (pauseTime *1.2);
	var ammoMultiplier = .5 + .1 * difficulty;
	ammoChangeAmount = (100/maxEnemies) * ammoMultiplier;
	enemySpeed = .8 + .5 * speed;
	
	healthChangeAmount = 12 + 18 * difficulty;
	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
}

function Update () {
	location.color.a = Mathf.MoveTowards(location.color.a,0,Time.deltaTime * 2);
	if(leftEnemy == null && centerEnemy == null && rightEnemy == null && maxEnemies < 0)
	{
		Finish(true,.5);
	}
	ammo.text = Mathf.Floor(ammoLeft).ToString() + "%";
	health.text = healthLeft.ToString() + "%";
	
	if(healthLeft > 0)
	{
		blocker.color.a = Mathf.MoveTowards(blocker.color.a,0,Time.deltaTime * 10);
	}
	else
	{
		blocker.color = Color.Lerp(blocker.color,deadColor,Time.deltaTime * 2.5);
	}
	
	if(Input.GetKeyDown("left"))
	{
		AudioManager.PlaySound(gunshot,.7);
		if(leftEnemy != null)
		{
			Destroy(leftEnemy);
		}
		RemoveAmmo();
	}
	if(Input.GetKeyDown("up"))
	{
		AudioManager.PlaySound(gunshot,.5);
		if(centerEnemy != null)
		{
			Destroy(centerEnemy);
		}
		RemoveAmmo();
	}
	if(Input.GetKeyDown("right"))
	{
		AudioManager.PlaySound(gunshot,.3);
		if(rightEnemy != null)
		{
			Destroy(rightEnemy);
		}
		RemoveAmmo();
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true,0);
	}
	// Get important finger.
	for(var i:int = 0; i < Finger.identity.length; i++)
	{
		if(Finger.GetExists(i) && Finger.GetInGame(i) && !clicked[i] && ammoLeft <= 0)
		{
			AudioManager.PlaySound(outOfAmmo);
		}
		if(Finger.GetExists(i) && Finger.GetInGame(i) && !clicked[i] && ammoLeft > 0)
		{
			clicked[i] = true;
			RemoveAmmo();
			AudioManager.PlaySound(gunshot,.55,Random.Range(.95,1.05));
			location.transform.position.x = Finger.GetPosition(i).x;
			location.transform.position.y = Finger.GetPosition(i).y;
			if(leftEnemy != null && Vector2.Distance(Finger.GetPosition(i), leftEnemy.transform.position) < maxDistance)
			{
				Destroy(leftEnemy);
			}
			if(centerEnemy != null && Vector2.Distance(Finger.GetPosition(i), centerEnemy.transform.position) < maxDistance)
			{
				Destroy(centerEnemy);
			}
			if(rightEnemy != null && Vector2.Distance(Finger.GetPosition(i), rightEnemy.transform.position) < maxDistance)
			{
				Destroy(rightEnemy);
			}
			break;
		}
		else if(!Finger.GetExists(i) || !Finger.GetInGame(i))
		{
			clicked[i] = false;
		}
	}
}

function Play () {
	var lane0NotDone:boolean = true;
	var lane1NotDone:boolean = true;
	var lane2NotDone:boolean = true;
	while(lane0NotDone || lane1NotDone || lane2NotDone)
	{
		switch(Random.Range(0,3))
		{
			case 0:
				if(lane0NotDone)
				{
					lane0NotDone = false;
					Lane(0);
				}
				break;
			case 1:
				if(lane1NotDone)
				{
					lane1NotDone = false;
					Lane(1);
				}
				break;
			case 2:
				if(lane2NotDone)
				{
					lane2NotDone = false;
					Lane(2);
				}
				break;
			default:
				break;
		}
		yield WaitForSeconds(Random.Range(pauseTime*.4,pauseTime*1.6));
	}
}

function Lane (lane:int) {
	var counter:float;
	var sprites:Sprite[];
	var toCreate:GameObject;
	while(true)
	{
		switch(lane)
		{
			case 0:
				if(leftEnemy == null && maxEnemies > 0)
				{
					yield WaitForSeconds(Random.Range(pauseTime * .4, pauseTime * 1.6));
					if(difficulty == 3 && Random.Range(0,2) == 1)
					{
						toCreate = hardEnemy;
						sprites = hardEnemySprites;
					}
					else
					{
						toCreate = normalEnemy;
						sprites = normalEnemySprites;
					}
					leftEnemyPosition = 0;
					leftEnemy = Instantiate(toCreate,Vector3(leftLaneLocation,leftLaneHeights[0],transform.position.z + 1),Quaternion.identity);
					maxEnemies --;
					leftEnemy.transform.parent = transform;
					counter = 0;
				}
				else if(leftEnemy != null)
				{
					counter += Time.deltaTime * enemySpeed;
					if(toCreate == hardEnemy)
					{
						counter += Time.deltaTime * .5;
					}
					if(counter > movementWaitTime)
					{
						if(leftEnemyPosition < 4)
						{
							leftEnemyPosition ++;
							leftEnemy.transform.position.y = leftLaneHeights[leftEnemyPosition];
							leftEnemy.GetComponent(SpriteRenderer).sprite = sprites[leftEnemyPosition];
							counter = 0;
						}
						else
						{
							Destroy(leftEnemy);
							HurtPlayer();
						}
					}
				}
				break;
			case 1:
				if(centerEnemy == null && maxEnemies > 0)
				{
					yield WaitForSeconds(Random.Range(pauseTime * .4, pauseTime * 1.6));
					if(difficulty == 3 && Random.Range(0,2) == 1)
					{
						toCreate = hardEnemy;
						sprites = hardEnemySprites;
					}
					else
					{
						toCreate = normalEnemy;
						sprites = normalEnemySprites;
					}
					centerEnemyPosition = 0;
					centerEnemy = Instantiate(toCreate,Vector3(centerLaneLocation,centerLaneHeights[0],transform.position.z+1),Quaternion.identity);
					maxEnemies --;
					centerEnemy.transform.parent = transform;
					counter = 0;
				}
				else if(centerEnemy != null)
				{
					counter += Time.deltaTime * enemySpeed;
					if(toCreate == hardEnemy)
					{
						counter += Time.deltaTime * .5;
					}
					if(counter > movementWaitTime)
					{
						if(centerEnemyPosition < 4)
						{
							centerEnemyPosition ++;
							centerEnemy.transform.position.y = centerLaneHeights[centerEnemyPosition];
							centerEnemy.GetComponent(SpriteRenderer).sprite = sprites[centerEnemyPosition];
							counter = 0;
						}
						else
						{
							Destroy(centerEnemy);
							HurtPlayer();
						}
					}
				}
				break;
			case 2:
				if(rightEnemy == null && maxEnemies > 0)
				{
					yield WaitForSeconds(Random.Range(pauseTime * .4, pauseTime * 1.6));
					if(difficulty == 3 && Random.Range(0,2) == 1)
					{
						toCreate = hardEnemy;
						sprites = hardEnemySprites;
					}
					else
					{
						toCreate = normalEnemy;
						sprites = normalEnemySprites;
					}
					rightEnemyPosition = 0;
					rightEnemy = Instantiate(toCreate,Vector3(rightLaneLocation,rightLaneHeights[0],transform.position.z+1),Quaternion.identity);
					maxEnemies --;
					rightEnemy.transform.parent = transform;
					counter = 0;
				}
				else if(rightEnemy != null)
				{
					counter += Time.deltaTime * enemySpeed;
					if(toCreate == hardEnemy)
					{
						counter += Time.deltaTime * .5;
					}
					if(counter > movementWaitTime)
					{
						if(rightEnemyPosition < 4)
						{
							rightEnemyPosition ++;
							rightEnemy.transform.position.y = rightLaneHeights[rightEnemyPosition];
							rightEnemy.GetComponent(SpriteRenderer).sprite = sprites[rightEnemyPosition];
							counter = 0;
						}
						else
						{
							Destroy(rightEnemy);
							HurtPlayer();
						}
					}
				}
				break;
			default:
				break;
		}
		yield;
	}
}

function HurtPlayer () {
	healthLeft = Mathf.MoveTowards(healthLeft,0,healthChangeAmount);
	Shake(front,10);
	Shake(health.gameObject,10);
	Shake(ammo.gameObject,10);
	if(healthLeft == 0)
	{
		Finish(false,1);
	}
}

function RemoveAmmo () {
	if(!finished && healthLeft > 0 && ammoLeft > 0)
	{
		blocker.color.a = 1;
		ammoLeft = Mathf.MoveTowards(ammoLeft,0,ammoChangeAmount);
	}
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
	var difference:Vector2 = Vector2(.15,.15);
	var origin:Vector3 = object.transform.position;
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