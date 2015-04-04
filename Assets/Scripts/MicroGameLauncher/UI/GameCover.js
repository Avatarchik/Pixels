#pragma strict

var origin:Vector3;
var destination:Vector3;

var clearSprite:Sprite;
var successSprite:Sprite;
var failureSprite:Sprite;

var displayObject:SpriteRenderer;

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