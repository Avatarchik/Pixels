#pragma strict

@HideInInspector var origin:float;

var destination:float;

@HideInInspector var completeness:float;

var speed:float;

function Start () {
	origin = transform.position.x;
	completeness = 0;
	speed = 9;
	AmountChange();
}

function Update () {
	//completeness = Mathf.MoveTowards(completeness,1,Time.deltaTime * .7);
	//transform.position.x = Mathf.Lerp(origin,destination,completeness);
	transform.position.x = Mathf.MoveTowards(transform.position.x,destination,Time.deltaTime * speed);
	if(transform.position.x == destination)
	{
		Destroy(gameObject);
	}
}
function AmountChange () {
	while(true)
	{
		speed = Mathf.Lerp(speed,.7,Time.deltaTime * 4.5);
		if(speed < 1)
		{
			speed = 9;
		}
		yield;
	}
}