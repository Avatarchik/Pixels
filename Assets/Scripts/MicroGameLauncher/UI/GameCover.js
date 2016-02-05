#pragma strict

var origin:Vector3;
var destination:Vector3;

var clearSprite:Sprite;
var successSprite:Sprite;
var failureSprite:Sprite;

var displayObject:SpriteRenderer;

var randomize:boolean = false;;

function Awake () {
	if(randomize)
	{
		origin = transform.position;
		destination.z = transform.position.z;
		if(Random.value < .5)
		{
			destination.x = Random.Range(-9,9);
			if(Random.value < .5)
			{
				destination.y = 20;
			}
			else
			{
				destination.y = -20;
			}
		}
		else
		{
			destination.y = Random.Range(-9,9);
			if(Random.value < .5)
			{
				destination.x = 20;
			}
			else
			{
				destination.x = -20;
			}
		}
	}
}

function DisplayChange (status:String) { 
	if(displayObject != null)
	{
		switch(status)
		{
			case "Clear":
				displayObject.sprite = clearSprite;
				break;
			case "Success":
				displayObject.sprite = successSprite;
				break;
			case "Failure":
				displayObject.sprite = failureSprite;
				break;
			case "Controls":
				displayObject.sprite = GameManager.instructionType;
				break;
		}
	}
}