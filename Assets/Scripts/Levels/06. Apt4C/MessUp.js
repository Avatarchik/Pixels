#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

@HideInInspector var clicked:boolean[];

var projectorSwitch:SpriteRenderer;
var magicButtons:SpriteRenderer[];
var smokeSlider:SpriteRenderer;

var projectorSwitchSprites:Sprite[];
var magicButtonsSprites:Sprite[];
var smokeSliderSprites:Sprite[];

@HideInInspector var sliderLimitLeft:float;
@HideInInspector var sliderLimitRight:float;
@HideInInspector var sliderGoodLeft:float;
@HideInInspector var sliderGoodRight:float;

@HideInInspector var projectorGood:boolean;
@HideInInspector var magicGood:boolean[];
@HideInInspector var smokeGood:boolean;

@HideInInspector var smokeGoal:float;

@HideInInspector var waitTime:float;

@HideInInspector var touchDistance:float;
var smokeEmitter:ParticleSystem;
var messUpBack:SpriteRenderer;

@HideInInspector var failNumber:float;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	clicked = new boolean[5];
	clicked = [false,false,false,false,false];
	
	// Level specific variable initialization.
	sliderLimitLeft = 2.13;
	sliderLimitRight = 7.32;
	sliderGoodLeft = 5.09;
	sliderGoodRight = 6.2;
	smokeGoal = .4;
	touchDistance = 1.5;
	projectorGood = true;
	magicGood = new boolean[3];
	for(var i:int = 0; i < magicGood.length; i++)
	{
		magicGood[i] = true;
	}
	failNumber = 30;
	smokeGood = true;
	
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
	length = 10 + 2 * difficulty;
	waitTime = Mathf.Max(2,4 - (speed * .19));
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
	MagicButtons();
	ProjectorSwitch();
	Smoke();
}

function Update () {
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(true,0);
	}
	// Get important finger.
	for(var i:int = 0; i < Finger.identity.length; i++)
	{
		if(!Master.paused && Finger.GetExists(i) && Finger.GetInGame(i) && !clicked[i] && !finished)
		{
			clicked[i] = true;
			Debug.Log(Vector3.Distance(Finger.GetPosition(i),magicButtons[0].transform.position));
			if(Vector2.Distance(Finger.GetPosition(i),magicButtons[0].transform.position) < touchDistance)
			{
				magicGood[0] = !magicGood[0];
			}
			if(Vector2.Distance(Finger.GetPosition(i),magicButtons[1].transform.position) < touchDistance)
			{
				magicGood[1] = !magicGood[1];
			}
			if(Vector2.Distance(Finger.GetPosition(i),magicButtons[2].transform.position) < touchDistance)
			{
				magicGood[2] = !magicGood[2];
			}
			if(Vector2.Distance(Finger.GetPosition(i),projectorSwitch.transform.position) < touchDistance)
			{
				projectorGood = !projectorGood;
			}
			if(Vector2.Distance(Finger.GetPosition(i),smokeSlider.transform.position) < touchDistance)
			{
				smokeSlider.transform.position.x = Mathf.Clamp(Finger.GetPosition(i).x,sliderLimitLeft,sliderLimitRight);
				smokeGoal = smokeSlider.transform.position.x;
				clicked[i] = false;
			}
			
		}
		else if(!Finger.GetExists(i) || !Finger.GetInGame(i))
		{
			clicked[i] = false;
		}
	}
	if(smokeSlider.transform.position.x >= sliderGoodLeft && smokeSlider.transform.position.x <= sliderGoodRight)
	{
		smokeGood = true;
		smokeEmitter.emissionRate = 0;
	}
	else
	{
		failNumber -= Time.deltaTime * 1.3;
		smokeGood = false;
		smokeEmitter.emissionRate = 50 - failNumber;
	}
	
	if(smokeGood)
	{
		smokeSlider.sprite= smokeSliderSprites[0];
	}
	else
	{
		failNumber -= Time.deltaTime * 1.3;
		smokeSlider.sprite= smokeSliderSprites[1];
	}
	var messBack:float = 0;
	if(magicGood[0])
	{
		magicButtons[0].sprite = magicButtonsSprites[0];
	}
	else
	{
		failNumber -= Time.deltaTime * .7;
		messBack += .33;
		magicButtons[0].sprite = magicButtonsSprites[1];
	}
	if(magicGood[1])
	{
		magicButtons[1].sprite = magicButtonsSprites[0];
	}
	else
	{
		failNumber -= Time.deltaTime * .7;
		messBack += .33;
		magicButtons[1].sprite = magicButtonsSprites[1];
	}
	if(magicGood[2])
	{
		magicButtons[2].sprite = magicButtonsSprites[0];
	}
	else
	{
		failNumber -= Time.deltaTime * .7;
		messBack += .33;
		magicButtons[2].sprite = magicButtonsSprites[1];
	}
	messUpBack.color.a = Mathf.MoveTowards(messUpBack.color.a,messBack,Time.deltaTime * .5);
	if(projectorGood)
	{
		projectorSwitch.sprite = projectorSwitchSprites[0];
	}
	else
	{
		projectorSwitch.sprite = projectorSwitchSprites[1];
	}
	Debug.Log(failNumber);
	if(failNumber < 0 && !finished)
	{
		Finish(false,0);
	}
}

function MagicButtons () {
	yield WaitForSeconds(Random.Range(waitTime * .7, waitTime * 1.3));
	while(true && !finished)
	{
		var amount:float = Random.value;
		if(amount < .35)
		{
			magicGood[Random.Range(0,magicGood.length)] = false;
		}
		else if(amount < .7)
		{
			magicGood[Random.Range(0,magicGood.length)] = false;
			magicGood[Random.Range(0,magicGood.length)] = false;
		}
		else
		{
			magicGood[0] = false;
			magicGood[1] = false;
			magicGood[2] = false;
		}
		yield;
		yield WaitForSeconds(Random.Range(waitTime * .7, waitTime * 1.3));
	}
}	

function ProjectorSwitch () {
	yield WaitForSeconds(Random.Range(waitTime * .7, waitTime * 1.3));
	while(true && !finished)
	{
		var amount:float = Random.value;
		if(amount > .65)
		{
			projectorGood = false;
		}
		yield;
		yield WaitForSeconds(Random.Range(waitTime * .7, waitTime * 1.3));
	}
}

function Smoke () {
	yield WaitForSeconds(Random.Range(waitTime * .7, waitTime * 1.3));
	while(true && !finished)
	{
		var amount:float = Random.value;
		smokeGoal = amount;
		yield WaitForSeconds(Random.Range(waitTime * .7, waitTime * 1.3));
	}
}

function Play () {
	while(true)
	{
		smokeSlider.transform.position.x = Mathf.MoveTowards(smokeSlider.transform.position.x,Mathf.Lerp(sliderLimitLeft,sliderLimitRight,smokeGoal),Time.deltaTime);
		yield;
	}
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