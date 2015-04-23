#pragma strict

var skipProgress:int;
var skipCounter:float;
static var returning:boolean;


var transition:GameObject;
var transitionToTitle:AudioClip;

var sprites:Sprite[];

function Start () {
	skipProgress = 0;
	skipCounter = 1.5;
	returning = false;
}

function Update () {
	switch(skipProgress)
	{	
		case 0:	
			GetComponent(ButtonRectangle).up = sprites[0];
			GetComponent(ButtonRectangle).down = sprites[1];
			skipCounter = 1.5;
			break;
		case 1:
			GetComponent(ButtonRectangle).up = sprites[2];
			GetComponent(ButtonRectangle).down = sprites[3];
			skipCounter -= Time.deltaTime;
			break;
		case 2:
			GetComponent(ButtonRectangle).up = sprites[2];
			GetComponent(ButtonRectangle).down = sprites[3];
			if(!returning)
			{
				returning = true;
				ReturnToWorld();
			}
			break;
	}
	if(skipCounter < 0)
	{
		skipProgress --;
		GetComponent(ButtonRectangle).up = sprites[0];
		GetComponent(ButtonRectangle).down = sprites[1];
		GetComponent(SpriteRenderer).sprite = sprites[0];
	}
}

function ReturnToWorld () {
	Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
	AudioManager.PlaySoundTransition(transitionToTitle);
	yield WaitForSeconds(.7);
	AudioManager.StopSong();
	yield WaitForSeconds(1);
	Application.LoadLevel("TitleScreen");
}

function Clicked () {
	skipProgress ++;
	if(skipProgress > 0)
	{
		GetComponent(ButtonRectangle).up = sprites[2];
		GetComponent(SpriteRenderer).sprite = sprites[2];
	}
}