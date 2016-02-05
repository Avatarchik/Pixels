#pragma strict

@HideInInspector var leftNotifierHorizontal:Transform;
@HideInInspector var rightNotifierHorizontal:Transform;

@HideInInspector var leftNotifierVertical:Transform;
@HideInInspector var rightNotifierVertical:Transform;

@HideInInspector var leftLimit:float;
@HideInInspector var rightLimit:float;

var worldMapObject:Transform;
function Start () {
	if(PlayerPrefs.GetInt("PackingPeanutFactoryUnlocks") > 1 || worldMapObject == null)
	{
		Destroy(gameObject);
	}
	leftLimit = 68;
	rightLimit = -130;
	for(var child:Transform in gameObject.GetComponentsInChildren(Transform))
	{
		if(child.name == "RightHorizontal")
		{
			rightNotifierHorizontal = child;
		}
		if(child.name == "LeftHorizontal")
		{
			leftNotifierHorizontal = child;
		}
		if(child.name == "RightVertical")
		{
			rightNotifierVertical = child;
		}
		if(child.name == "LeftVertical")
		{
			leftNotifierVertical = child;
		}
	}
}

function Update () {
	if(worldMapObject.position.x > leftLimit || PlayerPrefs.GetInt("PackingPeanutFactoryFirstOpeningPlayed") == 0)
	{
		leftNotifierHorizontal.GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(leftNotifierHorizontal.GetComponent(SpriteRenderer).color.a,0,Time.deltaTime);
		leftNotifierVertical.GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(leftNotifierVertical.GetComponent(SpriteRenderer).color.a,0,Time.deltaTime);
	}
	else
	{
		leftNotifierHorizontal.GetComponent(SpriteRenderer).color.a =  Mathf.Abs(Mathf.Sin(Time.time)/1.5) + .1;
		leftNotifierVertical.GetComponent(SpriteRenderer).color.a =  Mathf.Abs(Mathf.Sin(Time.time)/1.5) + .1;
	}
	if(worldMapObject.position.x < rightLimit || PlayerPrefs.GetInt("PackingPeanutFactoryFirstOpeningPlayed") == 0)
	{
		rightNotifierHorizontal.GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(rightNotifierHorizontal.GetComponent(SpriteRenderer).color.a,0,Time.deltaTime);
		rightNotifierVertical.GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(rightNotifierVertical.GetComponent(SpriteRenderer).color.a,0,Time.deltaTime);
	}
	else
	{
		rightNotifierHorizontal.GetComponent(SpriteRenderer).color.a =  Mathf.Abs(Mathf.Sin(Time.time)/1.5) + .1;
		rightNotifierVertical.GetComponent(SpriteRenderer).color.a =  Mathf.Abs(Mathf.Sin(Time.time)/1.5) + .1;
	}
}