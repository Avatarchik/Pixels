#pragma strict

@HideInInspector var sprite:SpriteRenderer;

function Start () {
	sprite = GetComponent(SpriteRenderer);
	if(TimeManager.state == TimeState.NightNormal || TimeManager.state == TimeState.NightEvil)
	{
		//sprite.enabled = true;
	}
	else
	{
		sprite.enabled = false;
	}
}

function Update () {
	
}