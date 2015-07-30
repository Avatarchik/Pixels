#pragma strict

var goal:float;

function Start () {
	goal = .3;
	Turn();
}

function Update () {
	GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,goal,Time.deltaTime * .3);
}

function Turn () {
	while(true)
	{
		yield WaitForSeconds(Random.Range(5,13.4));
		if(GetComponent(SpriteRenderer).color.a < .65)
		{
			goal = 1;
		}
		else
		{
			goal = .3;
		}
		yield;
	}
}
