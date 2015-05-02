#pragma strict

static var newColor:Color;

function Start () {

}

function Update () {
	GetComponent(SpriteRenderer).color = Color.Lerp(GetComponent(SpriteRenderer).color,newColor,Time.deltaTime * 6);
}