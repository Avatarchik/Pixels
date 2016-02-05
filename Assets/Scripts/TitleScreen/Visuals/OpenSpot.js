#pragma strict

function Start () {
}

function Update () {
	if(TitleManager.started)
	{
		GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(GetComponent(SpriteRenderer).color.a,0,Time.deltaTime * .5);
		if(GetComponent(SpriteRenderer).color.a == 0)
		{
			Destroy(gameObject);
		}
	}
}