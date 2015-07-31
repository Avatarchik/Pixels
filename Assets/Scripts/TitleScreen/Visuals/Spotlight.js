#pragma strict

var goal:float;

function Start () {
	goal = 0;
	GetComponent(SpriteRenderer).color.a = 0;
	Turn();
}

function Update () {
	GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,goal,Time.deltaTime * .3);
}

function Turn () { 
	while(AudioManager.GetLocation() < 2.2)
	{
		yield;
	}
	goal = .6;
	GetComponent(SpriteRenderer).color.a = .6;
	while(true)
	{
		yield WaitForSeconds(Random.Range(5,13.4));
		if(GetComponent(SpriteRenderer).color.a < .8)
		{
			goal = 1;
		}
		else
		{
			goal = .6;
		}
		yield;
	}
}
