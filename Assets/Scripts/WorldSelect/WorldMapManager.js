#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

public enum MapStatus{Clear,Confirmation,Menu,Credits,Notification,Returning,Intro,WorldReveal,HighScore};

static var currentState:MapStatus;
static var returnState:MapStatus;
static var mapMove:boolean;

static var currentNotification:GameObject;

// Audio
var worldMusic:AudioClip;
var worldMusicEvil:AudioClip;
var worldReveal:AudioClip[];

// Clear
static var cameraVelocity:float;
@HideInInspector var importantFinger:int;
@HideInInspector var startPosition:Vector3;
@HideInInspector var mapMoveSpeed:float;
@HideInInspector var worlds:Transform[];
@HideInInspector var closestWorld:int;
static var allowClick:boolean;
@HideInInspector var leftCameraLimit:float;
@HideInInspector var rightCameraLimit:float;

// Confirmation
var ticket:GameObject;
private var worldTransition:GameObject;
static var selectedLocation:float;

// Menu
private var fade:Renderer;

// Intro
var intro2:GameObject;
@HideInInspector var startLocation:float;
@HideInInspector var location1:float;
@HideInInspector var location2:float;
@HideInInspector var location3:float;
@HideInInspector var unlockNotified:boolean;
@HideInInspector var step:float;
static var introducing:boolean;
@HideInInspector var loadedText:GameObject;

@HideInInspector var velocities:float[];

var reveal:GameObject;
var townDestructionCover:SpriteRenderer;
var townDestructionSound:AudioClip;
var theaterAlertNotification:GameObject;
var IAPRequest:GameObject;

// Locations
private var showNot:Vector3;
private var hideNot:Vector3;

function Start () {
	//Intro
	introducing = false;
	startLocation = -150;
	location1 = 18;
	location2 = -2.66;
	location3 = 57;
	unlockNotified = false;
	step = -1;
	
	velocities = new float[3];
	velocities = [0.0,0];
	
	selectedLocation = transform.position.x;
	
	Master.showWorldTitle = false;
	worlds = new Transform[transform.childCount];
	for(var i:int = 0; i < worlds.length; i++)
	{
		worlds[i] = transform.GetChild(i);
	}
	for(var world:Transform in worlds)
	{
		if(world.name == ObscuredPrefs.GetString("LastWorldVisited"))
		{
			transform.position.x = world.localPosition.x * transform.localScale.x * -1;
		}
	}
	fade = Camera.main.GetComponentInChildren(Renderer);
	showNot = Vector3(0,0,-1);
	hideNot = Vector3(0,30,-1);
	leftCameraLimit = -135;
	rightCameraLimit = 73;
	currentState = MapStatus.Clear;
	returnState = currentState;
	importantFinger = -1;
	mapMove = false;
	mapMoveSpeed = .08;
	if(Master.worldCoverOn)
	{
		townDestructionCover.color.a = 1;
	}
	if(ObscuredPrefs.GetInt("TutorialFinished") < 2)
	{
		introducing = true;
		currentState = MapStatus.Intro;
		Intro();
	}
	else if(Master.mapNotifyWorlds.length > 0)
	{
		if(TimeManager.state == TimeState.DayNormal || TimeManager.state == TimeState.NightNormal)
		{
			AudioManager.PlaySongIntro(null,worldMusic,1);
		}
		else
		{
			AudioManager.PlaySongIntro(null,worldMusicEvil,1);
		}
		currentState = MapStatus.WorldReveal;
		WorldReveal();
	}
	else
	{
		if(TimeManager.state == TimeState.DayNormal || TimeManager.state == TimeState.NightNormal)
		{
			AudioManager.PlaySongIntro(null,worldMusic,1);
		}
		else
		{
			AudioManager.PlaySongIntro(null,worldMusicEvil,1);
		}
	}
	MapCover();
}

function Intro() {
	transform.position.x = startLocation;
	yield WaitForSeconds(.5);
	step ++;
	loadedText = Instantiate(intro2);
	while(!loadedText.GetComponent(TextManager).finished)
	{
		yield;
	}
	ObscuredPrefs.SetInt("TutorialFinished",2);
	currentState = MapStatus.Clear;
}

function WorldReveal() {
	yield WaitForSeconds(.8);
	var revealNames:String[] = Master.mapNotifyWorlds;
	Master.mapNotifyWorlds = new String[0];
	for(var i:int = 0; i < revealNames.length; i++)
	{
		var thisWorld:Transform;
		for(var x:int = 0; x < worlds.length; x++)
		{
			if(worlds[x].name == revealNames[i])
			{
				thisWorld = worlds[x];
			}
		}
		while(Mathf.Abs(transform.position.x - thisWorld.transform.position.x * -1 * transform.localScale.x) > .1)
		{
			transform.position.x = Mathf.Lerp(transform.position.x,thisWorld.transform.position.x * -1 * transform.localScale.x,Time.deltaTime * .35);
			yield;
		}
		for(x = 0; x < Camera.main.GetComponent(Master).worlds.length; x ++)
		{
			if(Camera.main.GetComponent(Master).worlds[x].basic.worldNameVar == thisWorld.GetComponent(ChangeMapState).worldNameVar)
			{
				Master.currentWorld = Camera.main.GetComponent(Master).worlds[x];
			}
		}
		thisWorld.GetComponent(ParticleSystem).emissionRate = 400;
		Instantiate(reveal,Vector3(thisWorld.transform.position.x,0,0),Quaternion.identity).transform.parent = thisWorld;
		AudioManager.PlaySound(worldReveal[i]);
		yield WaitForSeconds(2);
		thisWorld.GetComponent(ParticleSystem).emissionRate = 0;
		yield;
	}
	if(ObscuredPrefs.GetInt("HighSchool") == 1 && ObscuredPrefs.GetInt("WorldMapTheaterUnlockNotified") != 1)
	{
		var newNotify:GameObject = Instantiate(theaterAlertNotification);
		ObscuredPrefs.SetInt("WorldMapTheaterUnlockNotified",1);
		while(newNotify != null)
		{
			yield;
		}
	}
	if(ObscuredPrefs.GetInt("SaveSystemAvailable") == 0)
	{
		var IAPNote:GameObject = Instantiate(IAPRequest);
		while(IAPNote != null || Master.notifying)
		{
			yield;
		}
	}
	CheckForMapState();	
}

function CheckForMapState() {
	if(ObscuredPrefs.GetInt("WorldMapState") == 0 && ObscuredPrefs.GetInt("HighSchoolBeatEndPlayed") == 1)
	{
		ObscuredPrefs.SetInt("WorldMapState",1);
		while(townDestructionCover.color.a != 1)
		{
			AudioManager.SongVolumeChange(1-(townDestructionCover.color.a*1.2),100);
			townDestructionCover.color.a = Mathf.MoveTowards(townDestructionCover.color.a,1,Time.deltaTime*.45);
			yield;
		}
		Master.worldCoverOn = true;
		AudioManager.PlaySound(townDestructionSound);
		AudioManager.SongVolumeChange(1,100);
		Application.LoadLevel("WorldSelect");
	}
	currentState = MapStatus.Clear;
}

function MapCover() {
	yield WaitForSeconds(1);
	while(townDestructionCover.color.a != 0)
	{
		townDestructionCover.color.a = Mathf.MoveTowards(townDestructionCover.color.a,0,Time.deltaTime * 1);
		yield;
	}
}

function Update () {
	// Move map if no pop-ups are on-screen.
	switch(currentState)
	{
		case MapStatus.Intro:
				allowClick = false;
				transform.position.x = Mathf.Lerp(transform.position.x,location1,Time.deltaTime*.14);
				transform.position.x = Mathf.MoveTowards(transform.position.x,location1,Time.deltaTime*12);
			break;
		case MapStatus.WorldReveal:
				allowClick = false;
			break;
		case MapStatus.Clear:
			returnState = currentState;
			hideTicket();
			fade.material.color.a = Mathf.MoveTowards(fade.GetComponent.<Renderer>().material.color.a, 0, Time.deltaTime);
			// Get Finger
			if(importantFinger == -1)
			{
				allowClick = true;
				for(var i:int = 0; i < Finger.identity.length; i++)
				{
					if(Finger.GetExists(i))
					{
						startPosition = Vector3(Finger.GetPosition(i).x,Finger.GetPosition(i).y,0);
						importantFinger = i;
						break;
					}
				}
				FindClosest();
			}
			else
			{
				if(Vector3.Distance(startPosition, Vector3(Finger.GetPosition(importantFinger).x,Finger.GetPosition(importantFinger).y,0)) > 2)
				{
					mapMove = true;
					allowClick = false;
				}
				else
				{
					if((Mathf.Abs(Finger.GetPosition(importantFinger).x) > 13.5 && Mathf.Abs(Finger.GetPosition(importantFinger).y) < 5.3)|| (Mathf.Abs(Finger.GetPosition(importantFinger).x) > 6 && Finger.GetPosition(importantFinger).y < -12))
					{
						cameraVelocity = Finger.GetPosition(importantFinger).x * -1.3;
					}
					else
					{
						allowClick = true;
					}
				}
				if(!Finger.GetExists(importantFinger))
				{
					importantFinger = -1;
					mapMove = false;
				}
				else if(mapMove)
				{
					cameraVelocity = Mathf.Clamp(Finger.GetVelocity(importantFinger).x,-60,60);
					for(var thisOne:int = velocities.length - 1; thisOne > 0; thisOne --)
					{
						velocities[thisOne] = velocities[thisOne-1];
					}
					velocities[0] = Mathf.Clamp(Finger.GetVelocity(importantFinger).x,-60,60);
					var total:float = 0;
					for(thisOne = 0; thisOne < velocities.length; thisOne ++)
					{
						total += velocities[thisOne];
					}
					cameraVelocity = total/3;
				}
			}
			
			// Move camera according to finger velocity, but slow over time.
			if(ObscuredPrefs.GetInt("PackingPeanutFactoryFirstOpeningPlayed") == 0)
			{
				transform.position.x = Mathf.Lerp(transform.position.x,location2,Time.deltaTime*3);
				transform.position.x = Mathf.MoveTowards(transform.position.x,location2,Time.deltaTime*8);
			}
			else if(ObscuredPrefs.GetInt("FirstThingUnlocked") != 1 && ObscuredPrefs.GetInt("CurrencyNumber") >= 50 && ObscuredPrefs.GetInt("UnlockWheel") == 1)
			{
				SendUnlockNote();
				transform.position.x = Mathf.Lerp(transform.position.x,location3,Time.deltaTime*3);
				transform.position.x = Mathf.MoveTowards(transform.position.x,location3,Time.deltaTime*8);
			}
			else
			{
				if(transform.position.x + (cameraVelocity * mapMoveSpeed) > leftCameraLimit && transform.position.x + (cameraVelocity * mapMoveSpeed) < rightCameraLimit)
				{
					transform.position.x += cameraVelocity * mapMoveSpeed;
				}
				else
				{
					cameraVelocity = 0;
				}
				cameraVelocity = Mathf.Lerp(cameraVelocity,0,Time.deltaTime * 2.5);
			}
			break;
		case MapStatus.Confirmation:
			returnState = currentState;
			showTicket();
			FindClosest();
			fade.material.color.a = Mathf.MoveTowards(fade.GetComponent.<Renderer>().material.color.a, 0, Time.deltaTime);
			transform.position.x = Mathf.Lerp(transform.position.x, selectedLocation * transform.localScale.x * -1,Time.deltaTime*5);
			transform.position.x = Mathf.MoveTowards(transform.position.x, selectedLocation * transform.localScale.x * -1,Time.deltaTime*.8);
			break;
		case MapStatus.Menu:
			fade.GetComponent.<Renderer>().material.color.a = Mathf.MoveTowards(fade.GetComponent.<Renderer>().material.color.a, .4, Time.deltaTime);
			break;
		case MapStatus.Returning:
			fade.GetComponent.<Renderer>().material.color.a = Mathf.MoveTowards(fade.GetComponent.<Renderer>().material.color.a, 0, Time.deltaTime);
			break;
		case MapStatus.Notification:
			mapMove = false;
			transform.position.x = Mathf.Lerp(transform.position.x, selectedLocation * transform.localScale.x * -1,Time.deltaTime*5);
			transform.position.x = Mathf.MoveTowards(transform.position.x, selectedLocation * transform.localScale.x * -1,Time.deltaTime*.8);
			allowClick = false;
			fade.GetComponent.<Renderer>().material.color.a = Mathf.MoveTowards(fade.GetComponent.<Renderer>().material.color.a, .4, Time.deltaTime);
			if(!Master.notifying)
			{
				currentState = returnState;
			}
			break;
		default:
			break;
	}
}

function showTicket() {
	var childText:Component[];
	var childImages:Component[];
	childText = ticket.GetComponentsInChildren(TextMesh);
	childImages = ticket.GetComponentsInChildren(Renderer);
	(ticket.GetComponentInChildren(HardModeToggle) as HardModeToggle).UpdateVisuals(false);
	for(var text:TextMesh in childText)
	{
		if(text.transform.name == "Title")
		{
			text.text = Camera.main.GetComponent(Master).currentWorld.basic.topLine;
		}	
		else if(text.transform.name == "HighScore")
		{
			if(Master.hardMode)
			{
				text.text = ObscuredPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"HighScoreHard").ToString();
			}
			else
			{
				text.text = ObscuredPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"HighScore").ToString();
			}
		}
	}
	for(var images:Renderer in childImages)
	{
		if(images.transform.name == "Image")
		{
			images.material.mainTexture = Master.currentWorld.basic.playbillNormal;
		}
		else if(images.transform.name == "ImageEvil")
		{
			images.material.mainTexture = Master.currentWorld.basic.playbillEvil;
		}
	}
	while(Vector3.Distance(ticket.transform.position, showNot) > .1 && currentState == MapStatus.Confirmation)
	{	
		ticket.transform.position = Vector3.Lerp(ticket.transform.position,showNot, Time.deltaTime);
		yield;
	}
}
function hideTicket() {
	Master.hardMode = false;
	(ticket.GetComponentInChildren(HardModeToggle) as HardModeToggle).UpdateVisuals(true);
	while(Vector3.Distance(ticket.transform.position, hideNot) > .5 && currentState == MapStatus.Clear)
	{
		ticket.transform.position = Vector3.Lerp(ticket.transform.position,hideNot, Time.deltaTime);
		yield;
	}
}

function FindClosest() {
	var smallestDistance:float = 100;
	for(var worldList:int = 0; worldList < worlds.length; worldList++)
	{
		if(Mathf.Abs(0 - worlds[worldList].position.x) < smallestDistance)
		{
			smallestDistance = Mathf.Abs(0 - worlds[worldList].position.x);
			closestWorld = worldList;
		}
	}
	if(Mathf.Abs(transform.position.x - (worlds[closestWorld].localPosition.x * transform.localScale.x * -1)) < 8 && Mathf.Abs(cameraVelocity) < 10)
	{
		if(ObscuredPrefs.GetString("LastWorldVisited") != worlds[closestWorld].name)
		{
			ObscuredPrefs.SetString("LastWorldVisited", worlds[closestWorld].name);
		}
		if(ObscuredPrefs.GetInt("PackingPeanutFactoryFirstOpeningPlayed") != 0 && currentState != MapStatus.WorldReveal)
		{
			transform.position.x = Mathf.Lerp(transform.position.x, worlds[closestWorld].localPosition.x * transform.localScale.x * -1,Time.deltaTime*3);
			transform.position.x = Mathf.MoveTowards(transform.position.x, worlds[closestWorld].localPosition.x * transform.localScale.x * -1,Time.deltaTime*.7);
		}
	}
}

function SendUnlockNote() {
	if(!unlockNotified)
	{
		unlockNotified = true;
		Camera.main.GetComponent(Master).LaunchNotification("Let's go unlock something!",NotificationType.notEnoughCoins);
	}
}
