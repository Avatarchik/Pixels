#pragma strict

var speed:int;
var difficulty:int;
var finished:boolean;
var length:float;
var timer:float;

var monster:GameObject;
var aim:GameObject;
var aimAmount:GameObject;
var aimAmountComplete:float;
var pointer:GameObject[];
var pointerBottom:float;
var pointerTop:float;
var pointerAmount:float;

var currentLevel:float;
var goal:float;
var goalLeniency:float[];
var monsterTimer:float;
var monsterOrigin:float;
var monsterShake:float;

var peanutEmitter:GameObject;

var monsterSprites:Sprite[];
var aimSprites:Sprite[];

var warningSprites:Sprite[];
var warningHolder:int;
var warningRenderer:SpriteRenderer;
var warningCounter:float;

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
		speed = GameManager.speed;
		difficulty = GameManager.difficulty;
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
		if(Mathf.Abs(currentLevel - goal) > goalLeniency[difficulty-1])
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