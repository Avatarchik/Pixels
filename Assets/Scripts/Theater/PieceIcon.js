#pragma strict

var sprites:Sprite[];

function Start () {

}

function Update () {
	GetComponent(SpriteRenderer).sprite = sprites[PlayerPrefs.GetInt(TheaterCustomizeManager.pieceName+"Selection")];
}