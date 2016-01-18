#pragma strict

function Start () {
	Blink();
}

function Update () {

}

function Blink () {
	while(true)
	{
		yield WaitForSeconds(Random.Range(.6,7.5));
		GetComponent(SpriteRenderer).color.a = 1;
		yield WaitForSeconds(Random.Range(.07,.3));
		GetComponent(SpriteRenderer).color.a = 0;
		yield;
	}
}