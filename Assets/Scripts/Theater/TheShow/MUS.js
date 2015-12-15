#pragma strict

var hitTimes:float[];

var lightSprites:Sprite[];
var lightColors:Color[];

var stageLights:SpriteRenderer;
var stageLightGlow:SpriteRenderer;

var smokeMachine:ParticleSystem;

var flyOvers:GameObject[];

var hitButtonPrefab:GameObject;

var deskContentsHolder:GameObject;

@HideInInspector var hitButtons:GameObject[];
@HideInInspector var hitButtonBeatNumbers:int[];
@HideInInspector var hitButtonTop:boolean[];

@HideInInspector var startLocationY:float[];
@HideInInspector var leftSide:float;
@HideInInspector var rightSide:float;
@HideInInspector var showLocationZ:float;
@HideInInspector var hideLocationZ:float;

@HideInInspector var noteSpeed:float;

@HideInInspector var lastLightNumber:float;

function Start () {
	startLocationY = new float[2];
	startLocationY = [-0.079,-0.291];
	leftSide = -.48;
	rightSide = .79;
	showLocationZ = -.01;
	hideLocationZ = 10;
	lastLightNumber = 0;
	noteSpeed = 1;
	CreateNotes();
	Gameplay();
}

function Update () {	
	for(var i:int = 0; i < hitButtons.length; i++)
	{
		hitButtons[i].transform.localPosition.x = leftSide + noteSpeed * (hitTimes[hitButtonBeatNumbers[i]] - ShowManager.currentMusicLocation);
		if(hitButtons[i].transform.localPosition.x > leftSide && hitButtons[i].transform.localPosition.x < rightSide)
		{
			hitButtons[i].GetComponent(SpriteRenderer).color.a = 1;
		}
		else
		{
			hitButtons[i].GetComponent(SpriteRenderer).color.a = 0;
		}
	}
	if(Input.GetKeyDown("a"))
	{
		hitTimes = AddNumber(hitTimes,ShowManager.currentMusicLocation);
	}
}

function CreateNotes () {
	for(var i:int = 3; i < hitTimes.length; i ++)
	{
		if(Random.value < .8)
		{
			hitButtons = AddObject(hitButtons, Instantiate(hitButtonPrefab));
			hitButtonBeatNumbers = AddNumber(hitButtonBeatNumbers,i);
			hitButtonTop = AddBoolean(hitButtonTop,true);
		}
		if(Random.value < .3)
		{
			hitButtons = AddObject(hitButtons, Instantiate(hitButtonPrefab));
			hitButtonBeatNumbers = AddNumber(hitButtonBeatNumbers,i);
			hitButtonTop = AddBoolean(hitButtonTop,false);
		}
	}
	for(i = 0; i < hitButtons.length; i++)
	{
		hitButtons[i].transform.parent = deskContentsHolder.transform;
		hitButtons[i].transform.localPosition.z = showLocationZ;
		if(hitButtonTop[i])
		{
			hitButtons[i].transform.localPosition.y = startLocationY[0];
			hitButtons[i].GetComponent(SpriteRenderer).color = Color.red;
		}
		else
		{
			hitButtons[i].transform.localPosition.y = startLocationY[1];
			hitButtons[i].GetComponent(SpriteRenderer).color = Color.blue;
		}
		hitButtons[i].transform.localScale = Vector3(1,1,1);
	}
}
function Gameplay () {
	var marker:int = 0;
	for(var i:int = 0; i < hitTimes.length; i++)
	{
		while(ShowManager.currentMusicLocation < hitTimes[i])
		{
			yield;
		}
		while(marker < hitButtonBeatNumbers.Length && hitButtonBeatNumbers[marker] == i)
		{
			if(hitButtonTop[marker])
			{
				LightChange();
			}
			else
			{
				FlyOver();
			}
			marker++;
		}
		smokeMachine.emissionRate = 40;
		smokeMachine.startSpeed = 9;
		stageLights.color.a = 1;
		stageLightGlow.color.a = 1;
	}
	smokeMachine.emissionRate = 10;
	smokeMachine.startSpeed = 3;
	while(stageLights.color.a != 0 || stageLightGlow.color.a != 0)
	{
		stageLights.color.a = Mathf.MoveTowards(stageLights.color.a,0,Time.deltaTime * .5);
		stageLightGlow.color.a = Mathf.MoveTowards(stageLightGlow.color.a,0,Time.deltaTime * .5);
		yield;
	}
}

function AddNumber (original:int[],addition:int):int[] {
	var finalArray:int[] = new int[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function AddNumber (original:float[],addition:float):float[] {
	var finalArray:float[] = new float[original.length+1];
	for(var y:float = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function AddBoolean (original:boolean[],addition:boolean):boolean[] {
	var finalArray:boolean[] = new boolean[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function AddObject (original:GameObject[],addition:GameObject):GameObject[] {
	var finalArray:GameObject[] = new GameObject[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function LightChange () {
	var randomizer:int = 0;
	var newNumber:int = Random.Range(0,lightSprites.length);
	while(newNumber == lastLightNumber && randomizer < 30)
	{
		newNumber = Random.Range(0,lightSprites.length);
		randomizer ++;
	}
	lastLightNumber = newNumber;
	stageLights.sprite = lightSprites[newNumber];
	stageLightGlow.color = lightColors[newNumber];
}

function FlyOver () {
	Instantiate(flyOvers[Random.Range(0,flyOvers.length)]);
}