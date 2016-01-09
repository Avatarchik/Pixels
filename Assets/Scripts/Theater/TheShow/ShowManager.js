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

@HideInInspector var possibleOpenings:GameObject[];

var endSound:AudioClip;

var openingText:GameObject;

function Start () {
	good = true;
	scores = new float[10];
	currentTheaterPosition = Vector3.zero;
	currentMusicLocation = 0;
	for(var i:int = 0; i < scenes.length; i++)
	{
		scenes[i].effects.originalColor = new Color[scenes[i].effects.colorChangeObjects.length];
		for(var x:int = 0; x < scenes[i].effects.originalColor.length; x++)
		{
			scenes[i].effects.originalColor[x] = scenes[i].effects.colorChangeObjects[x].color;
		}
		if(PlayerPrefs.GetInt(scenes[i].gameName+"BeatEndPlayed") == 1)
		{
			if(Master.allowShow)
			{
				possibleOpenings = scenes[i].showOpenings;
			}
			else
			{
				possibleOpenings = scenes[i].rehearsalOpenings;
			}
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
		musicSpeaker.clip = rehearsalMusic;
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
		musicSpeaker.volume = 0;
		vocalSpeakerGood.volume = 0;
		vocalSpeakerBad.volume = 0;
	}
	theater.transform.position = Vector3.MoveTowards(theater.transform.position,currentTheaterPosition,Time.deltaTime * currentTheaterSpeed);
}

function Show () {
yield WaitForSeconds(.35);
	theaterLights.StartOfShow();
	if(possibleOpenings.length > 0)
	{
		openingText = Instantiate(possibleOpenings[Random.Range(0,possibleOpenings.length)]);
	}
	while(!openingText.GetComponent(TextManager).finished)
	{
		yield;
	}
	theaterLights.StartOfShow();
	musicSpeaker.Play();
	vocalSpeakerBad.Play();
	vocalSpeakerGood.Play();
	for(var i:int = 0; i < scenes.length; i++)
	{
		while(currentMusicLocation < scenes[i].info.gameStartTime)
		{
			yield;
		}
		if(PlayerPrefs.GetInt(scenes[i].gameName+"BeatEndPlayed") != 1)
		{
			EndSong();
			break;
		}
		StartScene(scenes[i]);
		while(currentMusicLocation < scenes[i].info.gameEndTime)
		{
			yield;
		}
		EndScene(scenes[i]);
	}
	currentTheaterSpeed = 20;
	currentTheaterPosition = Vector3.zero;
	yield WaitForSeconds(.5);
	EndShow ();
}

function EndShow () {
	curtains.Close();
	theaterLights.EndOfShow();
	AudioManager.StopSong();
	yield WaitForSeconds(3);
	results.DisplayScores(scores);
}

function EndSong () {
	AudioManager.PlaySound(endSound);
	yield WaitForSeconds(.2);
	musicSpeaker.Stop();
	vocalSpeakerBad.Stop();
	vocalSpeakerGood.Stop();
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
	var rehearsalOpenings:GameObject[];
	var showOpenings:GameObject[];
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