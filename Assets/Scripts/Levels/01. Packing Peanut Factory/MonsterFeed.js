#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var monster:GameObject;
var aim:GameObject;
var aimAmount:GameObject;
@HideInInspector var aimAmountComplete:float;
var pointer:GameObject[];
@HideInInspector var pointerBottom:float;
@HideInInspector var pointerTop:float;
@HideInInspector var pointerAmount:float;

@HideInInspector var currentLevel:float;
@HideInInspector var goal:float;
@HideInInspector var goalLeniency:float[];
@HideInInspector var monsterTimer:float;
@HideInInspector var monsterOrigin:float;
@HideInInspector var monsterShake:float;

var peanutEmitter:GameObject;

var monsterSprites:Sprite[];
var aimSprites:Sprite[];

var warningSprites:Sprite[];
@HideInInspector var warningHolder:int;
var warningRenderer:SpriteRenderer;
@HideInInspector var warningCounter:float;

@HideInInspector var importantFinger:int;
@HideInInspector var clicked:boolean;

var peanutPoop:AudioClip;

function Start () {
	warningHolder = 0;
	warningCounter = .2;
	if(Application.loadedLevelName == "MicroTester")
	{
		speed = MicroTester.timeMultiplier;
		difficulty = MicroTester.difficulty;
	}
	else
	{
		speed = GameManager.bossDifficulty;
		difficulty = GameManager.bossDifficulty;
	}
	
	if(difficulty < 4)
	{
		aim.GetComponent(SpriteRenderer).sprite = aimSprites[difficulty-1];
	}
	else
	{
		aim.GetComponent(SpriteRenderer).sprite = aimSprites[2];
	}	
	aimAmountComplete = aimAmount.transform.localScale.y;
	goal = 68.5;
	goalLeniency = [27,15.5,8.5];
	pointerBottom = -7.5;
	pointerTop = 4.4;
	pointerAmount = pointerTop - pointerBottom;
	monsterTimer = 1.5;
	monsterOrigin = monster.transform.position.y;
	monsterShake = .1;
	
	for(var point:GameObject in pointer)
	{
		point.transform.position.y = pointerBottom;
	}
	currentLevel = goal;
	length = 5 - speed/3;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	timer = length;
	for(var point:GameObject in pointer)
	{
		point.transform.position.y = pointerBottom + (pointerAmount/100) * currentLevel;
	}
	
	StartCoroutine(MonsterShake());
	StartCoroutine(Play());
}

function Update () {
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
	if(Finger.GetExists(importantFinger) && Finger.GetInGame(importantFinger) && !Master.paused && !clicked)
	{
		Clicked();
		clicked = true;
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	if(Input.GetKeyDown("space"))
	{
		Clicked();
	}
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true);
	}
}

function Play () {
	yield WaitForSeconds(.4);
	while(true)
	{
		currentLevel -= Time.deltaTime * (20 + 5 * (speed-1));
		for(var point:GameObject in pointer)
		{
			point.transform.position.y = pointerBottom + (pointerAmount/100) * currentLevel;
		}
		if(Mathf.Abs(currentLevel - goal) > goalLeniency[Mathf.Min(difficulty-1,goalLeniency.Length-1)])
		{
			monsterTimer -= Time.deltaTime;
			Warning();
		}
		else
		{
			warningRenderer.sprite = warningSprites[0];
			warningHolder = 0;
			warningCounter = 0;
		}
		if(monsterTimer < 1 && monsterTimer > .5)
		{
			monsterShake = .1;
			monster.GetComponent(SpriteRenderer).sprite = monsterSprites[1];
		}
		else if(monsterTimer < .5 && monsterTimer > 0)
		{
			monsterShake = .3;
			monster.GetComponent(SpriteRenderer).sprite = monsterSprites[2];
		}
		else if(monsterTimer < 0 && !finished)
		{
			Finish(false);
		}
		aimAmount.transform.localScale.y = currentLevel * .01 * aimAmountComplete - .01;
		yield;
	}
	yield;
}

function Warning() {
	if(warningCounter <= 0)
	{
		warningHolder ++;
		if(warningHolder >= warningSprites.Length)
		{
			warningHolder = 1;
		}
		warningRenderer.sprite = warningSprites[warningHolder];
		warningCounter = .2;
	}
	warningCounter -= Time.deltaTime;
}

function Clicked() {
	AudioManager.PlaySound(peanutPoop,.1,Random.Range(.7,1.1));
	peanutEmitter.GetComponent.<ParticleSystem>().Emit(1);
	var particleList:ParticleSystem.Particle[] = new ParticleSystem.Particle[peanutEmitter.GetComponent.<ParticleSystem>().particleCount];
	peanutEmitter.GetComponent.<ParticleSystem>().GetParticles(particleList);
	particleList[particleList.Length-1].rotation = Random.Range(0,4) * 90;
	peanutEmitter.GetComponent.<ParticleSystem>().SetParticles(particleList,peanutEmitter.GetComponent.<ParticleSystem>().particleCount);
	currentLevel += 5;
}

function MonsterShake() { 
	while(true)
	{
		yield WaitForSeconds(.1);
		monster.transform.position.y = Random.Range(monsterOrigin-monsterShake,monsterOrigin+monsterShake);
		yield;
	}
	yield;
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
	if(ObscuredPrefs.HasKey("TutorialFor:" + transform.name))
	{
		ObscuredPrefs.SetInt("TutorialFor:" + transform.name,ObscuredPrefs.GetInt("TutorialFor:" + transform.name) + 1);
	}
	else
	{
		ObscuredPrefs.SetInt("TutorialFor:" + transform.name,1);
	}
	if((ObscuredPrefs.GetInt("TutorialFor:" + transform.name) > 1) && Application.loadedLevelName == "MicroGameLauncher" && ObscuredPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"BeatEndPlayed") == 0 && !Master.hardMode)
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).TurnOnNotification("Keep the arrow in the green zone by tapping!");
		ObscuredPrefs.SetInt("TutorialFor:" + transform.name,-1);
	}
}