#pragma strict

public enum MapStatus{Clear,Confirmation,Menu,Credits,Notification};

static var currentState:MapStatus;
static var mapMove:boolean;

// Clear
var cameraVelocity:Vector2;
var bound:Bounds;
var importantFinger:int;
var startPosition:Vector3;
var mapMoveSpeed:float;

// Confirmation
var ticket:GameObject;
var worldTransition:GameObject;

// Menu
var fade:Renderer;

// Locations
var showNot:Vector3;
var hideNot:Vector3;

function Start () {
	fade = Camera.main.GetComponentInChildren(Renderer);
	showNot = Vector3(0,0,-1);
	hideNot = Vector3(0,30,-1);
	currentState = MapStatus.Clear;
	bound = Bounds(Vector3(transform.position.x, transform.position.y, 0), Vector3(transform.lossyScale.x, transform.lossyScale.y, 2));
	importantFinger = -1;
	mapMove = false;
	if(mapMoveSpeed == 0 || mapMoveSpeed == null)
	{
		mapMoveSpeed = .05;
	}
}
function Update () {
	// Move map if no pop-ups are on-screen.
	switch(currentState)
	{
		case MapStatus.Clear:
			hideTicket();
			fade.material.color.a = Mathf.MoveTowards(fade.renderer.material.color.a, 0, Time.deltaTime);
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
			}
			else
			{
				if(Vector3.Distance(startPosition, Vector3(Finger.GetPosition(importantFinger).x,Finger.GetPosition(importantFinger).y,0)) > 3)
				{
					mapMove = true;
				}
				if(!Finger.GetExists(importantFinger))
				{
					importantFinger = -1;
					mapMove = false;
				}
				else if(mapMove)
				{
					cameraVelocity = Finger.GetVelocity(importantFinger);
				}
			}
			
			// Move camera according to finger velocity, but slow over time.
			var xLimit:int;
			var yLimit:int;
			if(Input.deviceOrientation == DeviceOrientation.LandscapeLeft || Input.deviceOrientation == DeviceOrientation.LandscapeRight) 
			{
				xLimit = 16;
				yLimit = 9;
			}
			else if(Input.deviceOrientation == DeviceOrientation.Portrait || Input.deviceOrientation == DeviceOrientation.PortraitUpsideDown) 
			{
				xLimit = 9;
				yLimit = 16;
			}
			if(Camera.main.orthographicSize == 9)
			{
				if(transform.position.x + (cameraVelocity.x * mapMoveSpeed) - bound.extents.x < -16 && transform.position.x + (cameraVelocity.x * mapMoveSpeed) + bound.extents.x > 16)
				{
					transform.position.x += cameraVelocity.x * mapMoveSpeed;
				}
				if(transform.position.y + (cameraVelocity.y * mapMoveSpeed) - bound.extents.y < -9 && transform.position.y + (cameraVelocity.y * mapMoveSpeed) + bound.extents.y > 9)
				{
					transform.position.y += cameraVelocity.y * mapMoveSpeed;
				}
			}
			else
			{
				if(transform.position.x + (cameraVelocity.x * mapMoveSpeed) - bound.extents.x < -9 && transform.position.x + (cameraVelocity.x * mapMoveSpeed) + bound.extents.x > 9)
				{
					transform.position.x += cameraVelocity.x * mapMoveSpeed;
				}
				if(transform.position.y + (cameraVelocity.y * mapMoveSpeed) - bound.extents.y < -16 && transform.position.y + (cameraVelocity.y * mapMoveSpeed) + bound.extents.y > 16)
				{
					transform.position.y += cameraVelocity.y * mapMoveSpeed;
				}
			}
			
			// Reset if past.
			if(transform.position.x - bound.extents.x > -xLimit)
			{
				transform.position.x = xLimit - 3.3;
			}
			if(transform.position.x + bound.extents.x < xLimit)
			{
				transform.position.x = -xLimit + 3.3;
			}
			if(transform.position.y - bound.extents.y > -yLimit)
			{
				transform.position.y = yLimit - 3.3;
			}
			if(transform.position.y + bound.extents.y < yLimit)
			{
				transform.position.y = -yLimit + 3.3;
			}
			
			cameraVelocity = Vector2.Lerp(cameraVelocity,Vector2.zero,Time.deltaTime * 2.5);
			break;
		case MapStatus.Confirmation:
			showTicket();
			break;
		case MapStatus.Menu:
			fade.renderer.material.color.a = Mathf.MoveTowards(fade.renderer.material.color.a, .4, Time.deltaTime);
			break;
		default:
			break;
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
		if(text.transform.name == "Title2" || text.transform.name == "Shadow2")
		{
			text.text = Camera.main.GetComponent(Master).worldNameLine2;
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