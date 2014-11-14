#pragma strict

var origin:Vector2;
var destination:Vector2;

var clearSprite:Sprite;
var successSprite:Sprite;
var failureSprite:Sprite;

function DisplayChange (status:String) { 
	if(GetComponentInChildren(SpriteRenderer)!= null)
	{
		switch(status)
		{
			case "Clear":
				GetComponentInChildren(SpriteRenderer).sprite = clearSprite;
				break;
			case "Success":
				GetComponentInChildren(SpriteRenderer).sprite = successSprite;
				break;
			case "Failure":
				GetComponentInChildren(SpriteRenderer).sprite = failureSprite;
				break;
			case "Controls":
				GetComponentInChildren(SpriteRenderer).sprite = GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).currentGames[GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).gameToLoad].GetComponent(MicroGameManager).controls;
				break;
		}
	}
}