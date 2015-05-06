#pragma strict

var heartSprites:Sprite[];

var spriteNumber:int;

function Start () {
	spriteNumber = 6 - (GameManager.lives * 3);
	GetComponent(SpriteRenderer).sprite = heartSprites[spriteNumber];
	StartCoroutine(Display());
}

function Display () {
	yield WaitForSeconds(.4);
	Shake(10,Vector2(.1,.1));
	GetComponent(SpriteRenderer).sprite = heartSprites[spriteNumber+1];
	yield WaitForSeconds(.15);
	GetComponent(SpriteRenderer).sprite = heartSprites[spriteNumber+2];
	yield WaitForSeconds(.15);
	GetComponent(SpriteRenderer).sprite = heartSprites[spriteNumber+3];
	
	yield WaitForSeconds(.5);
	Destroy(gameObject);
}

function Shake (numberShakes:int, distance:Vector2){
	var count:int = 0;
	var origin:Vector3 = transform.localPosition;
	transform.localPosition = transform.localPosition + Vector3(distance.x,distance.y,0);
	while(count < numberShakes)
	{
		transform.localPosition.x = -transform.localPosition.x * .85;
		transform.localPosition.y = -transform.localPosition.y * .85;
		yield WaitForSeconds(.004);
		count ++;
		yield;
	}
	transform.localPosition = origin;
	yield;
}