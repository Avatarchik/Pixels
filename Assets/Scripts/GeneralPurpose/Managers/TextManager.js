#pragma strict

var automatic:boolean;
var lines:Line[];

@HideInInspector var lineLength:int;
@HideInInspector  var numberOfLines:int;
@HideInInspector var spriteObjects:GameObject[];
@HideInInspector var currentBackground:GameObject;
@HideInInspector var finished:boolean;

var song:AudioClip;
var background:SpriteRenderer;
@HideInInspector var currentBackgroundColor:Color;
var record:boolean = false;
var options:Options;

static var leftSpriteNumber:int;
static var rightSpriteNumber:int;

@HideInInspector var lineMarker:int;
@HideInInspector var currentDialogue:Array;
@HideInInspector var numberOfLetters:int;
@HideInInspector var current:int;
@HideInInspector var doneLine:boolean;

@HideInInspector var newColor:Color;

function Awake () {
	finished = false;
}
function Start () {
	// Initialize variable values.
	spriteObjects = new GameObject[3];
	lineMarker = 0;
	numberOfLetters = 0;
	current = 0;
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
			if(options.left)
			{
				lines[i].leftSide.mouth = new MouthState[0];
			}
			if(options.center)
			{
				lines[i].center.mouth = new MouthState[0];
			}
			if(options.right)
			{
				lines[i].rightSide.mouth = new MouthState[0];
			}
		}
		Record();
	}
	else
	{
		MouthShape(0);
		MouthShape(1);
		MouthShape(2);
	}

	UpdateSprites(0,lines[lineMarker].leftSide,lines[Mathf.Max(0,lineMarker-1)].leftSide);
	UpdateSprites(1,lines[lineMarker].rightSide,lines[Mathf.Max(0,lineMarker-1)].rightSide);
	UpdateSprites(2,lines[lineMarker].center,lines[Mathf.Max(0,lineMarker-1)].center);
	UpdateBackground(lines[lineMarker].background,lines[Mathf.Max(0,lineMarker-1)].background);
	StartCoroutine(UpdateSet());
}

function KillObject(object:GameObject)
{
	Destroy(object);
}
function Update () {
	var speed:float = .6;
	if(lineMarker >= 0)
	{
		newColor = lines[lineMarker].backgroundColor;
	}
	if(finished)
	{
		speed = 1.5;
		newColor = Color.clear;
	}
	
	background.color.r = Mathf.MoveTowards(background.color.r,newColor.r,Time.deltaTime * speed);
	background.color.g = Mathf.MoveTowards(background.color.g,newColor.g,Time.deltaTime * speed);
	background.color.b = Mathf.MoveTowards(background.color.b,newColor.b,Time.deltaTime * speed);
	background.color.a = Mathf.MoveTowards(background.color.a,newColor.a,Time.deltaTime * speed);
}

// Recording function for mouth movement.
function Record () {
	while(true)
	{
		if(Input.GetKeyDown("space"))
		{
			SetSprite(spriteObjects[0],1, true);
			SetSprite(spriteObjects[1],1, false);
			SetSprite(spriteObjects[2],1, false);
			
			lines[lineMarker].leftSide.mouth = ChangeMouthValue(lines[lineMarker].leftSide.mouth,1);
			lines[lineMarker].rightSide.mouth = ChangeMouthValue(lines[lineMarker].rightSide.mouth,1);
			lines[lineMarker].center.mouth = ChangeMouthValue(lines[lineMarker].center.mouth,1);
		}
		else if(Input.GetKeyUp("space"))
		{
			SetSprite(spriteObjects[0],0, true);
			SetSprite(spriteObjects[1],0, false);
			SetSprite(spriteObjects[2],0, false);
			lines[lineMarker].leftSide.mouth = ChangeMouthValue(lines[lineMarker].leftSide.mouth,0);
			lines[lineMarker].rightSide.mouth = ChangeMouthValue(lines[lineMarker].rightSide.mouth,0);
			lines[lineMarker].center.mouth = ChangeMouthValue(lines[lineMarker].center.mouth,0);
		}
		if(Input.GetKeyDown("left"))
		{
			SetSprite(spriteObjects[0],1, true);
			lines[lineMarker].leftSide.mouth = ChangeMouthValue(lines[lineMarker].leftSide.mouth,1);
		}
		else if(Input.GetKeyUp("left"))
		{
			SetSprite(spriteObjects[0],0, true);
			lines[lineMarker].leftSide.mouth = ChangeMouthValue(lines[lineMarker].leftSide.mouth,0);
		}
		if(Input.GetKeyDown("up"))
		{
			SetSprite(spriteObjects[2],1, true);
			lines[lineMarker].center.mouth = ChangeMouthValue(lines[lineMarker].center.mouth,1);
		}
		else if(Input.GetKeyUp("up"))
		{
			SetSprite(spriteObjects[2],0, true);
			lines[lineMarker].center.mouth = ChangeMouthValue(lines[lineMarker].center.mouth,0);
		}
		if(Input.GetKeyDown("right"))
		{
			SetSprite(spriteObjects[1],1, true);
			lines[lineMarker].rightSide.mouth = ChangeMouthValue(lines[lineMarker].rightSide.mouth,1);
		}
		else if(Input.GetKeyUp("right"))
		{
			SetSprite(spriteObjects[1],0, true);
			lines[lineMarker].rightSide.mouth = ChangeMouthValue(lines[lineMarker].rightSide.mouth,0);
		}
		
		if((Input.GetKeyDown("x") && Input.GetKey("space")) || Input.GetKeyDown("c"))
		{
			SetSprite(spriteObjects[0],2, true);
			SetSprite(spriteObjects[1],2, false);
			SetSprite(spriteObjects[2],2, false);
			lines[lineMarker].leftSide.mouth = ChangeMouthValue(lines[lineMarker].leftSide.mouth,2);
			lines[lineMarker].rightSide.mouth = ChangeMouthValue(lines[lineMarker].rightSide.mouth,2);
			lines[lineMarker].center.mouth = ChangeMouthValue(lines[lineMarker].center.mouth,2);
		}
		yield;
	}
}

function SetSprite (object:GameObject,spriteSetNumber:int,pass:boolean) {
	if(object != null)
	{
		object.BroadcastMessage("SetSongSprite",spriteSetNumber,SendMessageOptions.DontRequireReceiver);
	}
	if(pass && currentBackground != null)
	{
		currentBackground.BroadcastMessage("SetSongSprite",spriteSetNumber,SendMessageOptions.DontRequireReceiver);
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
function MouthShape(position:int) {
	var movementMarker:int = 0;
	var currentLine:int = 0;
	while(true)
	{
		if(currentLine != lineMarker)
		{
			movementMarker = 0;
			currentLine = lineMarker;
		}
		if(position == 0 && lines[currentLine].leftSide.mouth.length > movementMarker)
		{
			while(AudioManager.GetLocation() < lines[currentLine].leftSide.mouth[movementMarker].time)
			{
				yield;
			}
			if(lines[currentLine].leftSide.mouth.length > movementMarker)
			{
				SetSprite(spriteObjects[0],lines[currentLine].leftSide.mouth[movementMarker].sprite,lines[currentLine].leftSide.passToBackground);
			}
			movementMarker++;
		}
		else if (position == 1 && lines[currentLine].rightSide.mouth.length > movementMarker)
		{
			while(AudioManager.GetLocation() < lines[currentLine].rightSide.mouth[movementMarker].time)
			{
				yield;
			}
			if(lines[currentLine].rightSide.mouth.length > movementMarker)
			{
				SetSprite(spriteObjects[1],lines[currentLine].rightSide.mouth[movementMarker].sprite,lines[currentLine].rightSide.passToBackground);
			}
			movementMarker ++;
		}
		else if (position == 2 && lines[currentLine].center.mouth.length > movementMarker)
		{
			while(AudioManager.GetLocation() < lines[currentLine].center.mouth[movementMarker].time)
			{
				yield;
			}
			if(lines[currentLine].center.mouth.length > movementMarker)
			{
				SetSprite(spriteObjects[2],lines[currentLine].center.mouth[movementMarker].sprite,lines[currentLine].center.passToBackground);
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

function UpdateSprites(spritePosition:int, data:SideInfo,previousData:SideInfo) {
	if(lines.Length >= lineMarker && spriteObjects.Length == 3 && !finished)
	{	
		if(data.sprite != null)
		{
			if(lineMarker >= 1 && previousData.sprite != data.sprite)
			{
				KillObject(spriteObjects[spritePosition]);
				spriteObjects[spritePosition] = Instantiate(data.sprite);
			}
			else if(lineMarker == 0)
			{
				spriteObjects[spritePosition] = Instantiate(data.sprite);
			}
			if(data.flip)
			{
				if(spriteObjects[spritePosition].transform.tag == "Player")
				{
					spriteObjects[spritePosition].GetComponent(AnimationManager).flipped = -1;
				}
				spriteObjects[spritePosition].transform.localScale.x = Mathf.Abs(spriteObjects[spritePosition].transform.localScale.x) * -1;
			}
			else
			{
				spriteObjects[spritePosition].transform.localScale.x = Mathf.Abs(spriteObjects[spritePosition].transform.localScale.x);
			}
			
		}
		else if(data.empty)
		{
			KillObject(spriteObjects[spritePosition]);
		}
		if(spriteObjects[spritePosition] != null && lines.length >= lineMarker && spriteObjects[spritePosition].transform.tag == "Player")
		{
			spriteObjects[spritePosition].GetComponent(PlayerManager).currentState = data.state;
		}
		var xPosition:float;
		var zPosition:float;
		switch(spritePosition)
		{
			case 0:
				xPosition = -5; 
				zPosition = transform.position.z+1;
				break;
			case 1:
				xPosition = 5;
				zPosition = transform.position.z+1.5;
				break;
			case 2:
				xPosition = 0;
				zPosition = transform.position.z+1.25;
				break;
			break;
		}
		var yPosition:float = 0;
		if(data.isSpeaking)
		{
			yPosition+=1;
		}
		if(spriteObjects[spritePosition] != null)
		{
			spriteObjects[spritePosition].transform.position = Vector3(xPosition,yPosition,zPosition);
		}
		if(spriteObjects[spritePosition] != null)
		{
			spriteObjects[spritePosition].transform.parent = transform;
		}
	}
}

function UpdateBackground (data:Background, previousData:Background) {
	if(data.object != previousData.object)
	{
		KillObject(currentBackground);
	}
	if(data.object != null && (data.object != previousData.object || lineMarker == 0))
	{
		currentBackground = Instantiate(data.object,Vector3.zero,Quaternion.identity);
		currentBackground.transform.localScale += Vector3(data.scaleMultiplier.x,data.scaleMultiplier.y,data.scaleMultiplier.z);
		currentBackground.transform.parent = transform;
		currentBackground.transform.localPosition = data.position + Vector3(7.4,0,2.1);
	}
	if(currentBackground!= null)
	{
		currentBackground.BroadcastMessage(data.specialDirection,SendMessageOptions.DontRequireReceiver);
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
	else if(lineMarker < lines.Length-1)
	{
		current = 0;
		numberOfLetters = 0;
		lineMarker++;
		currentDialogue = BoxCut(lines[lineMarker].dialogue,numberOfLines);
		UpdateSprites(0,lines[lineMarker].leftSide,lines[lineMarker-1].leftSide);
		UpdateSprites(1,lines[lineMarker].rightSide,lines[lineMarker-1].rightSide);
		UpdateSprites(2,lines[lineMarker].center,lines[lineMarker-1].center);
		UpdateBackground(lines[lineMarker].background,lines[lineMarker-1].background);
		IncreaseLetters();
	}
	else if(lineMarker == lines.Length-1)
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

function Clicked () {
	AudioManager.EndCutscene();
	finished = true;
}

class Line {
	var dialogue:String;
	var leftSide:SideInfo;
	var center:SideInfo;
	var rightSide:SideInfo;
	var background:Background;
	var backgroundColor:Color;
	var targetTime:float;
}

class SideInfo {
	var sprite:GameObject;
	var flip:boolean;
	var mouth:MouthState[];
	var state:PlayerState;
	var isSpeaking:boolean;
	var passToBackground:boolean;
	var empty:boolean;
}

class Background {
	var object:GameObject;
	var position:Vector3;
	var scaleMultiplier:Vector3 = Vector3(0,0,0);
	var specialDirection:String;
}
class MouthState {
	var time:float;
	var sprite:int;
}

class Options {
	var left:boolean;
	var center:boolean;
	var right:boolean;
}