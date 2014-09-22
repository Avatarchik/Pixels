#pragma strict

var text:GameObject[];
var currentText:String;
var buttonOn:Sprite;
var buttonOff:Sprite;

function Start () {
	
}

function Clicked() {
	GetComponentInParent(WorldMenuManager).MenuEffect(currentText);
}

function SetText(newText:String) {
	currentText = newText;
	for(var i:int = 0; i < text.length; i++)
	{
		text[i].GetComponent(TextMesh).text = currentText;
	}
	if(currentText == "Sound" || currentText == "Music")
	{
		gameObject.GetComponent(ButtonSquare).down = null;
		gameObject.GetComponent(ButtonSquare).up = null;
	}
	if((currentText == "Sound" && PlayerPrefs.GetInt("Sound") == 0) || (currentText == "Music" && PlayerPrefs.GetInt("Music") == 0))
	{
		GetComponent(SpriteRenderer).sprite = buttonOff;
	}
	else
	{
		GetComponent(SpriteRenderer).sprite = buttonOn;
	}
}