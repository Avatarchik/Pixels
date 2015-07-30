#pragma strict

var plain:Sprite;
var logo:Sprite;

var lightsOut:Sprite;

var origin:Vector3;

@HideInInspector var normal:boolean;

function Start () {
	normal = true;
	GetComponent(SpriteRenderer).sprite = plain;
	origin = transform.localPosition;
	transform.localPosition.y += 1;
	StartCoroutine(Appear());
}

function Appear () {
	while(transform.localPosition != origin)
	{
		transform.localPosition = Vector3.MoveTowards(transform.localPosition, origin, Time.time * Time.deltaTime * 3);
		yield;
	}
	StartCoroutine(Shake(10, Vector2(0,.03)));
	while(AudioManager.GetLocation() < 2.2)
	{
		yield;
	}
	StartCoroutine(Shake(10, Vector2(0.01,.01)));
	GetComponent(SpriteRenderer).sprite = logo;
	Lights();
	yield;
}

function Shake (numberShakes:int, distance:Vector2){
	var count:int = 0;
	var origin:Vector2 = transform.localPosition;
	transform.localPosition = transform.localPosition + distance;
	while(count < numberShakes)
	{
		transform.localPosition = -transform.localPosition * .85;
		yield WaitForSeconds(.004);
		count ++;
		yield;
	}
	yield;
}

function Lights () {
	while(true)
	{
		yield WaitForSeconds(Random.Range(17, 24.5));
		var numberOfTimes:int = Random.Range(3,8);
		for(var i:int = 0; i < numberOfTimes; i++)
		{
			if(normal)
			{
				normal = false;
				GetComponent(SpriteRenderer).sprite = lightsOut;
			}
			else
			{
				normal = true;
				GetComponent(SpriteRenderer).sprite = logo;
			}
			yield WaitForSeconds(Random.Range(.02,.08));
		}
		GetComponent(SpriteRenderer).sprite = lightsOut;
		yield WaitForSeconds(Random.Range(1,3.2));
		numberOfTimes = Random.Range(3,8);
		for(i = 0; i < numberOfTimes; i++)
		{
			if(normal)
			{
				normal = false;
				GetComponent(SpriteRenderer).sprite = lightsOut;
			}
			else
			{
				normal = true;
				GetComponent(SpriteRenderer).sprite = logo;
			}
			yield WaitForSeconds(Random.Range(.02,.08));
		}
		GetComponent(SpriteRenderer).sprite = logo;
		yield;
	}
}