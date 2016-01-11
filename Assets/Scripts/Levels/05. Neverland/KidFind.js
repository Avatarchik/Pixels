#pragma strict

var colorChange:boolean;
var colorForChange:Color;

@HideInInspector var importantFinger:int;

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;
@HideInInspector var length:float;
@HideInInspector var timer:float;

var lightning:GameObject;
var lightningSprites:Sprite[];

var ghostPrefab:GameObject;
var CEOPrefab:GameObject;

var CEOEasy:GameObject;

@HideInInspector var numberOfGhosts:int;
@HideInInspector var ghostZLoc:float;
@HideInInspector var ghostBottomLimit:float;
@HideInInspector var ghostTopLimit:float;
@HideInInspector var ghostLeftLimit:float;
@HideInInspector var ghostRightLimit:float;

@HideInInspector var ghosts:GameObject[];
@HideInInspector var ghostSpeed:float[];;
@HideInInspector var ceoGhost:int;

@HideInInspector var success:boolean;
@HideInInspector var failed:boolean;

@HideInInspector var ghostDistance:float;

var screen:SpriteRenderer;

var revealSprites:Sprite[];

var ghostScream:AudioClip;

function Start () {
	// Basic world variable initialization.
	importantFinger = -1;
	
	// Level specific variable initialization.
	
	// Speed and difficulty information.
	if(Application.loadedLevelName == "MicroTester")
	{
		speed = MicroTester.timeMultiplier;
		difficulty = MicroTester.difficulty;
	}
	else
	{
		speed = GameManager.speed;
		difficulty = GameManager.difficulty;
	}
	if(difficulty == 1)
	{
		CEOPrefab = CEOEasy;
	}
	length = 9;
	timer = length;
	UITimer.currentTarget = length;
	UITimer.counter = 0;
	numberOfGhosts = 5 + difficulty * 5;
	ghostZLoc = 10;
	ghostBottomLimit = -4.7;
	ghostTopLimit = -2.7;
	ghostLeftLimit = -6.5;
	ghostRightLimit = 6.5;
	screen.color.a = 0;
	ceoGhost = Random.Range(0,numberOfGhosts);
	ghosts = new GameObject[numberOfGhosts];
	ghostSpeed = new float[numberOfGhosts];
	success = false;
	failed = false;
	ghostDistance = 1.5;

	var variableSpeed:float = 2 + 2 * speed;
	for(var i:int = 0; i < numberOfGhosts;i++)
	{
		if(i==ceoGhost)
		{
			if(Random.value < .5)
			{
				ghosts[i] = Instantiate(ghostPrefab,Vector3(ghostLeftLimit,Random.Range(ghostBottomLimit,ghostTopLimit),ghostZLoc),Quaternion.identity);
				ghosts[i].transform.localScale.x *= -1;
			}
			else
			{
				ghosts[i] = Instantiate(ghostPrefab,Vector3(ghostRightLimit,Random.Range(ghostBottomLimit,ghostTopLimit),ghostZLoc),Quaternion.identity);
				ghosts[i].transform.localScale.x *= -1;
			}
		}
		else
		{
			if(Random.value < .5)
			{
				ghosts[i] = Instantiate(CEOPrefab,Vector3(ghostLeftLimit,Random.Range(ghostBottomLimit,ghostTopLimit),ghostZLoc),Quaternion.identity);
				ghosts[i].transform.localScale.x *= -1;
			}
			else
			{
				ghosts[i] = Instantiate(CEOPrefab,Vector3(ghostRightLimit,Random.Range(ghostBottomLimit,ghostTopLimit),ghostZLoc),Quaternion.identity);
				ghosts[i].transform.localScale.x *= -1;
			}
		}
		ghostSpeed[i] = Random.Range(variableSpeed * .6, variableSpeed * 1.4);
		ghosts[i].transform.parent = transform;
		GhostMovement(i);
	}	
	// If the color of the UI should change.
	if(colorChange)
	{
		StartCoroutine(ColorChange());
	}
	// If The game doesn't just run in Update.
	Play();
	Lightning();
}

function Update () {
	if(success)
	{
		ghosts[ceoGhost].transform.localScale = Vector3(.5,.5,.5);
		ghosts[ceoGhost].GetComponent(SpriteRotate).sprites = revealSprites;
		ghostSpeed[ceoGhost] = 20;
	}	
	else if(finished)
	{
		for(var thisGhost:int = 0; thisGhost < ghosts.length; thisGhost++)
		{
			if(thisGhost != ceoGhost)
			{
				if(ghosts[thisGhost].transform.localScale.y > 0)
				{
					ghosts[thisGhost].transform.localScale += Vector3(3,3,0) * Time.deltaTime;
				}
				else
				{
					ghosts[thisGhost].transform.localScale += Vector3(3,-3,0) * Time.deltaTime;
				}
			}
			else
			{
				ghosts[thisGhost].transform.position.x += 20 * Time.deltaTime;
			}
		}
	}
	screen.color.a = Mathf.MoveTowards(screen.color.a,0,Time.deltaTime * 2);
	timer -= Time.deltaTime;
	if(timer < 0 && !finished)
	{
		Finish(false,0);
	}
	// Get important finger.
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i) && Finger.GetInGame(i))
			{
				importantFinger = i;
				break;
			}
		}
	}
	// If that finger still exists and the game isn't paused, do stuff. (Always fires when finger is first touched.)
	if(Finger.GetExists(importantFinger) && !Master.paused)
	{
		if(Finger.GetPosition(importantFinger).y < 4 && Finger.GetPosition(importantFinger).y > -7)
		{
			if(Mathf.Abs(Finger.GetPosition(importantFinger).x - ghosts[ceoGhost].transform.position.x) < ghostDistance)
			{
				Finish(true,.3);
			}
			else
			{
				if(!finished)
				{
					AudioManager.PlaySound(ghostScream,.7,.5);
				}
				Finish(false,.6);
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}
	
	for(var ghost:int = 0; ghost < ghosts.length; ghost++)
	{
		if((!success || ghost == ceoGhost) && !failed)
		{
			ghosts[ghost].GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(ghosts[ghost].GetComponent(SpriteRenderer).color.a,1,Time.deltaTime * .75);
		}
		else
		{
			ghosts[ghost].GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(ghosts[ghost].GetComponent(SpriteRenderer).color.a,0,Time.deltaTime * .5);
		}
	}
}

function Play () {

}

function GhostMovement (which:int) {
	while(true)
	{
		while(Mathf.Abs(ghosts[which].transform.position.x - ghostLeftLimit) > .1)
		{
			ghosts[which].transform.position.x = Mathf.MoveTowards(ghosts[which].transform.position.x,ghostLeftLimit,Time.deltaTime * ghostSpeed[which]);
			yield;
		}
		ghosts[which].transform.localScale.x *= -1;
		while(Mathf.Abs(ghosts[which].transform.position.x - ghostRightLimit) > .1)
		{
			ghosts[which].transform.position.x = Mathf.MoveTowards(ghosts[which].transform.position.x,ghostRightLimit,Time.deltaTime * ghostSpeed[which]);
			yield;
		}
		ghosts[which].transform.localScale.x *= -1;
	}
}

function Lightning () {
	while(true)
	{
		lightning.GetComponent(SpriteRenderer).sprite = null;
		yield WaitForSeconds(length/4);
		var holder:int = 0;
		screen.color.a = 1;
		for(var ghost:int = 0; ghost < ghosts.length; ghost++)
		{
			if(ghost != ceoGhost)
			{
				ghosts[ghost].GetComponent(SpriteRenderer).color.a = 0;
			}
		}
		while(holder < lightningSprites.length)
		{
			lightning.GetComponent(SpriteRenderer).sprite = lightningSprites[holder];
			holder++;
			yield WaitForSeconds(.05);
		}
		holder = Mathf.Max(0,holder-4);
		screen.color.a = .5;
		for(ghost = 0; ghost < ghosts.length; ghost++)
		{
			if(ghost != ceoGhost)
			{
				ghosts[ghost].GetComponent(SpriteRenderer).color.a = .4;
			}
		}
		while(holder < lightningSprites.length)
		{
			lightning.GetComponent(SpriteRenderer).sprite = lightningSprites[holder];
			holder++;
			yield WaitForSeconds(.05);
		}
		yield;
	}
}

function Finish(completionStatus:boolean) {
	Finish(completionStatus,0);
}

function Finish(completionStatus:boolean,waitTime:float) {
	if(!finished)
	{
		if(completionStatus)
		{
			success = true;
		}
		else
		{
			failed = true;
		}
		finished = true;
		yield WaitForSeconds(waitTime);
		GameObject.FindGameObjectWithTag("GameController").BroadcastMessage("GameComplete",completionStatus,SendMessageOptions.DontRequireReceiver);
		if(colorChange)
		{
			GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", Color(0,0,0,0),SendMessageOptions.DontRequireReceiver);
		}
	}
}

function ColorChange () {
	while(timer > length-.5)
	{
		yield;
	}
	GameObject.FindGameObjectWithTag("WorldUI").BroadcastMessage("ChangeBackgroundColor", colorForChange,SendMessageOptions.DontRequireReceiver);
	yield;
}