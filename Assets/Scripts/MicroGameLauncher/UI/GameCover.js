#pragma strict

var origin:Vector2;
var destination:Vector2;

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
				displayObject.sprite = GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).currentGames[GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).gameToLoad].GetComponent(MicroGameManager).controls;
				break;
		}
	}
}