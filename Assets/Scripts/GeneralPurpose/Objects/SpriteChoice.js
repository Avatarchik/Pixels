#pragma strict

var sprites:Sprite[];

function Start () {

}

function Update () {
	
}

function SetSongSprite (spriteNumber:int) {
	if(spriteNumber < sprites.Length)
	{
		GetComponent(SpriteRenderer).sprite = sprites[spriteNumber];
	}
}