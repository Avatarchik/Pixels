#pragma strict

@HideInInspector var speed:int;
@HideInInspector var difficulty:int;
@HideInInspector var finished:boolean;

var boxPrefab:GameObject;
var peanutBundlePrefab:GameObject;

@HideInInspector var boxes:GameObject[];
@HideInInspector var peanuts:GameObject[];
@HideInInspector var peanutsTarget:float[];
@HideInInspector var peanutsFree:int[];
@HideInInspector var currentPeanut:int;
var injector:GameObject;

@HideInInspector var boxSpeed:float;

@HideInInspector var progress:int;
@HideInInspector var goal:int;

@HideInInspector var length:float;

@HideInInspector var clicked:boolean;

@HideInInspector var importantFinger:int;

var tutorialNotification:GameObject;

function Start () {
	importantFinger = -1;
	clicked = false;
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
	peanuts = new GameObject[2 + (difficulty * 2)];
	peanutsTarget = new float[peanuts.Length];
	peanutsFree = new int[peanuts.Length];
	currentPeanut = 0;
	boxes = new GameObject[peanuts.Length + (9 - difficulty)];
	for(var i:int = 0; i < peanuts.Length; i++)
	{
		peanuts[i] = Instantiate(peanutBundlePrefab, injector.transform.position + Vector3(Random.Range(-.2,.3),-3 + (i * 1.3),.1), Quaternion.identity);
		peanuts[i].transform.rotation.eulerAngles.z = 90 * Random.Range(0,4);
		peanutsTarget[i] = peanuts[i].transform.position.y;
		peanutsFree[i] = 0;
		peanuts[i].transform.parent = transform;
	}
	for(var y:int = 0; y < boxes.Length; y++)
	{
		boxes[y] = Instantiate(boxPrefab, transform.position - Vector3(12 + ((y * 6) + speed * 2),4.5,2), Quaternion.identity);
		boxes[y].transform.parent = transform;
	}
	progress = 0;
	goal = peanuts.Length;
	length = Mathf.Abs(boxes[boxes.length-1].transform.position.x-3)/(speed * 3 + 5);	
	UITimer.currentTarget = length;
	UITimer.counter = 0;
}

function Update () {
	if(importantFinger == -1)
	{
		clicked = false;
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			if(Finger.GetExists(i) && Finger.GetInGame(i))
			{
				importantFinger = i;
				break;
			}
		}
	}
	if(Finger.GetExists(importantFinger) && Finger.GetInGame(importantFinger))
	{
		if(Mathf.Abs(Finger.GetPosition(importantFinger).x) < 9 && Mathf.Abs(Finger.GetPosition(importantFinger).y) < 9 && !clicked)
		{
			Clicked();
			clicked = true;
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		importantFinger = -1;
	}

	boxSpeed = Time.deltaTime * (speed * 3 + 5);
	if(Input.GetKeyDown("space"))
	{
		Clicked();
	}
	for(i = 0; i < peanuts.Length; i++)
	{
		if(peanutsFree[i] == 0)
		{
			peanuts[i].transform.position.y = Mathf.MoveTowards(peanuts[i].transform.position.y, peanutsTarget[i], Time.deltaTime * 15);
		}
		else if(peanutsFree[i] == 1)
		{
			peanuts[i].transform.position.y -= Time.deltaTime * 25;
		}
		else if(peanutsFree[i] == 2)
		{
			peanuts[i].transform.position = Vector3.MoveTowards(peanuts[i].transform.position,Vector3(peanuts[i].transform.parent.transform.position.x,peanuts[i].transform.parent.transform.position.y, peanuts[i].transform.position.z), Time.deltaTime*15);
		}
	}
	for(var y:int = 0; y < boxes.Length; y++)
	{
		boxes[y].transform.position.x += boxSpeed;
		for(var x:int = 0; x < peanuts.Length; x++)
		{
			if(peanuts[x].transform.position.y < -2.5 && peanuts[x].transform.position.y > -3.4 && Mathf.Abs(boxes[y].transform.position.x) < 2)
			{
				peanuts[x].transform.parent = boxes[y].transform;
				peanutsFree[x] = 2;
			}
			else if (peanuts[x].transform.position.y < -7 && !finished)
			{
				Finish(false);
			}
		}
	}
	progress = 0;
	for(var z:int = 0; z < peanuts.Length; z++)
	{
		if(peanutsFree[z] == 2)
		{
			progress ++;
		}
	}
	if(progress >= goal && !finished)
	{
		Finish(true);
	}
	if(boxes[boxes.Length-1].transform.position.x >= 3 && !finished)
	{
		Finish(false);
	}
}

function Clicked () {
	for(var i:int = peanutsTarget.Length-1; i > 0; i--)
	{
		if(peanutsFree[i-1] != true)
		{
			peanutsTarget[i] = peanutsTarget[i-1];
		}
	}
	if(currentPeanut < peanutsFree.Length)
	{
		peanutsFree[currentPeanut] = 1;
	}
	currentPeanut++;
}

function Finish(completionStatus:boolean) {
	if(!completionStatus)
	{
		SendTutorial();
	}
	if(Application.loadedLevelName == "MicroTester")
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).GameComplete(completionStatus);
	}
	else 
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).GameComplete(completionStatus);
	}
	finished = true;
}

function SendTutorial () {
	if(PlayerPrefs.HasKey("TutorialFor:" + transform.name))
	{
		PlayerPrefs.SetInt("TutorialFor:" + transform.name,PlayerPrefs.GetInt("TutorialFor:" + transform.name) + 1);
	}
	else
	{
		PlayerPrefs.SetInt("TutorialFor:" + transform.name,1);
	}
	if((PlayerPrefs.GetInt("TutorialFor:" + transform.name) > 1) && Application.loadedLevelName == "MicroGameLauncher" && PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"BeatEndPlayed") == 0 && !Master.hardMode)
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).TurnOnNotification("Tap the Peanut Injector as the boxes pass!");
	}
}