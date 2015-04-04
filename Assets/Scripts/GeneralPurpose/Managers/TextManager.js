#pragma strict

var dialogue:String[];
var leftSprites:GameObject[];
var rightSprites:GameObject[];
var playerState:PlayerState[];
var currentSpeaker:boolean[];
private var spriteObjects:GameObject[];

var targetTimes:float[];
var textTypeSpeed:float = 1;
var automatic:boolean;
var endCounter:int;
var finished:boolean;
var skipBox:Transform;

var lineLength:int;
var numberOfLines:int;


private var dialogueMarker:int;
private var currentDialogue:Array;

private var numberOfLetters:int;
private var current:int;

private var doneLine:boolean;

function Start () {
	//spriteObjects = new GameObject[leftSprites.length];
	spriteObjects = new GameObject[2];
	dialogueMarker = 0;
	numberOfLetters = 0;
	current = 0;
	endCounter = 0;
	finished = false;
	doneLine = false;
	while(transform.position.x < -7.74)
	{
		transform.position.x = Mathf.MoveTowards(transform.position.x,-7.74,Time.deltaTime*60);
		yield;
	}
	if(dialogue.Length!=0)
	{
		for(var i = 0; i < dialogue.Length; i++)
		{
			dialogue[i] = Format(dialogue[i],lineLength);
		}
		currentDialogue = BoxCut(dialogue[dialogueMarker],numberOfLines);
		IncreaseLetters();
	}
	else
	{
		Destroy(gameObject);
	}
	UpdateSprites(dialogueMarker);
	StartCoroutine(UpdateSet());
}

function Update () {
	//Debug.Log(Time.time);
	if(Input.GetKeyDown("space"))
	{
		Clicked();
	}
}

// Updates the shown text. This should be edited if the TextMesh object is not attached to the same
// object as this script.
function UpdateSet () {
	while(true)
	{
		// Clickable ending code.
		if(endCounter == 1)
		{
			skipBox.position.y = Mathf.MoveTowards(skipBox.transform.position.y, 14, Time.deltaTime*15);
		}
		else
		{
			skipBox.position.y = Mathf.MoveTowards(skipBox.transform.position.y, 18.5, Time.deltaTime*15);
		}
		if(endCounter >= 2)
		{
			finished = true;
		}
		if(numberOfLetters < currentDialogue[current].ToString().Length)
		{
			GetComponent(TextMesh).text = currentDialogue[current].ToString().Remove(numberOfLetters);
		}
		else 
		{
			GetComponent(TextMesh).text = currentDialogue[current].ToString();
		}
		if(finished)
		{
			GetComponent(TextMesh).text = "";
			transform.position.x = Mathf.MoveTowards(transform.position.x,30,Time.deltaTime*60);
		}
		if(transform.position.x == 30)
		{
			//AudioManager.StopSong();
			Destroy(gameObject);
		}
		yield;
	}
	yield;
}

function UpdateSprites(number:int) {
	if(leftSprites.Length >= dialogueMarker && rightSprites.Length >= dialogueMarker && spriteObjects.Length == 2 && currentSpeaker.Length >= dialogueMarker && !finished)
	{
		if(leftSprites[number]!=null)
		{
			Destroy(spriteObjects[0]);
			spriteObjects[0] = Instantiate(leftSprites[number]);
		}
		if(rightSprites[number]!=null)
		{
			Destroy(spriteObjects[1]);
			spriteObjects[1] = Instantiate(rightSprites[number]);
		}
		if(playerState.length >= number && spriteObjects[0].transform.tag == "Player")
		{
			spriteObjects[0].GetComponent(PlayerManager).currentState = playerState[number];
		}
		if(playerState.length >= number && spriteObjects[1].transform.tag == "Player")
		{
			spriteObjects[1].GetComponent(PlayerManager).currentState = playerState[number];
		}
		if(currentSpeaker[number])
		{
			spriteObjects[0].transform.position = Vector3(-4.5,0,transform.position.z+1);
			spriteObjects[1].transform.position = Vector3(4.5,1,transform.position.z+1.5);
		}
		else
		{
			spriteObjects[0].transform.position = Vector3(-4.5,1,transform.position.z+1);
			spriteObjects[1].transform.position = Vector3(4.5,0,transform.position.z+1.5);
		}
		spriteObjects[0].transform.parent = transform;
		spriteObjects[1].transform.parent = transform;
	}
	
}

// This function causes the lines of dialogue to progress, first from one "screen" to the next and then
// from one line to the next. If "automatic" is selected, this will happen at the end of every line as
// part of the IncreaseLetters() function.
function NextLine () {
	if(current < currentDialogue.length-1)
	{
		current++;
		numberOfLetters = 0;
		IncreaseLetters();
	}
	else if(dialogueMarker < dialogue.Length-1)
	{
		current = 0;
		numberOfLetters = 0;
		dialogueMarker++;
		currentDialogue = BoxCut(dialogue[dialogueMarker],numberOfLines);
		UpdateSprites(dialogueMarker);
		IncreaseLetters();
	}
	else if(dialogueMarker == dialogue.Length-1)
	{
		finished = true;
	}
}

// This, when used as a coroutine, continuously increases the current displayed letter depending on what letter
// was just drawn. Punctuation has different "wait" times, which can be edited below. This produces a sort of
// typing-as-you-read effect as was used in older games. All values are multiplied by the "textTypeSpeed"
// value that can be set in the editor or above. If the targetTimes array is both full and the same length as
// the dialogue array, the game will try to match one up to the other (not super reliable, needs fussing.)
function IncreaseLetters () {
	StartCoroutine(CountDown(targetTimes[dialogueMarker]));
	while(numberOfLetters < currentDialogue[current].ToString().Length)
	{
		//numberOfLetters = currentDialogue[current].ToString().Length;
		numberOfLetters ++;
		yield;
	}
	if(automatic)
	{		
		while(!doneLine)
		{
			yield;
		}
		doneLine = false;
		NextLine();
	}
	yield;
}

function CountDown (counter:float) {
	//Debug.Log(counter);
	while(counter > 0)
	{
		//Debug.Log(counter);
		counter -= Time.deltaTime;
		yield;
	}
	doneLine = true;
	yield;
}

// Format function takes strings of text and cuts it into lines given the specified number of characters per line.
// If for any reason you don't want the formatting to start until a certain point in the next, you can override
// the character at which the formatting begins with a third input variable.
function Format (text:String,lineLength:int):String {
	return Format(text,lineLength,0);
}
function Format (text:String,lineLength:int,marker:int):String {
	if(text.Length > marker + lineLength)
	{
		var success:boolean = false;
		for(var i:int = marker+lineLength; i > marker; i--)
		{
			if(text[i] == " ")
			{
				text = text.Insert(i,"\n");
				if(text[i+1] == " ")
				{
					text = text.Remove(i+1,1);
				}
				marker = i;
				success = true;
				break;
			}
		}
		if(!success)
		{
			text = text.Insert(marker + lineLength,"\n");
			marker += lineLength;
		}
	}
	if(text.Length > marker + lineLength + 1)
	{
		text = Format(text,lineLength,marker);
	}
	return text;
}

// BoxCut function takes a string of text that has been formatted with the Format function and splits it into "boxes" -
// chunks of lines determined based on the "numberOfLines" variable. This is useful for when text boxes can only 
// accomodate so many lines of dialogue, but the amount of dialogue is too much of a hassle to parse by hand.
function BoxCut (text:String,lines:int):Array {
	return BoxCut(text,lines,0,0);
}
function BoxCut (text:String,lines:int,curLine:int):Array {
	return BoxCut(text,lines,curLine,0);
}
function BoxCut (text:String,lines:int,curLine:int,stringNo:int):Array {
	var marker:int = 1;
	var finalStrings:Array = new Array();
	while(curLine < lines && marker > 0)
	{
		curLine++;
		marker = text.IndexOf("\n",marker+1);
	}
	if(marker >= 0)
	{
		finalStrings.Push(text.Remove(marker));
		return finalStrings.Concat(BoxCut(text.Remove(0,marker+1),lines,0,0));
	}
	else
	{
		finalStrings.Push(text);
		return finalStrings;
	}
}

function Clicked () {
	if(endCounter != 1 || skipBox.transform.position.y == 14)
	{
		endCounter ++;
		UnClick();
	}
}

function UnClick() {
	yield WaitForSeconds(3);
	endCounter --;
}