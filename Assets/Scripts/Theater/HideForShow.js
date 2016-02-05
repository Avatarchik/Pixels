#pragma strict

function Start () {

}

function Update () {
	if(TheaterController.currentState == TheaterStatus.Show)
	{
		GetComponent(SpriteRenderer).color.a = 0;
	}
}