#pragma strict

var talkSounds:AudioClip[];

static var talkWait:float;

function Awake () {
	talkWait = 0;
}

function Update () {
	talkWait -= Time.deltaTime;
	if(talkWait > 0)
	{
		GetComponent(SpriteRenderer).sprite = GetComponent(ButtonRectangle).down;
		GetComponent(SpriteRenderer).color = Color32(172,0,112,255);
		GetComponent(ButtonRectangle).subText.transform.position = transform.position - (GetComponent(ButtonRectangle).textOffset * 10) - Vector3(0,0,.1);;
		GetComponent(ButtonRectangle).subText.GetComponent(SpriteRenderer).color = Color.gray;
	}
	else
	{
		GetComponent(SpriteRenderer).sprite = GetComponent(ButtonRectangle).up;
		GetComponent(SpriteRenderer).color = Color32(232,55,172,255);
		GetComponent(ButtonRectangle).subText.transform.position = transform.position - Vector3(0,0,.1);
		GetComponent(ButtonRectangle).subText.GetComponent(SpriteRenderer).color = Color.white;
	}
}

function Clicked () {
	if(talkWait < 0)
	{
		var tempVar:int = Random.Range(0,talkSounds.length);
		AudioManager.PlaySound(talkSounds[tempVar]);
		talkWait= talkSounds[tempVar].length;
	}
}