#pragma strict

var allowMovement:boolean = true;
enum MovementType{Basic,Follow,Linear,Radial};
var movement:MovementType;

//Linear Movement Variables
var linearVertex1:Vector3;
var linearVertex2:Vector3;
var lastLoc:Vector2;

//Follow Movement Variables
var followSpeed:float;
var constant:boolean;

//All Input Variables
var fingerRange:float;
var importantFinger:int;
var moveAmount:Vector3;
var immediate:boolean;

function Start () {
	if(followSpeed == null) { followSpeed = 1; }
	if(constant == 	null) { constant = true; }
	if(lastLoc == null) { lastLoc = Vector2.zero; }
	if(fingerRange == null) { fingerRange = 2; }
	if(immediate == null) { immediate = true; }
	importantFinger = -1;
	moveAmount = Vector3.zero;
}

function Update () {
	if(allowMovement)
	{
		if(importantFinger == -1)
		{
			for(var i:int = 0; i < Finger.identity.length; i++)
			{
				if(Finger.GetExists(i) && Vector2.Distance(Vector2(transform.position.x,transform.position.y),Finger.GetPosition(i)) < fingerRange && Vector2.Distance(Vector2(transform.position.x,transform.position.y),Finger.GetPosition(i)) > 0)
				{
					lastLoc = Finger.GetPosition(i);
					importantFinger = i;
					break;
				}
			}
		}
		else
		{
			// Movement based on type of object.
			switch (movement)
			{
				case MovementType.Basic:
					immediate = true;
					moveAmount = Vector3(Finger.GetPosition(importantFinger).x,Finger.GetPosition(importantFinger).y,0)-Vector3(transform.position.x, transform.position.y,0);
					break;
				case MovementType.Follow:
					immediate = false;
					moveAmount = Vector3(Finger.GetPosition(importantFinger).x,Finger.GetPosition(importantFinger).y,0)-Vector3(transform.position.x, transform.position.y,0);
					break;
				case MovementType.Linear:
					immediate = true;
					moveAmount = Vector3.Project(Vector3((Finger.GetPosition(importantFinger)-lastLoc).x,(Finger.GetPosition(importantFinger)-lastLoc).y,0),(linearVertex1-linearVertex2));
					lastLoc = Finger.GetPosition(importantFinger);
					break;
				case MovementType.Radial:
					immediate = true;
					break;
				default:
					break;
			}
			
			if(immediate)
			{
				transform.position += Vector3(moveAmount.x,moveAmount.y,0);	
			}
			else
			{
				if(constant)
				{
					transform.position = Vector3.MoveTowards(transform.position,Vector3(moveAmount.x,moveAmount.y,0),Time.deltaTime * followSpeed);
				}
				else
				{
					transform.position = Vector3.Lerp(transform.position,Vector3(moveAmount.x,moveAmount.y,0),Time.deltaTime * followSpeed);
				}
			}
			if(!Finger.GetExists(importantFinger))
			{
				importantFinger = -1;
			}
		}
	}
}