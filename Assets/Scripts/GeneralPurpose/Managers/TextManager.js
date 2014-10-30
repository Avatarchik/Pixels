#pragma strict

var dialogue:String[];
var targetTimes:float[];
var textTypeSpeed:float = 1;
var automatic:boolean;
var finished:boolean;

var lineLength:int;
var numberOfLines:int;


var dialogueMarker:int;
var currentDialogue:Array;

var numberOfLetters:int;
var current:int;

function Start () {
	dialogueMarker = 0;
	numberOfLetters = 0;
	current = 0;
	finished = false;
	while(transform.position.x < -7.74)
	{
		//transform.position.x = Mathf.Lerp(transform.position.x,-7,Time.deltaTime*1);
		transform.position.x = Mathf.MoveTowards(transform.position.x,-7.74,Time.deltaTime*30);
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
	StartCoroutine(UpdateSet());
}

// Updates the shown text. This should be edited if the TextMesh object is not attached to the same
// object as this script, or if 
function UpdateSet () {
	while(true)
	{
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
			transform.position.x = Mathf.MoveTowards(transform.position.x,12.26,Time.deltaTime*30);
		}
		if(transform.position.x == 12.26)
		{
			Destroy(gameObject);
		}
		yield;
	}
	yield;
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
	while(numberOfLetters < currentDialogue[current].ToString().Length)
	{
		if(numberOfLetters > 0)
		{
			if(targetTimes == null || targetTimes.Length != dialogue.Length)
			{
				switch(currentDialogue[current].ToString()[numberOfLetters-1])
				{
					case ".":
						yield WaitForSeconds(.46);
						break;
					case "!":
						yield WaitForSeconds(.46);
						break;
					case "?":
						yield WaitForSeconds(.46);
						break;
					case ",":
						yield WaitForSeconds(.25);
						break;
					case ";":
						yield WaitForSeconds(.25);
						break;
					default:
						break;
				}
			}
		}
		if(targetTimes != null && targetTimes.Length == dialogue.Length)
		{
			if(dialogueMarker!=0)
			{
				yield WaitForSeconds((targetTimes[dialogueMarker]-targetTimes[dialogueMarker-1]) / ((dialogue[dialogueMarker].Length-5) * 2));
			}
			else
			{
				yield WaitForSeconds(targetTimes[dialogueMarker] / (dialogue[dialogueMarker].Length));
			}
		}
		else
		{
			yield WaitForSeconds(.04 / textTypeSpeed);
		}
		numberOfLetters++;
		yield;
	}
	if(automatic)
	{
		if(targetTimes != null && targetTimes.Length == dialogue.Length)
		{
			if(dialogueMarker!=0)
			{
				yield WaitForSeconds(2 * (targetTimes[dialogueMarker]-targetTimes[dialogueMarker-1]) / (dialogue[dialogueMarker].Length+1));
			}
			else
			{
				yield WaitForSeconds(2 * targetTimes[dialogueMarker] / (dialogue[dialogueMarker].Length+1));
			}
		}
		else
		{
			yield WaitForSeconds(.5);
		}
		NextLine();
	}
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