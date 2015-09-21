#pragma strict

@HideInInspector var global:boolean;

var globalHighlight:SpriteRenderer;
var friendsHighlight:SpriteRenderer;
var globalText:TextMesh;
var friendsText:TextMesh;

var locationNumbers:GameObject[];
var locationNames:GameObject[];
var locationScores:GameObject[];

@HideInInspector var latestScore:float;
@HideInInspector var userName:String;

@HideInInspector var allUsers:User[];
@HideInInspector var displayUsers:User[];
var defaultUserNames:String[];
var defaultUserScores:float[];

@HideInInspector var leaderBoardName:String;

@HideInInspector var bigSize:float;
@HideInInspector var normalSize:float;

function Start () {
	latestScore = ArcadeManager.lastScore;
	if(latestScore == 0)
	{
		latestScore = 5.5;
	}
	displayUsers = new User[9];
	global = true;
	bigSize = .7;
	normalSize = .15;
	
	allUsers = new User[0];
	for(var arrayPiece:int = 0; arrayPiece < allUsers.length; arrayPiece ++)
	{
		allUsers[arrayPiece] = new User();
	}
	if(allUsers.Length == 0)
	{
		CreateDefaults();
	}
	
	var tempArray:User[];
	tempArray = allUsers;
	allUsers = new User[allUsers.length + 1];
	for(arrayPiece = 0; arrayPiece < allUsers.length; arrayPiece ++)
	{
		allUsers[arrayPiece] = new User();
	}
	for(var i:int = 0; i < tempArray.length; i++)
	{
		allUsers[i] = tempArray[i];
		allUsers[i].peter = false;
	}
	
	allUsers[allUsers.length-1].name = "Peter";
	allUsers[allUsers.length-1].score = latestScore;
	allUsers[allUsers.length-1].peter = true;
	
	OrderList();
	CreateDisplayList();
	UpdateDisplay();
	
	ShowResults();
}

function RegularUpdate () {
	while(true)
	{
		if(global)
		{
			globalHighlight.color.a = 1;
			friendsHighlight.color.a = 0;
		}
		else
		{
			globalHighlight.color.a = 0;
			friendsHighlight.color.a = 1;
		}
		yield;
	}
}

function ShowResults() {
	globalHighlight.color.a = 0;
	friendsHighlight.color.a = 0;
	globalText.color.a = 0;
	friendsText.color.a = 0;
	
	var peterLocation:int = -1;
	UpdateColors();
	for(var i:int = 0; i < displayUsers.length; i++)
	{
		if(displayUsers[i].peter)
		{
			peterLocation = i;
			locationNames[i].GetComponent(TextMesh).characterSize = bigSize;
		}
		else
		{
			locationNames[i].GetComponent(TextMesh).color.a = 0;
			locationNumbers[i].GetComponent(TextMesh).color.a = 0;
			locationScores[i].GetComponent(TextMesh).color.a = 0;
		}
	}
	yield WaitForSeconds(1);
	while(locationNames[peterLocation].GetComponent(TextMesh).characterSize != normalSize)
	{
		locationNames[peterLocation].GetComponent(TextMesh).characterSize = Mathf.MoveTowards(locationNames[peterLocation].GetComponent(TextMesh).characterSize,normalSize,Time.deltaTime * 2);
		yield;
	}
	yield WaitForSeconds(.2);
	for(i = 0; i < displayUsers.length; i++)
	{
		if(displayUsers[i].peter)
		{
		}
		else
		{
			locationNames[i].GetComponent(TextMesh).color.a = 1;
			locationNumbers[i].GetComponent(TextMesh).color.a = 1;
			locationScores[i].GetComponent(TextMesh).color.a = 1;
		}
	}
	globalHighlight.color.a = 1;
	friendsHighlight.color.a = 0;
	globalText.color.a = 1;
	friendsText.color.a = 1;
	RegularUpdate();
}

function UpdateColors () {
	for(var i:int = 0; i < displayUsers.length; i++)
	{
		if(displayUsers[i].peter)
		{
			locationNames[i].GetComponent(TextMesh).color = Color.yellow;
			locationNumbers[i].GetComponent(TextMesh).color = Color.yellow;
			locationScores[i].GetComponent(TextMesh).color = Color.yellow;
		}
		else
		{
			locationNames[i].GetComponent(TextMesh).color = Color.white;
			locationNumbers[i].GetComponent(TextMesh).color = Color.white;
			locationScores[i].GetComponent(TextMesh).color = Color.white;
		}
	}
}

function SwitchArray (from:int,to:int){
	var holdUser:User = allUsers[from];
	for(var i:int = from; i > to; i--)
	{
		allUsers[i] = allUsers[i-1];
	}
	allUsers[to] = holdUser;
}

function CreateDefaults () {
	allUsers = new User[defaultUserNames.length];
	for(var arrayPiece:int = 0; arrayPiece < allUsers.length; arrayPiece ++)
	{
		allUsers[arrayPiece] = new User();
	}
	for(var i:int = 0; i < allUsers.length; i++)
	{
		allUsers[i].name = defaultUserNames[i];
		allUsers[i].score = defaultUserScores[i];
	}
}

function OrderList () {
	for(var i:int = 0; i < allUsers.length; i++)
	{
		for(var y:int = 0; y < allUsers.length; y++)
		{
			if(allUsers[i].score <= allUsers[y].score)
			{
				SwitchArray(i,y);
				break;
			}
		}
	}
}

function CreateDisplayList () {
	var playerLocation:int = -1;
	for(var i:int = 0; i < allUsers.length; i++)
	{
		allUsers[i].globalRank = allUsers.length - i;
		if(allUsers[i].peter)
		{
			playerLocation = i;
		}
	}
	var placement:int = 0;
	if(playerLocation > allUsers.length - 6)
	{
		for(placement = 0; placement < displayUsers.length; placement++)
		{
			displayUsers[placement] = allUsers[allUsers.length - 1 - placement];
		}
	}
	else if(playerLocation < 6)
	{
		for(placement = 0; placement < displayUsers.length; placement++)
		{
			displayUsers[placement] = allUsers[displayUsers.length - 1 - placement];
		}
	}
	else
	{
		for(placement = 0; placement < displayUsers.length; placement++)
		{
			displayUsers[placement] = allUsers[playerLocation + 4 - placement];
		}
	}
}

function UpdateDisplay () {
	for(var i:int = 0; i < displayUsers.length; i++)
	{
		if(displayUsers[i].name != null &&displayUsers[i].name != "")
		{
			locationNumbers[i].GetComponent(TextMesh).text = displayUsers[i].globalRank.ToString();
			locationNames[i].GetComponent(TextMesh).text = displayUsers[i].name;
			locationScores[i].GetComponent(TextMesh).text = displayUsers[i].score.ToString("f2");
		}
		else
		{
			locationNumbers[i].GetComponent(TextMesh).text = "";
			locationNames[i].GetComponent(TextMesh).text = "";
			locationScores[i].GetComponent(TextMesh).text = "";
		}
	}	
}	

class User {
	var globalRank:int;
	var name:String;
	var score:float;
	var peter:boolean;
}