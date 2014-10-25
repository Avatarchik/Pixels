#pragma strict

var dialogue:String[];
var textTypeSpeed:float = 1;
var automatic:boolean;

var lineLength:int;
var numberOfLines:int;


var dialogueMarker:int;
var currentDialogue:Array;

var numberOfLetters:int;
var current:int;

function Start () {
	lineLength = 20;
	numberOfLines = 3;
	dialogueMarker = 0;
	numberOfLetters = 0;
	current = 0;
	
	if(dialogue[dialogueMarker] != null)
	{
		for(var i = 0; i < dialogue.Length; i++)
		{
			dialogue[i] = Format(dialogue[i],lineLength);
		}
		currentDialogue = BoxCut(dialogue[dialogueMarker],numberOfLines);
	}
	IncreaseLetters();
}

// Updates the shown text. This should be edited if the TextMesh object is not attached to the same
// object as this script, or if 
function Update () {
	if(numberOfLetters < currentDialogue[current].ToString().Length)
	{
		GetComponent(TextMesh).text = currentDialogue[current].ToString().Remove(numberOfLetters);
	}
	else 
	{
		GetComponent(TextMesh).text = currentDialogue[current].ToString();
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
		IncreaseLetters();
		dialogueMarker++;
	}
}

// This, when used as a coroutine, continuously increases the current displayed letter depending on what letter
// was just drawn. Punctuation has different "wait" times, which can be edited below. This produces a sort of
// typing-as-you-read effect as was used in older games. All values are multiplied by the "textTypeSpeed"
// value that can be set in the editor or above.
function IncreaseLetters () {
	while(numberOfLetters < currentDialogue[current].ToString().Length)
	{
		if(numberOfLetters > 0)
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
		yield WaitForSeconds(.04 / textTypeSpeed);
		numberOfLetters++;
		yield;
	}
	if(automatic)
	{
		yield WaitForSeconds(.30);
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

// BoxCut function takes a string of text that has been formatted with the Format function
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