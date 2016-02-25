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
@HideInInspector var friendUsers:User[];
@HideInInspector var displayUsers:User[];
@HideInInspector var friendNames:String[];
var defaultUserNames:String[];
var defaultUserScores:float[];
var defaultFriendNames:String[];

@HideInInspector var leaderBoardName:String;

@HideInInspector var bigSize:float;
@HideInInspector var normalSize:float;

@HideInInspector var clicked:boolean;

var gameNameText:TextMesh;

var notConnected:TextMesh;

var loading:GameObject;

@HideInInspector var canSwitch:boolean;

function Start () {
	clicked = false;
	canSwitch = false;
	if(Master.hardMode)
	{
		latestScore = PlayerPrefs.GetInt(Camera.main.GetComponent(Master).currentWorld.basic.worldNameVar+"HighScoreHard");
		leaderBoardName = Camera.main.GetComponent(Master).currentWorld.basic.worldNameVar + "Hard";
	}
	else
	{
		latestScore = PlayerPrefs.GetInt(Camera.main.GetComponent(Master).currentWorld.basic.worldNameVar+"HighScore");
		leaderBoardName = Camera.main.GetComponent(Master).currentWorld.basic.worldNameVar;
	}
	gameNameText.text = Camera.main.GetComponent(Master).currentWorld.basic.worldNameFull;
	if(gameNameText.text.length <= 10)
	{
		gameNameText.characterSize = .4;
		gameNameText.transform.localPosition.y += .05;
	}
	if(latestScore == 0)
	{
		latestScore = 1;
	}
	displayUsers = new User[9];
	friendUsers = new User[0];
	global = true;
	bigSize = .7;
	normalSize = .15;
	var leaderboard:ILeaderboard = Social.CreateLeaderboard();
	leaderboard.id = leaderBoardName;
	Social.localUser.Authenticate(function(success) {
		if(success)
		{
			leaderboard.LoadScores(function() {
				if(leaderboard.scores.Length > 0)	
				{
					Debug.Log("Successfully retrieved " + leaderboard.scores.length + " scores!");
					allUsers = new User[leaderboard.scores.length];
					var userIDs:String[];
					userIDs = new String[leaderboard.scores.length];
					for(var score:int = 0; score < allUsers.length; score++)
					{
						allUsers[score] = new User();
						allUsers[score].id = leaderboard.scores[score].userID;
						userIDs[score] = leaderboard.scores[score].userID;
						allUsers[score].score = leaderboard.scores[score].value;
						if(allUsers[score].id == Social.localUser.id)
						{
							allUsers[score].name = "Peter";
							allUsers[score].peter = true;
						}
						else
						{
							allUsers[score].peter = false;
						}
					}	
					friendNames = new String[Social.localUser.friends.length];
					for(var name:int = 0; name < friendNames.length; name ++)
					{
						friendNames[name] = Social.localUser.friends[name].userName;
					}	
					FinishStart();
				}
				else
				{
					Debug.Log("No scores were loaded.");
					allUsers = new User[0];
					NotConnected();
				}
			});
		}
		else
		{
			Debug.Log("Could not authenticate.");
			allUsers = new User[0];
			NotConnected();
		}
	}
	);
}

function GetUserNames (ids:String[]) {
	canSwitch = false;
	for(var x:int = 0; x < ids.length; x ++)
	{
		if(ids[x] != "Peter")
		{
			var singleThing:String[] = new String[1];
			singleThing[0] = ids[x];
			Social.LoadUsers(singleThing,function(users){
				for(var i:int = 0; i < users.length; i++)
				{
					Debug.Log(users[0].userName);
					locationNames[x].GetComponent(TextMesh).text = users[0].userName;
				}
			});
		}
		else
		{
			locationNames[x].GetComponent(TextMesh).text = "Peter";
		}
		yield WaitForSeconds(.3);
	}
	canSwitch = true;
}

function NotConnected () {
	for(var i:int = 0; i < displayUsers.length; i++)
	{
		locationNumbers[i].GetComponent(TextMesh).text = "";
		locationNames[i].GetComponent(TextMesh).text = "";
		locationScores[i].GetComponent(TextMesh).text = "";
	}	
	globalHighlight.color.a = 0;
	friendsHighlight.color.a = 0;
	globalText.color.a = 0;
	friendsText.color.a = 0;
	notConnected.color.a = 1;
	if(loading != null)
	{
		Destroy(loading);
	}
}

function FinishStart () {
	yield WaitForSeconds(1);
	if(allUsers.Length == 0)
	{
		CreateDefaults();
	}
	if(friendNames.length == 0)
	{
		friendNames = defaultFriendNames;
	}
	CreateFriendsList();
	allUsers = OrderList(allUsers);
	friendUsers = OrderList(friendUsers);
	CreateDisplayList(allUsers);
	UpdateDisplay();
	ShowResults();
	if(loading != null)
	{
		Destroy(loading);
	}
}

function RegularUpdate () {
	while(true)
	{
		if(Input.GetKeyDown("left"))
		{
			global = true;
			CreateDisplayList(allUsers);
			UpdateDisplay();
			UpdateColors();
		}
		if(Input.GetKeyUp("right"))
		{
			global = false;
			CreateDisplayList(friendUsers);
			UpdateDisplay();
			UpdateColors();
		}
		if(Finger.GetExists(0) && Finger.GetInGame(0) && !clicked)
		{
			clicked = true;
			if(Finger.GetPosition(0).y < -5 && canSwitch)
			{
				if(Finger.GetPosition(0).x > 0)
				{
					global = false;
					CreateDisplayList(friendUsers);
					UpdateDisplay();
					UpdateColors();
				}
				else
				{
					global = true;
					CreateDisplayList(allUsers);
					UpdateDisplay();
					UpdateColors();
				}
			}
		}
		if(!Finger.GetExists(0))
		{
			clicked = false; 
		}
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

function CreateFriendsList () {
	for(var i:int = 0; i < allUsers.length; i++)
	{
		for(var y:int = 0; y < friendNames.length; y++)
		{
				if(allUsers[i].name == friendNames[y])
				{
					friendUsers = AddToArray(friendUsers,allUsers[i]);
				}
		}
		if(allUsers[i].name == "Peter")
		{
			friendUsers = AddToArray(friendUsers,allUsers[i]);
		}
	}
}

function AddToArray (original:User[],addition:User):User[] {
	var finalArray:User[] = new User[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
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
		if(displayUsers[i]!= null)
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
}

function SwitchArray (array:User[],from:int,to:int){
	var holdUser:User = array[from];
	for(var i:int = from; i > to; i--)
	{
		array[i] = array[i-1];
	}
	array[to] = holdUser;
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

function OrderList (users:User[]):User[] {
	for(var i:int = 0; i < users.length; i++)
	{
		for(var y:int = 0; y < users.length; y++)
		{
			if(users[i].score <= users[y].score)
			{
				SwitchArray(users,i,y);
				break;
			}
		}
	}
	return users;
}

function CreateDisplayList (users:User[]) {
	var playerLocation:int = -1;
	for(var i:int = 0; i < users.length; i++)
	{
		users[i].globalRank = users.length - i;
		if(users[i].peter)
		{
			playerLocation = i;
		}
	}
	var placement:int = 0;
	if(playerLocation > users.length - 6)
	{
		for(placement = 0; placement < displayUsers.length; placement++)
		{
			if(users.length - 1 - placement < 0)
			{
				displayUsers[placement] = CreateEmptyPlayer();
			}
			else if(users[users.length - 1 - placement] != null)
			{
				displayUsers[placement] = users[users.length - 1 - placement];
			}
		}
	}
	else if(playerLocation < 6)
	{
		for(placement = 0; placement < displayUsers.length; placement++)
		{	
			if(displayUsers.length - 1 - placement < 0 || displayUsers.length - 1 - placement >= users.length)
			{
				displayUsers[placement] = CreateEmptyPlayer();
			}
			else if(users[displayUsers.length - 1 - placement] != null)
			{
				displayUsers[placement] = users[displayUsers.length - 1 - placement];
			}
		}
	}
	else
	{
		for(placement = 0; placement < displayUsers.length; placement++)
		{
			if(playerLocation + 4 - placement < 0)
			{
				displayUsers[placement] = CreateEmptyPlayer();
			}
			else if(users[playerLocation + 4 - placement] != null)
			{
				displayUsers[placement] = users[playerLocation + 4 - placement];
			}
		}
	}
	while(displayUsers[0] == null)
	{
		for(placement = 0; placement < displayUsers.length-1; placement++)
		{
			displayUsers[placement] = displayUsers[placement + 1];
		}
	}
	for(placement = displayUsers.length - 1; placement > 0; placement--)
	{
		if(displayUsers[placement] == displayUsers[placement-1])
		{
			displayUsers[placement] = CreateEmptyPlayer();
		}
	}
}

function CreateEmptyPlayer ():User {
	var newUser:User = new User();
	newUser.name = "";
	newUser.score = 0;
	newUser.globalRank = 1000;
	newUser.peter = false;
	return newUser;
}

function UpdateDisplay () {
	var idsToGrab:String[] = new String[0];
	for(var i:int = 0; i < displayUsers.length; i++)
	{
		if(displayUsers[i] != null && displayUsers[i].name != "")
		{
			locationNumbers[i].GetComponent(TextMesh).text = displayUsers[i].globalRank.ToString();
			if(displayUsers[i].peter)
			{
				idsToGrab = AddString(idsToGrab,"Peter");
				locationNames[i].GetComponent(TextMesh).text = displayUsers[i].name;
			}
			else
			{
				Debug.Log(displayUsers[i].id);
				idsToGrab = AddString(idsToGrab,displayUsers[i].id);
				locationNames[i].GetComponent(TextMesh).text = "Loading...";
			}
			locationScores[i].GetComponent(TextMesh).text = displayUsers[i].score.ToString("f0");
		}
		else
		{
			locationNumbers[i].GetComponent(TextMesh).text = "";
			locationNames[i].GetComponent(TextMesh).text = "";
			locationScores[i].GetComponent(TextMesh).text = "";
		}
	}
	GetUserNames(idsToGrab);
}

function AddString (original:String[],addition:String):String[] {
	var finalArray:String[] = new String[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}