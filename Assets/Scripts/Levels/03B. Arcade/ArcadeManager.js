#pragma strict

public enum ArcadeState {Selecting,Playing,Results,Leaderboard,Notification,Leaving}

var mainScreen:GameObject;
var cabinetPrefab:GameObject;
var buttons:GameObject;
@HideInInspector var distance:float;
@HideInInspector var speed:float;
static var currentState:ArcadeState;
@HideInInspector var games:ArcadeGame[];
@HideInInspector var master:Master;
@HideInInspector var currentSelection:int;

@HideInInspector var displays:GameObject[];
@HideInInspector var displayPosition:int[];


function Start () {
	currentSelection = 0;
	master = Camera.main.GetComponent(Master);
	games = master.arcadeGames;
	distance = 23;
	speed = 10;
	displays = new GameObject[games.length+1];
	displayPosition = new int[games.length+1];
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
			}
		}
		displays[i].transform.position.z += 10;
	}
	currentSelection = games.length;
	FindPositions();
	currentState = ArcadeState.Selecting;
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