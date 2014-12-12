#pragma strict

var sprite:GameObject[];
var currentText:String;
var buttonOn:Sprite;
var buttonOff:Sprite;

var facebookSprite:Sprite;
var musicSprite:Sprite;
var soundSprite:Sprite;
var backSprite:Sprite;
var titleSprite:Sprite;
var continueSprite:Sprite;
var optionsSprite:Sprite;

function Start () {
	
}

function Clicked() {
	GetComponentInParent(WorldMenuManager).MenuEffect(currentText);
}

function SetText(newText:String) {
	currentText = newText;
	for(var i:int = 0; i < sprite.length; i++)
	{
		switch(currentText)
		{
			case "Facebook":
				sprite[i].GetComponent(SpriteRenderer).sprite = facebookSprite;
				break;
			case "Music":
				sprite[i].GetComponent(SpriteRenderer).sprite = musicSprite;
				break;
			case "Sound":
				sprite[i].GetComponent(SpriteRenderer).sprite = soundSprite;
				break;
			case "Back":
				sprite[i].GetComponent(SpriteRenderer).sprite = backSprite;
				break;
			case "Title Screen":
				sprite[i].GetComponent(SpriteRenderer).sprite = titleSprite;
				break;
			case "Continue":
				sprite[i].GetComponent(SpriteRenderer).sprite = continueSprite;
				break;
			case "Options":
				sprite[i].GetComponent(SpriteRenderer).sprite = optionsSprite;
				break;
			default:
				break;
		}
	}
	if(currentText == "Sound" || currentText == "Music")
	{
		if(gameObject.GetComponent(ButtonSquare) != null)
		{
			gameObject.GetComponent(ButtonSquare).down = null;
			gameObject.GetComponent(ButtonSquare).up = null;
		}
		else if(gameObject.GetComponent(ButtonRectangle) != null)
		{
			gameObject.GetComponent(ButtonRectangle).down = null;
			gameObject.GetComponent(ButtonRectangle).up = null;
		}
	}
	if((currentText == "Sound" && PlayerPrefs.GetInt("Sound") == 0) || (currentText == "Music" && PlayerPrefs.GetInt("Music") == 0))
	{
		sprite[0].transform.localPosition = Vector3(-.045,-.025,-.1);
		GetComponent(SpriteRenderer).sprite = buttonOff;
	}
	else
	{
		sprite[0].transform.localPosition = Vector3(0,.02,-.1);
		GetComponent(SpriteRenderer).sprite = buttonOn;
	}
}