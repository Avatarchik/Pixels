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

static var performance:boolean;
function Start () {
	performance = true;
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
		musicSpeaker.clip = rehearsalMusic;
		vocalSpeakerGood.clip = vocalsSuccess;
		vocalSpeakerBad.clip = vocalsFailureRehearsal;
	}
	Show();
}

function Update () {
	if(PlayerPrefs.GetInt("Music") == 1)
	{
		musicSpeaker.volume = 1;
		if(performance)
		{
			vocalSpeakerGood.volume = Mathf.MoveTowards(vocalSpeakerGood.volume,1,Time.deltaTime * 1.2);
			vocalSpeakerBad.volume = Mathf.MoveTowards(vocalSpeakerBad.volume,0,Time.deltaTime);
		}
		else
		{
			vocalSpeakerGood.volume = Mathf.MoveTowards(vocalSpeakerGood.volume,0,Time.deltaTime);
			vocalSpeakerBad.volume = Mathf.MoveTowards(vocalSpeakerBad.volume,1,Time.deltaTime * 1.2);
		}
	}
	else
	{
		musicSpeaker.volume = 0;
		vocalSpeakerGood.volume = 0;
		vocalSpeakerBad.volume = 0;
	}
}

function Show () {	
	musicSpeaker.Play();
	vocalSpeakerBad.Play();
	vocalSpeakerGood.Play();
	while(musicSpeaker.time < scenes[0].info.gameStartTime)
	{
		yield;
	}
	for(var i:int = 0; i < 5; i++)
	{
		if(PlayerPrefs.GetInt(scenes[i].gameName+"BeatEndPlayed") != 1)
		{
			break;
		}
		StartScene(scenes[i]);
		while(musicSpeaker.time < scenes[i].info.gameEndTime)
		{
			yield;
		}
		EndScene(scenes[i]);
	}
	EndShow ();
}

function EndShow () {
	
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
	var gameStartTime:float;
	var gameEndTime:float;
}