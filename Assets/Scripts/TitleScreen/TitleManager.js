#pragma strict

public enum TitleStatus{Home,CustomizeNoColor,CustomizeColor,Options};

static var currentState:TitleStatus;

// Audio
var intro:AudioClip;
var titleMusic:AudioClip;

// Menu Pieces
var colors1:GameObject;
var colors2:GameObject;
var returnButton:GameObject;

var flats:GameObject[];
var currentFlat:GameObject;

function Start () {
	PlaySong();
	currentState = TitleStatus.Home;
	StartCoroutine(FlatMovement());
}	

function Update () {
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
}

function FlatMovement () {
	var goal:float;
	while(true && flats.Length != 0)
	{
		while(currentFlat == null && currentState != TitleStatus.CustomizeColor && currentState != TitleStatus.CustomizeColor)
		{
			goal = Random.Range(0,2);
			if(goal == 0)
			{
				goal = -1;
			}
			yield WaitForSeconds(Random.Range(4,8));
			currentFlat = Instantiate(flats[Random.Range(0,flats.Length)], Vector3(transform.position.x + -16.7 * goal,transform.position.y - 4.95 + (.15 * Random.Range(-3,6)),3),Quaternion.identity);
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

function PlaySong () {
	if(Master.initialLoad)
	{
		AudioManager.PlaySongIntro(intro,titleMusic,3.4);			
	}
	else
	{
		yield WaitForSeconds(.25);
		AudioManager.PlaySongIntro(intro,titleMusic,3.4);
	}
}