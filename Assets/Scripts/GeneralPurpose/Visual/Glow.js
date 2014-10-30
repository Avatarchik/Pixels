#pragma strict

var sprite:SpriteRenderer;
var randomness:float;

function Start () {
	sprite = GetComponent(SpriteRenderer);
	randomness = Random.Range(0,.99);
}

function Update () {
	sprite.color.a = .8 + Mathf.Sin(Time.time + randomness)/6;
}