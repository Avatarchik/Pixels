#pragma strict

var automatic:boolean;
var lines:Line[];

@HideInInspector var lineLength:int;
@HideInInspector  var numberOfLines:int;
@HideInInspector var spriteObjects:GameObject[];
@HideInInspector var finished:boolean;

var song:AudioClip;
var background:SpriteRenderer;
@HideInInspector var currentBackgroundColor:Color;
var record:boolean = false;

static var leftSpriteNumber:int;
static var rightSpriteNumber:int;

@HideInInspector var lineMarker:int;
@HideInInspector var currentDialogue:Array;
@HideInInspector var numberOfLetters:int;
@HideInInspector var current:int;
@HideInInspector var doneLine:boolean;

function Start () {
	// Initialize variable values.
	spriteObjects = new GameObject[2];
	lineMarker = 0;
	numberOfLetters = 0;
	current = 0;
	finished = false;
	doneLine = false;
	PlayerManager.speed = 1000000;
	lineLength = 16;
	numberOfLines = 3;
	leftSpriteNumber = 0;
	leftSpriteNumber = 0;
	
	if(song!=null)
	{
		AudioManager.StopSong();
		AudioManager.PlayCutscene(song);
	}
	
	
	// Get the text box into place.
	while(transform.position.x < -7.74)
	{
		transform.position.x = Mathf.MoveTowards(transform.position.x,-7.74,Time.deltaTime*60);
		yield;
	}
	
	// Destroy if empty; otherwise, start the dialogue routine.
	if(lines.Length!=0)
	{
		for(var i = 0; i < lines.Length; i++)
		{
			lines[i].dialogue = Format(lines[i].dialogue,lineLength);
		}
		currentDialogue = BoxCut(lines[lineMarker].dialogue,numberOfLines);
		IncreaseLetters();
	}
	else
	{
		Destroy(gameObject);
	}
	if(record)
	{
		for(i = 0; i < lines.length; i++)
		{
			lines[i].leftMouth = new MouthState[0];
			lines[i].rightMouth = new MouthState[0];
		}
		Record();
	}
	else
	{
		MouthShape(true);
		MouthShape(false);
	}
	UpdateSprites(lineMarker);
	ChangeColor(false);
	StartCoroutine(UpdateSet());
}

function KillObject(object:GameObject)
{
	Destroy(object);
}
function Update () {
}

// Recording function for mouth movement.
function Record () {
	while(true)
	{
		if(Input.GetKeyDown("space"))
		{
			SetSprite(spriteObjects[0],1);
			SetSprite(spriteObjects[1],1);
			lines[lineMarker].leftMouth = ChangeMouthValue(lines[lineMarker].leftMouth,1);
			lines[lineMarker].rightMouth = ChangeMouthValue(lines[lineMarker].rightMouth,1);
		}
		else if(Input.GetKeyUp("space"))
		{
			SetSprite(spriteObjects[0],0);
			SetSprite(spriteObjects[1],0);
			lines[lineMarker].leftMouth = ChangeMouthValue(lines[lineMarker].leftMouth,0);
			lines[lineMarker].rightMouth = ChangeMouthValue(lines[lineMarker].rightMouth,0);
		}
		if((Input.GetKeyDown("x") && Input.GetKey("space")) || Input.GetKeyDown("c"))
		{
			SetSprite(spriteObjects[0],2);
			SetSprite(spriteObjects[1],2);
			lines[lineMarker].leftMouth = ChangeMouthValue(lines[lineMarker].leftMouth,2);
			lines[lineMarker].rightMouth = ChangeMouthValue(lines[lineMarker].rightMouth,2);
		}
		yield;
	}
}

function SetSprite (object:GameObject,spriteSetNumber:int) {
	if(object != null)
	{
		object.SendMessage("SetSongSprite",spriteSetNumber,SendMessageOptions.DontRequireReceiver);
	}
}
function ChangeMouthValue(mouthArray:MouthState[],spriteValue:int):MouthState[] {
		var tempArray:MouthState[] = mouthArray;
		mouthArray = new MouthState[mouthArray.length + 1];
		mouthArray[mouthArray.length-1] = new MouthState();
		for(var i:int = 0; i < tempArray.length; i++)
		{
			mouthArray[i] = tempArray[i];
		}
		mouthArray[mouthArray.length-1].time = AudioManager.GetLocation();
		mouthArray[mouthArray.length-1].sprite = spriteValue;
		return mouthArray;
}

// Changes the sprites mouths if there is mouth change information.
function MouthShape(left:boolean) {
	var movementMarker:int = 0;
	var currentLine:int = 0;
	while(true)
	{
		if(currentLine != lineMarker)
		{
			movementMarker = 0;
			currentLine = lineMarker;
		}
		if(left && lines[currentLine].leftMouth.length > movementMarker)
		{
			while(AudioManager.GetLocation() < lines[currentLine].leftMouth[movementMarker].time)
			{
				yield;
			}
			if(lines[currentLine].leftMouth.length > movementMarker && spriteObjects[0] != null)
			{
				SetSprite(spriteObjects[0],lines[currentLine].leftMouth[movementMarker].sprite);
			}
			movementMarker++;
		}
		else if (!left && lines[currentLine].rightMouth.length > movementMarker)
		{
			while(AudioManager.GetLocation() < lines[currentLine].rightMouth[movementMarker].time)
			{
				yield;
			}
			if(lines[currentLine].rightMouth.length > movementMarker && spriteObjects[1] != null)
			{
				SetSprite(spriteObjects[1],lines[currentLine].rightMouth[movementMarker].sprite);
			}
			movementMarker ++;
		}
		
		yield;
	}
}

// Updates the shown text. This should be edited if the TextMesh object is not attached to the same
// object as this script.
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
			GetComponent(TextMesh).text = "";
			transform.position.x = Mathf.MoveTowards(transform.position.x,30,Time.deltaTime*60);
		}
		if(transform.position.x == 30 && !record)
		{
			Destroy(gameObject);
		}
		yield;
	}
	yield;
}

function UpdateSprites(number:int) {
	if(lines.Length >= lineMarker && spriteObjects.Length == 2 && !finished)
	{
		if(lines[number].leftSprite!=null)
		{
			if(number >= 1 && lines[number-1].leftSprite != lines[number].leftSprite)
			{
				KillObject(spriteObjects[0]);
				spriteObjects[0] = Instantiate(lines[number].leftSprite);
			}
			else if(number == 0)
			{
				spriteObjects[0] = Instantiate(lines[number].leftSprite);
			}
			
		}
		if(lines[number].rightSprite!=null)
		{
			if(number >= 1 && lines[number-1].rightSprite != lines[number].rightSprite)
			{
				KillObject(spriteObjects[1]);
				spriteObjects[1] = Instantiate(lines[number].rightSprite);
			}
			else if(number == 0)
			{
				spriteObjects[1] = Instantiate(lines[number].rightSprite);
			}
		}
		if(lines.length >= number && spriteObjects[0].transform.tag == "Player")
		{
			spriteObjects[0].GetComponent(PlayerManager).currentState = lines[number].playerState;
		}
		if(lines.length >= number && spriteObjects[1].transform.tag == "Player")
		{
			spriteObjects[1].GetComponent(PlayerManager).currentState = lines[number].playerState;
		}
		if(lines[number].currentSpeaker)
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
		ChangeColor(false);
		current++;
		numberOfLetters = 0;
		IncreaseLetters();
	}
	else if(lineMarker < lines.Length-1)
	{
		ChangeColor(false);
		current = 0;
		numberOfLetters = 0;
		lineMarker++;
		currentDialogue = BoxCut(lines[lineMarker].dialogue,numberOfLines);
		UpdateSprites(lineMarker);
		IncreaseLetters();
	}
	else if(lineMarker == lines.Length-1)
	{
		ChangeColor(true);
		finished = true;
	}
}

// This, when used as a coroutine, continuously increases the current displayed letter depending on what letter
// was just drawn. Punctuation has different "wait" times, which can be edited below. This produces a sort of
// typing-as-you-read effect as was used in older games. All values are multiplied by the "textTypeSpeed"
// value that can be set in the editor or above. If the targetTimes array is both full and the same length as
// the dialogue array, the game will try to match one up to the other (not super reliable, needs fussing.)
function IncreaseLetters () {
	StartCoroutine(CountDown(lines[lineMarker].targetTime));
	while(numberOfLetters < currentDialogue[current].ToString().Length && !doneLine)
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
	//var song:AudioClip
	while(AudioManager.GetLocation() < counter)
	{
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
	if(text.Length > marker + lineLength && !record)
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
	if(text.Length > marker + lineLength + 1 && !record)
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

function ChangeColor(finished:boolean) {
	if(finished)
	{
		
	}
	else
	{
		while(background.color != lines[lineMarker].backgroundColor.r)
		{
			background.color.r = Mathf.MoveTowards(background.color.r,lines[lineMarker].backgroundColor.r,Time.deltaTime * 2);
			background.color.g = Mathf.MoveTowards(background.color.g,lines[lineMarker].backgroundColor.g,Time.deltaTime * 2);
			background.color.b = Mathf.MoveTowards(background.color.b,lines[lineMarker].backgroundColor.b,Time.deltaTime * 2);
			background.color.a = Mathf.MoveTowards(background.color.a,lines[lineMarker].backgroundColor.a,Time.deltaTime * 2);
			yield;
		}	
	}
}

function Clicked () {
	AudioManager.EndCutscene();
	ChangeColor(true);
	finished = true;
}

class Line {
	var dialogue:String;
	var leftSprite:GameObject;
	var rightSprite:GameObject;
	var backgroundColor:Color;
	var playerState:PlayerState;
	var currentSpeaker:boolean;
	var targetTime:float;
	var leftMouth:MouthState[];
	var rightMouth:MouthState[];
}

class MouthState {
	var time:float;
	var sprite:int;
}