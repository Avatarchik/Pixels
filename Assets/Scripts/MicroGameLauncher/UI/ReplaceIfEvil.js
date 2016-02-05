#pragma strict

var evilSprite:Sprite;

function Start () {
	if(PlayerPrefs.GetInt("HighSchoolBeatEndPlayed") == 1)
	{
		if(GetComponent(SpriteRenderer) != null)
		{
			GetComponent(SpriteRenderer).sprite = evilSprite;
		}
	}
}