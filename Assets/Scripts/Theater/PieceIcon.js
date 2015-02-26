#pragma strict

var sprites:Sprite[];

function Start () {

}

function Update () {
	// Updates piece sprite continuously
	GetComponent(SpriteRenderer).sprite = sprites[PlayerPrefs.GetInt(TheaterCustomizeManager.pieceName+"Selection")];
}