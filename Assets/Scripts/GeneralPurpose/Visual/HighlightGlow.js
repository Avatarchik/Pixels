#pragma strict

var sprite:SpriteRenderer;

function Start () {
	sprite = GetComponent(SpriteRenderer);
}

function Update () {
	sprite.color.a =  Mathf.Abs(Mathf.Sin(Time.time)/1.5) + .3;
}