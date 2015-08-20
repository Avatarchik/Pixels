#pragma strict

public enum ArcadeState {Selecting,Playing,Results,Leaderboard}

var mainScreen:GameObject;
var cabinetPrefab:GameObject;
@HideInInspector var distance:float;
@HideInInspector var speed:float;
@HideInInspector var currentState:ArcadeState;
@HideInInspector var games:ArcadeGame[];
@HideInInspector var master:Master;
@HideInInspector var currentSelection:int;

@HideInInspector var displays:GameObject[];
@HideInInspector var displayPosition:int[];


function Start () {
	currentSelection = 0;
	master = Camera.main.GetComponent(Master);
	games = master.arcadeGames;
	distance = 22;
	speed = 10;
	displays = new GameObject[games.length];
	displayPosition = new int[games.length];
	displays[0] = Instantiate(mainScreen);
	for(var i:int = 1; i < displays.length; i++)
	{
		displays[i] = Instantiate(cabinetPrefab);
	}
	FindPositions();
	currentState = ArcadeState.Selecting;
}

function Update () {
	Debug.Log(currentSelection);
	for(var i:int = 0; i < displays.length; i++)
	{
		if(Mathf.Abs(displays[i].transform.position.x - (distance * displayPosition[i])) > distance * (displayPosition.Length/2))
		{
			displays[i].transform.position.x = distance * displayPosition[i];
		}
		displays[i].transform.position.x = Mathf.MoveTowards(displays[i].transform.position.x,distance * displayPosition[i],Time.deltaTime * speed);
		displays[i].transform.position.x = Mathf.Lerp(displays[i].transform.position.x,distance * displayPosition[i],Time.deltaTime * speed);
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
	currentSelection += distance;
	if(currentSelection >= games.length)
	{
		currentSelection = 0;
	}
	else if(currentSelection < 0)
	{
		currentSelection = games.length-1;
	}
	FindPositions();
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