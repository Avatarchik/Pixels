#pragma strict

@HideInInspector var sprite:SpriteRenderer;
var lights:Sprite[];

function Start () {
	sprite = GetComponent(SpriteRenderer);
}

function Update () {
}
function StartEvent (which:int) {
	sprite.color.a = 1;
	if(lights.Length > which)
	{
		sprite.sprite = lights[which];
	}
}