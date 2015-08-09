#pragma strict

var plain:Sprite;
var logo:Sprite;

var panic:GameObject;

var lightsOut:Sprite;

@HideInInspector var origin:Vector3;

var particles:ParticleSystem;

var initialCover:GameObject;

@HideInInspector var normal:boolean;

function Start () {
	panic.GetComponent(SpriteRenderer).color.a = 0;
	panic.transform.localScale = Vector3(1.5,1.5,1.5);
	normal = true;
	GetComponent(SpriteRenderer).sprite = plain;
	origin = transform.localPosition;
	transform.localPosition.y += 1;
	HoldForIntro();
}

function HoldForIntro () {
	yield WaitForEndOfFrame;
	while(TitleManager.currentState == TitleStatus.Intro)
	{
		yield;
	}
	Show();
	StartCoroutine(Appear());
}

function Show () {
	GetComponent(SpriteRenderer).color = Color(0,0,0,1);
	while(GetComponent(SpriteRenderer).color != Color(1,1,1,1))
	{
		GetComponent(SpriteRenderer).color.r = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.r,1,Time.deltaTime*.5);
		GetComponent(SpriteRenderer).color.g = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.g,1,Time.deltaTime*.5);
		GetComponent(SpriteRenderer).color.b = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.b,1,Time.deltaTime*.5);
		yield;
	}
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
	ShrinkPanic();
	Destroy(initialCover);
	StartCoroutine(Shake(10, Vector2(0.01,.01)));
	GetComponent(SpriteRenderer).sprite = logo;
	panic.GetComponent(SpriteRenderer).color.a = 1;
	Lights();
	yield;
}

function ShrinkPanic () {
	while(panic.transform.localScale != Vector3(1,1,1))
	{
		panic.transform.localScale = Vector3.MoveTowards(panic.transform.localScale,Vector3(1,1,1),Time.deltaTime * 13);
		yield;
	}
	Destroy(panic);
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
		yield WaitForSeconds(Random.Range(14, 21.5));
		var numberOfTimes:int = Random.Range(3,8);
		if(TitleManager.currentState == TitleStatus.Home)
		{
			particles.Emit(15);
		}
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
		if(TitleManager.currentState == TitleStatus.Home)
		{
			particles.Emit(5);
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