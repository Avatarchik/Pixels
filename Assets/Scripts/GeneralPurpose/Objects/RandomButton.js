#pragma strict

var upSprites:Sprite[];
var downSprites:Sprite[];

@HideInInspector var number:int;

function Start () {
	number = Random.Range(0,upSprites.Length);
	GetComponent(ButtonRectangle).down = downSprites[number];
	GetComponent(ButtonRectangle).up = upSprites[number];
	GetComponent(SpriteRenderer).sprite = upSprites[number];
}