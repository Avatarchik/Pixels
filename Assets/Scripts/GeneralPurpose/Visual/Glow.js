#pragma strict

@HideInInspector var sprite:SpriteRenderer;
@HideInInspector var randomness:float;

@HideInInspector var enabled:boolean = true;

function Start () {
	sprite = GetComponent(SpriteRenderer);
	randomness = Random.Range(0,.99);
	if(Application.loadedLevelName != "MicroGameLauncher")
	{
		Glow();
	}
}

function Glow () {
	while(true)
	{
		sprite.color.a = .8 + Mathf.Sin(Time.time + randomness)/6;
		yield;
	}
}