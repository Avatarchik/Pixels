#pragma strict

function Start () {

}

function Update () {
	// Constantly updates category icon.
	GetComponent(SpriteRenderer).sprite = TheaterCustomizeManager.pieceSprite;
}