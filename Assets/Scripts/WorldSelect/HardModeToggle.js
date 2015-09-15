#pragma strict

var upSprite:Sprite;
var downSprite:Sprite;
var subText:GameObject;
var subTextOrigin:float;

var warningNote:GameObject;

function Start () {
	subTextOrigin = subText.transform.localPosition.y;
}

function UpdateVisuals (reset:boolean) {
	if(reset)
	{
		GetComponent(SpriteRenderer).sprite = upSprite;
		subText.transform.localPosition.y = subTextOrigin;
	}
	if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"BeatEndPlayed") != 1)
	{
		GetComponent(SpriteRenderer).color = Color(.7,.7,.7,1);
	}
	else
	{
		GetComponent(SpriteRenderer).color = Color(1,.35,.35,1);
	}
}

function Clicked () {
	if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"End4Played") == 1)
	{
		if(Master.hardMode)
		{
			Master.hardMode = false;
			GetComponent(SpriteRenderer).sprite = upSprite;
			subText.transform.localPosition.y = subTextOrigin;
		}
		else
		{
			Master.hardMode = true;
			GetComponent(SpriteRenderer).sprite = downSprite;
			subText.transform.localPosition.y = subTextOrigin - .02;
		}
	}
	else
	{
		Debug.Log("hey");
		WorldMapManager.currentNotification = Instantiate(warningNote);
		WorldMapManager.currentState = MapStatus.Notification;
	}
}