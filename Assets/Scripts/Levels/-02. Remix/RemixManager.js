#pragma strict

static var leaving:boolean;

static var step:int;

static var hardMode:boolean;

var levelSelect:GameObject;

var difficultySelect:GameObject;

@HideInInspector var hidden:Vector3;
@HideInInspector var shown:Vector3;

var worldButtons:GameObject[];
@HideInInspector var loadGames:GameObject[];
@HideInInspector var bossGames:GameObject[];

var transition:GameObject;

var VRLevelMusic:AudioClip;

var gameOpenings:GameObject[];

function Start () {
	Master.currentWorld.text.regularOpening = gameOpenings[Random.Range(0,gameOpenings.length)];
	Master.currentWorld.text.firstOpening = gameOpenings[Random.Range(0,gameOpenings.length)];
	hidden = Vector3.zero;
	shown = Vector3(14.06,14.06,14.06);
	loadGames = new GameObject[0];
	bossGames = new GameObject[0];
	hardMode = false;
	leaving = false;
	step = 1;
	BeginVR();
}

function BeginVR () {
	BroadcastMessage("EnterVR",SendMessageOptions.DontRequireReceiver);
	yield WaitForSeconds(.4);
	AudioManager.PlaySong(VRLevelMusic,1);
	yield WaitForSeconds(.8);
	if(!PlayerPrefs.HasKey("RemixHasBeenPlayed") || PlayerPrefs.GetInt("RemixHasBeenPlayed") == 0)
	{
		Camera.main.GetComponent(Master).LaunchNotification("Earn coins by combining levels!",NotificationType.tutorial);
		PlayerPrefs.SetInt("RemixHasBeenPlayed",1);
	}
	yield WaitForSeconds(1);
}

function Update () {
	if(step == 1)
	{
		levelSelect.transform.localScale = Vector3.Lerp(levelSelect.transform.localScale,shown,Time.deltaTime*5);
		levelSelect.transform.position.z = 0;
		difficultySelect.transform.localScale = Vector3.Lerp(difficultySelect.transform.localScale,hidden,Time.deltaTime*5);
		difficultySelect.transform.position.z = 2;
	}
	else if(step == 2)
	{
		levelSelect.transform.localScale = Vector3.Lerp(levelSelect.transform.localScale,hidden,Time.deltaTime*5);
		levelSelect.transform.position.z = 2;
		difficultySelect.transform.localScale = Vector3.Lerp(difficultySelect.transform.localScale,shown,Time.deltaTime*5);
		difficultySelect.transform.position.z = 0;
	}
	else if(step > 2)
	{
		levelSelect.transform.localScale = Vector3.Lerp(levelSelect.transform.localScale,hidden,Time.deltaTime*5);
		difficultySelect.transform.localScale = Vector3.Lerp(difficultySelect.transform.localScale,hidden,Time.deltaTime*5);
		Load();
	}
}

function Load() {
	if(!leaving)
	{
		leaving = true;
		for(var i:int = 0; i < worldButtons.length; i++)
		{
			var world:RemixWorldButton = worldButtons[i].GetComponent(RemixWorldButton);
			if(world.selected)
			{
				for(var game:int = 0; game < world.games.length; game++)
				{
					loadGames = AddObject(loadGames,world.games[game]);
				}
				bossGames = AddObject(bossGames,world.bossGame);
			}
		}
		if(loadGames.Length > 0)
		{
			Master.currentWorld.basic.games = loadGames;
			Master.currentWorld.basic.bossGame = bossGames[Random.Range(0,bossGames.length)];
			AudioManager.PlaySoundTransition(Master.currentWorld.audio.transitionIn);
			Instantiate(transition, Vector3(0,0,-9.5), Quaternion.identity);
			yield WaitForSeconds(.7);
			AudioManager.StopSong();
			yield WaitForSeconds(1);
			Application.LoadLevel("MicroGameLauncher");
		}
		else
		{
			leaving = false;
			step = 1;
			Camera.main.GetComponent(Master).LaunchNotification("You must select at least one world!",NotificationType.tutorial);
		}
	}
}

function AddObject (original:GameObject[],addition:GameObject):GameObject[] {
	var finalArray:GameObject[] = new GameObject[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}