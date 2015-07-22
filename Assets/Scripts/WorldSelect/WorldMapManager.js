	#pragma strict

public enum MapStatus{Clear,Confirmation,Menu,Credits,Notification,Returning};

static var currentState:MapStatus;
static var mapMove:boolean;

// Audio
var worldMusic:AudioClip;

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

// Locations
private var showNot:Vector3;
private var hideNot:Vector3;

function Start () {
	selectedLocation = transform.position.x;
	AudioManager.PlaySongIntro(null,worldMusic,1);

	worlds = new Transform[transform.childCount];
	for(var i:int = 0; i < worlds.length; i++)
	{
		worlds[i] = transform.GetChild(i);
	}
	for(var world:Transform in worlds)
	{
		if(world.name == PlayerPrefs.GetString("LastWorldVisited"))
		{
			transform.position.x = world.localPosition.x * transform.localScale.x * -1;
		}
	}
	fade = Camera.main.GetComponentInChildren(Renderer);
	showNot = Vector3(0,0,-1);
	hideNot = Vector3(0,30,-1);
	leftCameraLimit = -95;
	rightCameraLimit = 28;
	currentState = MapStatus.Clear;
	importantFinger = -1;
	mapMove = false;
	if(mapMoveSpeed == 0 || mapMoveSpeed == null)
	{
		mapMoveSpeed = .035;
	}
}

function Update () {
	// Move map if no pop-ups are on-screen.
	switch(currentState)
	{
		case MapStatus.Clear:
			hideTicket();
			fade.material.color.a = Mathf.MoveTowards(fade.GetComponent.<Renderer>().material.color.a, 0, Time.deltaTime);
			// Get Finger
			if(importantFinger == -1)
			{
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
						cameraVelocity = Finger.GetPosition(importantFinger).x * -2;
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
				}
			}
			
			// Move camera according to finger velocity, but slow over time.
			if(transform.position.x + (cameraVelocity * mapMoveSpeed) > leftCameraLimit && transform.position.x + (cameraVelocity * mapMoveSpeed) < rightCameraLimit)
			{
				transform.position.x += cameraVelocity * mapMoveSpeed;
			}
			else
			{
				cameraVelocity = 0;
			}
			cameraVelocity = Mathf.Lerp(cameraVelocity,0,Time.deltaTime * 2.5);
			
			break;
		case MapStatus.Confirmation:
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
		default:
			break;
	}
}

function showTicket() {
	var childText:Component[];
	var childImages:Component[];
	childText = ticket.GetComponentsInChildren(TextMesh);
	childImages = ticket.GetComponentsInChildren(Renderer);
	ticket.GetComponentInChildren(HardModeToggle).UpdateVisuals(false);
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
				text.text = PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"HighScoreHard").ToString();
			}
			else
			{
				text.text = PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"HighScore").ToString();
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
	ticket.GetComponentInChildren(HardModeToggle).UpdateVisuals(true);
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
		if(PlayerPrefs.GetString("LastWorldVisited") != worlds[closestWorld].name)
		{
			PlayerPrefs.SetString("LastWorldVisited", worlds[closestWorld].name);
		}
		transform.position.x = Mathf.Lerp(transform.position.x, worlds[closestWorld].localPosition.x * transform.localScale.x * -1,Time.deltaTime*3);
		transform.position.x = Mathf.MoveTowards(transform.position.x, worlds[closestWorld].localPosition.x * transform.localScale.x * -1,Time.deltaTime*.7);
	}
}
