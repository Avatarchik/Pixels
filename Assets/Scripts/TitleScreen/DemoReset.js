#pragma strict

function Start () {
	if(!Master.demo)
	{
		Destroy(gameObject);
	}
}

function Clicked () {
	Master.counter = 0;
}