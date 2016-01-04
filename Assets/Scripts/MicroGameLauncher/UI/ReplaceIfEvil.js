#pragma strict

var evilSprite:Sprite;

function Start () {
	if(PlayerPrefs.GetInt("HighSchoolBeatEndPlayed") == 1)
	{
		GetComponent(SpriteRenderer).sprite = evilSprite;
	}
}