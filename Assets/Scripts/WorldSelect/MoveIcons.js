#pragma strict

@HideInInspector var leftNotifier:Transform;
@HideInInspector var rightNotifier:Transform;

var leftLimit:float;
var rightLimit:float;

var worldMapObject:Transform;
function Start () {
	if(PlayerPrefs.GetInt("PackingPeanutFactoryUnlocks") > 0 || worldMapObject == null)
	{
		Destroy(gameObject);
	}
	leftLimit = 21;
	rightLimit = -21;
	for(var child:Transform in gameObject.GetComponentsInChildren(Transform))
	{
		if(child.name == "Right")
		{
			rightNotifier = child;
		}
		if(child.name == "Left")
		{
			leftNotifier = child;
		}
	}
}

function Update () {
	if(worldMapObject.position.x > leftLimit)
	{
		leftNotifier.GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(leftNotifier.GetComponent(SpriteRenderer).color.a,0,Time.deltaTime);
	}
	else
	{
		leftNotifier.GetComponent(SpriteRenderer).color.a =  Mathf.Abs(Mathf.Sin(Time.time)/1.5) + .1;
	}
	if(worldMapObject.position.x < rightLimit)
	{
		rightNotifier.GetComponent(SpriteRenderer).color.a = Mathf.MoveTowards(rightNotifier.GetComponent(SpriteRenderer).color.a,0,Time.deltaTime);
	}
	else
	{
		rightNotifier.GetComponent(SpriteRenderer).color.a =  Mathf.Abs(Mathf.Sin(Time.time)/1.5) + .1;
	}
}