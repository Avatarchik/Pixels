#pragma strict

var start:Vector2;
var goal:Vector2;
var finish:Vector2;

@HideInInspector var done:boolean;

@HideInInspector var speed:float;

function Start () {
	done = false;
	speed = 2.5;
	transform.position.x = start.x;
	transform.position.y = start.y;
}

function Update () {
	if(TitleManager.currentState == TitleStatus.Intro && !done)
	{
		transform.position.x = Mathf.MoveTowards(transform.position.x,goal.x,speed * Time.deltaTime);
		transform.position.y = Mathf.MoveTowards(transform.position.y,goal.y,speed * Time.deltaTime);
		transform.position.x = Mathf.Lerp(transform.position.x,goal.x,speed * .75 * Time.deltaTime);
		transform.position.y = Mathf.Lerp(transform.position.y,goal.y,speed * .75 * Time.deltaTime);
	}
	else
	{
		if(done)
		{
			transform.position.x = Mathf.MoveTowards(transform.position.x,finish.x,speed/.7 * Time.deltaTime);
			transform.position.y = Mathf.MoveTowards(transform.position.y,finish.y,speed/.7 * Time.deltaTime);
			transform.position.x = Mathf.Lerp(transform.position.x,finish.x,speed/3.5 * Time.deltaTime);
			transform.position.y = Mathf.Lerp(transform.position.y,finish.y,speed/3.5 * Time.deltaTime);
		}
		else
		{
			transform.position.x = Mathf.MoveTowards(transform.position.x,finish.x,speed * Time.deltaTime);
			transform.position.y = Mathf.MoveTowards(transform.position.y,finish.y,speed * Time.deltaTime);
			transform.position.x = Mathf.Lerp(transform.position.x,finish.x,speed/2 * Time.deltaTime);
			transform.position.y = Mathf.Lerp(transform.position.y,finish.y,speed/2 * Time.deltaTime);
		}
		if(transform.position.x == finish.x && transform.position.y == finish.y)
		{
			Destroy(gameObject);
		}
	}
}