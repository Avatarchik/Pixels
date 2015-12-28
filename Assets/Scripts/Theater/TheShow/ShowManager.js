#pragma strict

var scenes:Scene[];

var musicSpeaker:AudioSource;
var vocalSpeakerGood:AudioSource;
var vocalSpeakerBad:AudioSource;

var performanceMusic:AudioClip;
var rehearsalMusic:AudioClip;
var vocalsSuccess:AudioClip;
var vocalsFailurePerformance:AudioClip;
var vocalsFailureRehearsal:AudioClip;

var theater:GameObject;
@HideInInspector var currentTheaterPosition:Vector3;
@HideInInspector var currentTheaterSpeed:float;

@HideInInspector var scores:float[];

var theaterLights:ShowTheaterManager;

var curtains:ShowCurtains;

var results:TheShowResultsScreen;

static var good:boolean;

static var currentMusicLocation:float;

static var performance:boolean;

function Start () {
	good = true;
	scores = new float[10];
	performance = true;
	currentTheaterPosition = Vector3.zero;
	currentMusicLocation = 0;
	for(var i:int = 0; i < scenes.length; i++)
	{
		scenes[i].effects.originalColor = new Color[scenes[i].effects.colorChangeObjects.length];
		for(var x:int = 0; x < scenes[i].effects.originalColor.length; x++)
		{
			scenes[i].effects.originalColor[x] = scenes[i].effects.colorChangeObjects[x].color;
		}
	}
	if(Master.allowShow)
	{
		musicSpeaker.clip = performanceMusic;
		vocalSpeakerGood.clip = vocalsSuccess;
		vocalSpeakerBad.clip = vocalsFailurePerformance;
	}
	else
	{
		musicSpeaker.clip = performanceMusic;
		vocalSpeakerGood.clip = vocalsSuccess;
		vocalSpeakerBad.clip = vocalsFailureRehearsal;
	}
	Show();
}

function Update () {
	currentMusicLocation = musicSpeaker.time;
	if(Mathf.Abs(vocalSpeakerBad.time - musicSpeaker.time) > .1)
	{
		vocalSpeakerBad.time = musicSpeaker.time;
	}
	if(Mathf.Abs(vocalSpeakerGood.time - musicSpeaker.time) > .1)
	{
		vocalSpeakerGood.time = musicSpeaker.time;
	}
	if(Input.GetKey("f"))
	{
		musicSpeaker.pitch = 20;
		vocalSpeakerBad.pitch = 20;
		vocalSpeakerGood.pitch = 20;
		Time.timeScale = 20;
	}
	else
	{
		musicSpeaker.pitch = 1;
		vocalSpeakerBad.pitch = 1;
		vocalSpeakerGood.pitch = 1;
		Time.timeScale = 1;
	}
	if(PlayerPrefs.GetInt("Music") == 1)
	{
		musicSpeaker.volume = 1;
		if(performance)
		{
			if(good)
			{
				vocalSpeakerGood.volume = Mathf.MoveTowards(vocalSpeakerGood.volume,1,Time.deltaTime * 4.5);
				vocalSpeakerBad.volume = Mathf.MoveTowards(vocalSpeakerBad.volume,0,Time.deltaTime * 4);
			}
			else
			{
				vocalSpeakerGood.volume = Mathf.MoveTowards(vocalSpeakerGood.volume,0,Time.deltaTime * 4);
				vocalSpeakerBad.volume = Mathf.MoveTowards(vocalSpeakerBad.volume,1,Time.deltaTime * 4.5);
			}
		}
		else
		{
			vocalSpeakerGood.volume = Mathf.MoveTowards(vocalSpeakerGood.volume,0,Time.deltaTime * 4);
			vocalSpeakerBad.volume = Mathf.MoveTowards(vocalSpeakerBad.volume,1,Time.deltaTime * 4.5);
		}
	}
	else
	{
		musicSpeaker.volume = 0;
		vocalSpeakerGood.volume = 0;
		vocalSpeakerBad.volume = 0;
	}
	theater.transform.position = Vector3.MoveTowards(theater.transform.position,currentTheaterPosition,Time.deltaTime * currentTheaterSpeed);
}

function Show () {
	yield WaitForSeconds(1);
	theaterLights.StartOfShow();	
	musicSpeaker.Play();
	vocalSpeakerBad.Play();
	vocalSpeakerGood.Play();
	for(var i:int = 0; i < 5; i++)
	{
		while(currentMusicLocation < scenes[i].info.gameStartTime)
		{
			yield;
		}
		if(PlayerPrefs.GetInt(scenes[i].gameName+"BeatEndPlayed") != 1)
		{
			break;
		}
		StartScene(scenes[i]);
		while(currentMusicLocation < scenes[i].info.gameEndTime)
		{
			yield;
		}
		EndScene(scenes[i]);
	}
	EndShow ();
}

function EndShow () {
	curtains.Close();
	theaterLights.EndOfShow();
	yield WaitForSeconds(4.5);
	results.DisplayScores(scores);
}

function Test () {
	var marker:int = 0;
	while(true)
	{
		if(Input.GetKeyDown("space"))
		{
			StartScene(scenes[marker]);
			if(marker > 0)
			{
				EndScene(scenes[marker-1]);
			}
			marker++;
		}
		yield;
	}
}

function StartScene (scene:Scene) {
	var i:int = 0;
	currentTheaterPosition = scene.info.theaterLocation;
	currentTheaterSpeed = scene.info.theaterMovementSpeed;
	for(i = 0; i < scene.effects.movingObjects.length; i++)
	{
		if(scene.effects.movingObjects[i].GetComponent(ShowObjectManager) != null)
		{
			scene.effects.movingObjects[i].GetComponent(ShowObjectManager).Show();
		}
	}
	for(i = 0; i < scene.effects.colorChangeObjects.length; i++)
	{
		if(scene.effects.colorChangeObjects[i].GetComponent(ShowObjectManager) != null)
		{
			scene.effects.colorChangeObjects[i].GetComponent(ShowObjectManager).ChangeColor(scene.effects.newColor[i]);
		}
	}
}

function EndScene (scene:Scene) {
	var i:int = 0;
	for(i = 0; i < scene.effects.movingObjects.length; i++)
	{
		if(scene.effects.movingObjects[i].GetComponent(ShowObjectManager) != null)
		{
			scene.effects.movingObjects[i].GetComponent(ShowObjectManager).Hide();
		}
	}
}

class Scene {
	var gameName:String;
	var effects:SceneEffects;
	var info:SceneInfo;
}

class SceneEffects {
	var movingObjects:GameObject[];
	var colorChangeObjects:SpriteRenderer[];
	var newColor:Color[];
	@HideInInspector var originalColor:Color[];
}

class SceneInfo {
	var maximumScore:float;
	var theaterLocation:Vector3;	
	var theaterMovementSpeed:float;
	var gameStartTime:float;
	var gameEndTime:float;
}