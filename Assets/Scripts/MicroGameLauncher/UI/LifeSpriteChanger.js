#pragma strict

var words:boolean;
var sprites:boolean;

var sprite:Sprite[];

function Start () {
	words = false;
	sprites = false;
	if(gameObject.GetComponent(TextMesh) != null)
	{
		words = true;
	}
	if(gameObject.GetComponent(SpriteRenderer) != null)
	{
		sprites = true;
	}
}

function LifeChange (lives:int) {
	if(sprites)
	{
		gameObject.GetComponent(SpriteRenderer).sprite = sprite[lives];
	}
	if(words)
	{
		gameObject.GetComponent(TextMesh).text = lives.ToString();
	}
}