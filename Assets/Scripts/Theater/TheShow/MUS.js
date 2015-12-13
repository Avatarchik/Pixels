#pragma strict

var hitTimes:float[];

var lightSprites:Sprite[];
var lightColors:Color[];

var stageLights:SpriteRenderer;
var stageLightGlow:SpriteRenderer;

var smokeMachine:ParticleSystem;

var flyOvers:GameObject[];


function Start () {
	Gameplay();
}

function Update () {
	if(Input.GetKeyDown("a"))
	{
		hitTimes = AddNumber(hitTimes,ShowManager.currentMusicLocation);
	}
}
function Gameplay () {
	for(var i:int = 0; i < hitTimes.length; i++)
	{
		while(ShowManager.currentMusicLocation < hitTimes[i])
		{
			yield;
		}
		smokeMachine.emissionRate = 40;
		smokeMachine.startSpeed = 9;
		stageLights.color.a = 1;
		stageLightGlow.color.a = 1;
		LightChange();
		if(Random.value > .75)
		{
			FlyOver();
		}
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

function AddNumber (original:float[],addition:float):float[] {
	var finalArray:float[] = new float[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function LightChange () {
	var newNumber:int = Random.Range(0,lightSprites.length);
	stageLights.sprite = lightSprites[newNumber];
	stageLightGlow.color = lightColors[newNumber];
}

function FlyOver () {
	Instantiate(flyOvers[Random.Range(0,flyOvers.length)]);
}