#pragma strict

var successSprite:Sprite;
var failSprite:Sprite;

function NotifySuccess (success:boolean) {
	if(success)
	{
		GetComponent(SpriteRenderer).sprite = successSprite;
	}
	else
	{
		GetComponent(SpriteRenderer).sprite = failSprite;
	}
	yield WaitForSeconds(1);
	GetComponent(SpriteRenderer).sprite = null;
}