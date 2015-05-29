#pragma strict

@HideInInspector var sprite:SpriteRenderer;

var speed:float = 1.5;
var amount:float = .3;

function Start () {
	sprite = GetComponent(SpriteRenderer);
}

function Update () {
	sprite.color.a =  Mathf.Abs(Mathf.Sin(Time.time)/speed) + amount;
}