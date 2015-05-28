#pragma strict

public enum MapStatus{Clear,Confirmation,Menu,Credits,Notification,Returning,Results};

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

// Banner
var banner:GameObject;
@HideInInspector var bannerText:TextMesh;

// Results
var results:GameObject;
@HideInInspector var currentResults:GameObject;

// Menu
private var fade:Renderer;

// Locations
private var showNot:Vector3;
private var hideNot:Vector3;

function Start () {
	selectedLocation = transform.position.x;
	AudioManager.PlaySongIntro(null,worldMusic,1);

	bannerText = banner.GetComponentInChildren(TextMesh);
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
	leftCameraLimit = -61;
	rightCameraLimit = 28;
	if(Master.needToNotify)
	{
		currentState = MapStatus.Results;
		Master.needToNotify = false;
	}
	else
	{
		currentState = MapStatus.Clear;
	}
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
			if(currentResults!=null)
			{
				if(currentResults.transform.position.y != 30)
				{
					currentResults.transform.position.y = Mathf.MoveTowards(currentResults.transform.position.y,30, Time.deltaTime*30);
				}
				else
				{
					Destroy(currentResults);
				}
			}
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
					if((Mathf.Abs(Finger.GetPosition(importantFinger).x) > 13.5 && Mathf.Abs(Finger.GetPosition(importantFinger).x) < 5.3)|| (Mathf.Abs(Finger.GetPosition(importantFinger).x) > 6 && Finger.GetPosition(importantFinger).y < -12))
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
			transform.position.x = Mathf.Lerp(transform.position.x, selectedLocation * transform.localScale.x * -1,Time.deltaTime*3);
			transform.position.x = Mathf.MoveTowards(transform.position.x, selectedLocation * transform.localScale.x * -1,Time.deltaTime*.7);
			break;
		case MapStatus.Menu:
			fade.GetComponent.<Renderer>().material.color.a = Mathf.MoveTowards(fade.GetComponent.<Renderer>().material.color.a, .4, Time.deltaTime);
			break;
		case MapStatus.Returning:
			fade.GetComponent.<Renderer>().material.color.a = Mathf.MoveTowards(fade.GetComponent.<Renderer>().material.color.a, 0, Time.deltaTime);
			break;
		case MapStatus.Results:
			fade.GetComponent.<Renderer>().material.color.a = Mathf.MoveTowards(fade.GetComponent.<Renderer>().material.color.a, .4, Time.deltaTime);
			if(currentResults == null)
			{
				currentResults = Instantiate(results);
			} 
			currentResults.transform.position.y = Mathf.Lerp(currentResults.transform.position.y,showNot.y, Time.deltaTime * 5);
			break;
		default:
			break;
	}
	if(closestWorld != null && Mathf.Abs(worlds[closestWorld].transform.position.x - transform.position.x) < 3)
	{
		if(worlds[closestWorld].GetComponent(BasicWorldInfo).bottomLine != null && worlds[closestWorld].GetComponent(BasicWorldInfo).bottomLine != "")
		{
			bannerText.text = worlds[closestWorld].GetComponent(BasicWorldInfo).topLine + "\n" + worlds[closestWorld].GetComponent(BasicWorldInfo).bottomLine;
		}
		else
		{
			bannerText.text = worlds[closestWorld].GetComponent(BasicWorldInfo).topLine;
		}
		showBanner();
	}
	else
	{
		hideBanner();	
	}
}

function showTicket() {
	var childText:Component[];
	childText = ticket.GetComponentsInChildren(TextMesh);
	for(var text:TextMesh in childText)
	{
		if(text.transform.name == "Title1" || text.transform.name == "Shadow1")
		{
			text.text = Camera.main.GetComponent(Master).worldNameLine1;
		}	
		else if(text.transform.name == "Title2" || text.transform.name == "Shadow2")
		{
			text.text = Camera.main.GetComponent(Master).worldNameLine2;
		}	
		else if(text.transform.name == "HighScore")
		{
			text.text = PlayerPrefs.GetInt(Master.worldNameVar+"HighScore").ToString();
		}
	}
	while(Vector3.Distance(ticket.transform.position, showNot) > .1 && currentState == MapStatus.Confirmation)
	{	
		ticket.transform.position = Vector3.Lerp(ticket.transform.position,showNot, Time.deltaTime);
		yield;
	}
}
function hideTicket() {
	while(Vector3.Distance(ticket.transform.position, hideNot) > .5 && currentState == MapStatus.Clear)
	{
		ticket.transform.position = Vector3.Lerp(ticket.transform.position,hideNot, Time.deltaTime);
		yield;
	}
}

function showBanner() {
	banner.transform.position = Vector3.Lerp(banner.transform.position,showNot - Vector3(0,8,.5), Time.deltaTime * 2);
}
function hideBanner() {
	banner.transform.position = Vector3.Lerp(banner.transform.position,-hideNot, Time.deltaTime * 2);
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
