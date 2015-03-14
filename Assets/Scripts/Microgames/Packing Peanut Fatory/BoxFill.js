#pragma strict

var speed:int;
var difficulty:int;
var finished:boolean;

var boxPrefab:GameObject;
var peanutBundlePrefab:GameObject;

var boxes:GameObject[];
var peanuts:GameObject[];
var peanutsTarget:float[];
var peanutsFree:int[];
var currentPeanut:int;
var injector:GameObject;

var boxSpeed:float;

var progress:int;
var goal:int;

var length:float;


function Start () {
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
	boxSpeed = Time.deltaTime * (speed * 3 + 5);
	length = Mathf.Abs(boxes[boxes.length-1].transform.position.x-3)/(speed * 3 + 5);	
	UITimer.currentTarget = length;
	UITimer.counter = 0;
}

function Update () {
	Debug.Log(speed);
	if(Input.GetKeyDown("space"))
	{
		Clicked();
	}
	for(var i:int = 0; i < peanuts.Length; i++)
	{
		if(peanutsFree[i] == 0)
		{
			peanuts[i].transform.position.y = Mathf.MoveTowards(peanuts[i].transform.position.y, peanutsTarget[i], Time.deltaTime * 15);
		}
		else if(peanutsFree[i] == 1)
		{
			peanuts[i].transform.position.y -= Time.deltaTime * 22;
		}
		else if(peanutsFree[i] == 2)
		{
			peanuts[i].transform.position = Vector3.MoveTowards(peanuts[i].transform.position,Vector3(peanuts[i].transform.parent.transform.position.x,peanuts[i].transform.parent.transform.position.y, peanuts[i].transform.position.z), Time.deltaTime*10);
		}
	}
	for(var y:int = 0; y < boxes.Length; y++)
	{
		boxes[y].transform.position.x += boxSpeed;
		for(var x:int = 0; x < peanuts.Length; x++)
		{
			if(peanuts[x].transform.position.y < -2.5 && peanuts[x].transform.position.y > -3.3 && Mathf.Abs(boxes[y].transform.position.x) < 1.8)
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