#pragma strict

public enum ArcadeState {Selecting,Playing,Results,Leaderboard,Notification,Leaving}

var mainScreen:GameObject;
var cabinetPrefab:GameObject;
var buttons:GameObject;
var resultsScreen:GameObject;
@HideInInspector var distance:float;
@HideInInspector var speed:float;
static var currentState:ArcadeState;
@HideInInspector var games:ArcadeGame[];
@HideInInspector var master:Master;
@HideInInspector var currentSelection:int;
@HideInInspector var currentNotification:GameObject;
@HideInInspector var currentGame:GameObject;
@HideInInspector var currentResults:GameObject;
@HideInInspector var left:boolean;

@HideInInspector var displays:GameObject[];
@HideInInspector var displayPosition:int[];
@HideInInspector var faces:SpriteRenderer[];

@HideInInspector var normalScale:Vector3;
@HideInInspector var doubleScale:Vector3;

var frontMusic:AudioClip;
var gameMusic:AudioClip;
var shutDownSound:AudioClip;

var helloSounds:AudioClip[];
var goodbyeSounds:AudioClip[];
var gameStartGeneralSounds:AudioClip[];

static var lastScore:float;
static var lastGameVariable:String;

function Start () {
	left = false;
	currentSelection = 0;
	master = Camera.main.GetComponent(Master);
	games = master.arcadeGames;
	distance = 23;
	speed = 10;
	normalScale = Vector3(14.06,14.06,1);
	doubleScale = Vector3(28.12,28.12,1);
	displays = new GameObject[games.length+1];
	displayPosition = new int[games.length+1];
	faces = new SpriteRenderer[games.length+1];
	displays[games.length] = Instantiate(mainScreen);
	displays[games.length].transform.position.z += 10;
	for(var i:int = 0; i < displays.length-1; i++)
	{
		displays[i] = Instantiate(cabinetPrefab);
		for(var child:SpriteRenderer in displays[i].GetComponentsInChildren(SpriteRenderer))
		{
			if(child.transform.name == "Face")
			{
				child.sprite = games[i].cabinet;
				faces[i] = child;
			}
		}
	}
	currentSelection = games.length;
	FindPositions();
	currentState = ArcadeState.Selecting;
	AudioManager.PlaySound(helloSounds[Random.Range(0,helloSounds.length)],1);
	AudioManager.PlaySong(frontMusic);
}

function Update () {
	
	for(var i:int = 0; i < displays.length; i++)
	{
		if(Mathf.Abs(displays[i].transform.position.x - (distance * displayPosition[i])) > distance * (displayPosition.Length/2))
		{
			displays[i].transform.position.x = distance * displayPosition[i];
		}
		displays[i].transform.position.x = Mathf.MoveTowards(displays[i].transform.position.x,distance * displayPosition[i],Time.deltaTime * speed);
		displays[i].transform.position.x = Mathf.Lerp(displays[i].transform.position.x,distance * displayPosition[i],Time.deltaTime * speed);
	}
	switch(currentState)
	{
		case ArcadeState.Selecting:
			for(i = 0; i < displays.length-1; i++)
			{
				displays[i].transform.localScale = Vector3.MoveTowards(displays[i].transform.localScale,normalScale,Time.deltaTime*50);
				faces[i].color = Color.Lerp(faces[i].color,Color.white,Time.deltaTime * 4);
			}
			break;
		case ArcadeState.Playing:
			
			displays[currentSelection].transform.localScale = Vector3.MoveTowards(displays[currentSelection].transform.localScale,doubleScale,Time.deltaTime*50);
			faces[currentSelection].color = Color.Lerp(faces[currentSelection].color,Color.black,Time.deltaTime * 4);
			break;
		case ArcadeState.Results:
			displays[currentSelection].transform.localScale = Vector3.MoveTowards(displays[currentSelection].transform.localScale,normalScale,Time.deltaTime*50);
			faces[currentSelection].color = Color.Lerp(faces[currentSelection].color,Color.white,Time.deltaTime * 4);
			break;
		case ArcadeState.Leaderboard:
			break;
		case ArcadeState.Notification:
			break;
		case ArcadeState.Leaving:
			if(!left)
			{
				left = true;
				AudioManager.PlaySound(goodbyeSounds[Random.Range(0,goodbyeSounds.length)]);
			}
			break;
		default:
			break;
	}
	if(Input.GetKeyDown("left"))
	{
		Scroll(-1);
	}
	if(Input.GetKeyDown("right"))
	{
		Scroll(1);
	}
}

function Scroll (distance:int) {
	if(currentState == ArcadeState.Selecting)
	{
		currentSelection += distance;
		if(currentSelection >= displays.length)
		{
			currentSelection = 0;
		}
		else if(currentSelection < 0)
		{
			currentSelection = displays.length-1;
		}
		if(currentSelection < displays.length - 1)
		{
			lastGameVariable = games[currentSelection].name;
		}
		var isMainScreen:boolean = false;
		if(currentSelection == games.length)
		{
			isMainScreen = true;
		}
		for(var button:ArcadeButton in buttons.GetComponentsInChildren(ArcadeButton))
		{
			if(isMainScreen)
			{
				button.Switch(false,(games[0].paidUnlockCost>0),games[0].paidUnlockCost,games[0].playCost,games[0].unlocked);
			}
			else
			{
				button.Switch(true,(games[currentSelection].paidUnlockCost>0),games[currentSelection].paidUnlockCost,games[currentSelection].playCost,games[currentSelection].unlocked);
			}
		}
		
		FindPositions();
	}
}

function FindPositions () {
	for(var i:int = 0; i < displays.length; i++)
	{
		if(displays[i].GetComponent(ArcadeObject) != null)
		{
			var thisObjectScript:ArcadeObject = displays[i].GetComponent(ArcadeObject);
		}
		displayPosition[i] = i - currentSelection;
		if(displayPosition[i] > Mathf.Ceil(displayPosition.Length/2))
		{
			displayPosition[i] -= displayPosition.Length;
		}
		else if(displayPosition[i] < -Mathf.Ceil(displayPosition.Length/2))
		{
			displayPosition[i] += displayPosition.Length;
		}
		if(displays[i].GetComponent(ArcadeObject) != null)
		{
			if(displayPosition[i] == 0)
			{
				thisObjectScript.centered = true;
			}
			else
			{
				thisObjectScript.centered = false;
			}
		}
	}
}

function StartGame () {
	AudioManager.PlaySound(gameStartGeneralSounds[Random.Range(0,gameStartGeneralSounds.length)]);
	currentState = ArcadeState.Playing;
	yield WaitForSeconds(1);
	AudioManager.PlaySong(gameMusic);
	currentGame = Instantiate(games[currentSelection].game);
}

function FinishGame (score:float) {
	AudioManager.PlaySound(shutDownSound);
	Destroy(currentGame);
	lastScore = score;
	AudioManager.PlaySong(frontMusic);
	Results();
}

function Results () {
	currentResults = Instantiate(resultsScreen);
	while(currentResults != null)
	{
		yield;
	}
	currentState = ArcadeState.Selecting;
}

function LaunchNotification (notificationText:String,type:NotificationType) {
	var oldState:ArcadeState;
	oldState = currentState;
	currentState = ArcadeState.Notification;
	Camera.main.GetComponent(Master).LaunchNotification(notificationText,type);
	while(Master.notifying)
	{
		yield;
	}
	currentState = oldState;
}