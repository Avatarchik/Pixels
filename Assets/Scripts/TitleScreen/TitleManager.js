#pragma strict

public enum TitleStatus{Home,CustomizeNoColor,CustomizeColor,Options,Intro};

static var currentState:TitleStatus;

static var playingOpening:boolean;

static var started:boolean;
// Audio
var intro:AudioClip;
var titleMusic:AudioClip;

// Opening
@HideInInspector var loadedText:GameObject;
var openingText:GameObject;

// Menu Pieces
var colors1:GameObject;
var colors2:GameObject;
var returnButton:GameObject;

// Visual Pieces
var flyIns1Sprites:Sprite[];
var flyIns2Sprites:Sprite[];
var flyIn:GameObject;
var flyIn1:GameObject;
var flyIn2:GameObject;
@HideInInspector var flyInTop:float = 22;
@HideInInspector var flyInBottom:float = 11.85;

var startSign:SpriteRenderer;
var flats:GameObject[];
@HideInInspector var currentFlat:GameObject;

function Start () {
	started = false;
	flyIn.transform.localPosition.y = flyInTop;
	StartScreen();
}

function StartScreen () {
	if(PlayerPrefs.GetInt("TutorialFinished") != 0)
	{
		started = true;
		startSign.color.a = 0;
		Regular();
	}
	else
	{
		currentState = TitleStatus.Intro;
		while(true)
		{
			if(Finger.GetExists(0) || Input.GetKey("space"))
			{
				break;
			}
			yield;
		}
		Intro();
	}
}

function Intro () {
	started = true;
	AudioManager.Loop(false);
	loadedText = Instantiate(openingText);
	loadedText.transform.position.z += 10;
	while(!loadedText.GetComponent(TextManager).finished)
	{
		yield;
	}
	while(AudioManager.GetLocation() < 22.35 && AudioManager.GetPlaying())
	{
		yield;
	}
	PlayerPrefs.SetInt("TutorialFinished",1);
	Regular();
}

function Regular () {
	PlaySong();
	currentState = TitleStatus.Home;
	StartCoroutine(FlatMovement());
	StartCoroutine(FlyInMovement());
	RegularUpdate();
}

function RegularUpdate () {
	while(true)
	{
		var speed:float = Time.deltaTime * 5;
		switch(currentState)
		{
			case TitleStatus.Home:
				AudioManager.humCharacter = Person.None;
				transform.position = Vector2.Lerp(transform.position, Vector2(0,0),speed);
				returnButton.transform.position = Vector2.Lerp(returnButton.transform.position, Vector2(-7,22),speed);
				colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
				colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,-1),speed);
				break;
			case TitleStatus.CustomizeNoColor:
				AudioManager.humCharacter = Person.Peter;
				transform.position = Vector2.Lerp(transform.position, Vector2(0,29),speed);
				returnButton.transform.position = Vector2.Lerp(returnButton.transform.position, Vector2(-7,14.08),speed);
				colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
				colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,-1),speed);
				break;
			case TitleStatus.CustomizeColor:
				AudioManager.humCharacter = Person.Peter;
				transform.position = Vector2.Lerp(transform.position, Vector2(0,29),speed);
				returnButton.transform.position = Vector2.Lerp(returnButton.transform.position, Vector2(-7,14.08),speed);
				colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-14.15),speed);
				colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(12.4,-1),speed);
				break;
			case TitleStatus.Options:
				AudioManager.humCharacter = Person.None;
				transform.position = Vector2.Lerp(transform.position, Vector2(-30,0),speed);
				returnButton.transform.position = Vector2.Lerp(returnButton.transform.position, Vector2(-7,22),speed);
				colors1.transform.position = Vector2.Lerp(colors1.transform.position, Vector2(0,-20),speed);
				colors2.transform.position = Vector2.Lerp(colors2.transform.position, Vector2(22,-1),speed);
				break;
			default:
				break;
		}
		yield;
	}
}

function FlatMovement () {
	var goal:float;
	while(true && flats.Length != 0)
	{
		while(currentFlat == null && currentState != TitleStatus.CustomizeColor)
		{
			goal = Random.Range(0,2); 
			if(goal == 0)
			{
				goal = -1;
			}
			yield WaitForSeconds(Random.Range(4,8.0));
			currentFlat = Instantiate(flats[Random.Range(0,flats.Length)], Vector3(transform.position.x + -16.7 * goal,transform.position.y - 4.95 + (.15 * Random.Range(-3,6)),4.2),Quaternion.identity);
			currentFlat.transform.parent = transform;
			yield;
		}
		while(currentFlat != null)
		{
			currentFlat.transform.position.x += Time.deltaTime * 4 * goal;
			if(currentFlat.transform.position.x > transform.position.x + 16.7 || currentFlat.transform.position.x < transform.position.x - 16.7)
			{
				Destroy(currentFlat);
			}
			yield;
		}
	yield;
	}
	yield;
}

function FlyInMovement () {
	while(AudioManager.GetLocation() < 2.2)
	{
		yield;
	}
	while(true)
	{
		var newFlyIn:int = Random.Range(0,flyIns1Sprites.length);
		flyIn1.GetComponent(SpriteRenderer).sprite = flyIns1Sprites[newFlyIn];
		flyIn2.GetComponent(SpriteRenderer).sprite = flyIns2Sprites[newFlyIn];
		while(flyIn.transform.localPosition.y != flyInBottom)
		{
			flyIn.transform.localPosition.y = Mathf.MoveTowards(flyIn.transform.localPosition.y,flyInBottom,Time.deltaTime*20);
			yield;
		}
		StartCoroutine(Shake(flyIn,10, Vector3(0.1,.1,0)));
		yield WaitForSeconds(Random.Range(8,13));
		var pullAmount:float = 1;
		while(flyIn.transform.localPosition.y != flyInTop)
		{
			if(Mathf.Abs(flyIn.transform.localPosition.y-flyInTop) > pullAmount)
			{
				var tempGoal:float = flyIn.transform.localPosition.y + pullAmount;
				while(flyIn.transform.localPosition.y != tempGoal)
				{
					flyIn.transform.localPosition.y = Mathf.MoveTowards(flyIn.transform.localPosition.y,tempGoal,Time.deltaTime*1);
					flyIn.transform.localPosition.y = Mathf.Lerp(flyIn.transform.localPosition.y,tempGoal,Time.deltaTime*2);
					yield;
				}
			}
			else
			{
				flyIn.transform.localPosition.y = Mathf.MoveTowards(flyIn.transform.localPosition.y,flyInTop,Time.deltaTime*5);
			}
			yield;
		}
		yield WaitForSeconds(1);
	}
	yield;
}

function Shake (object:GameObject, numberShakes:int, distance:Vector3){
	var count:int = 0;
	var origin:Vector3 = object.transform.position;
	object.transform.position = origin + distance;
	while(count < numberShakes)
	{
		distance = distance * -.85;
		object.transform.position = origin + distance;
		yield WaitForSeconds(.004);
		count ++;
		yield;
	}
	object.transform.position = Vector3(origin.x,origin.y,object.transform.position.z);
	yield;
}

function PlaySong () {
	AudioManager.PlayCutscene(intro);
	while(AudioManager.GetLocation() < 3.15)
	{
		yield;
	}
	AudioManager.Loop(true);
	AudioManager.PlaySong(titleMusic);
}