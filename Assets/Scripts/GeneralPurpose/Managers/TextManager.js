#pragma strict

public enum RecordType{None,Left,Center,Right,MusicTiming,Background};
public enum SideChange{None,MouthStates,Speaking,Flipped,Frown,SpriteType,Phonemes,ClearMouth};
public enum Phoneme{type1,type2,type3,type4,type5};
public enum LookDirection{Left,Right};

var automatic:boolean;
var notification:boolean = false;
var lines:Line[];

@HideInInspector var lineLength:int;
@HideInInspector  var numberOfLines:int;
@HideInInspector var spriteObjects:GameObject[];
@HideInInspector var currentBackground:GameObject;
@HideInInspector var finished:boolean;

var song:AudioClip;
var background:SpriteRenderer;
@HideInInspector var currentBackgroundColor:Color;
var options:RecordOptions;
@HideInInspector var backgroundChangeSpeed:float;

static var leftSpriteNumber:int;
static var rightSpriteNumber:int;

@HideInInspector var lineMarker:int;
@HideInInspector var currentDialogue:Array;
@HideInInspector var numberOfLetters:int;
@HideInInspector var current:int;
@HideInInspector var doneLine:boolean;

@HideInInspector var newColor:Color;

var credits:CreditsInfo;

function Awake () {
	finished = false;
}
function Start () {
	if(Application.loadedLevelName == "LyricsTest" || Application.loadedLevelName == "MicroGameLauncher")
	{
		Credits();
	}
	// Initialize variable values.
	spriteObjects = new GameObject[3];
	lineMarker = 0;
	numberOfLetters = 0;
	current = 0;
	doneLine = false;
	PlayerManager.speed = 1000000;
	lineLength = 16;
	if(notification)
	{
		lineLength = 18;
	}
	numberOfLines = 3;
	leftSpriteNumber = 0;
	rightSpriteNumber = 0;
	backgroundChangeSpeed = 0;
	Master.inCutscene = true;
	
	if(song!=null)
	{
		AudioManager.StopSong();
		if(Application.loadedLevelName == "TitleScreen")
		{
			AudioManager.PlaySong(song);
		}
		else
		{
			AudioManager.PlayCutscene(song);
		}
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
		Master.inCutscene = false;
	}
	if(options.pushLines)
	{
		var newArray:Line[];
		newArray = new Line[lines.length+1];
	}
	if(options.rebalance)
	{
		for(i = 0; i < lines.length; i++)
		{
			if(options.pushLines)
			{
				if(i > options.whichLine)
				{
					newArray[i] = lines[i-1];
				}
				else
				{
					newArray[i] = lines[i];
				}
			}
			lines[i].targetTime += options.difference;
			for(var y:int = 0; y < lines[i].leftSide.mouth.length; y++)
			{
				lines[i].leftSide.mouth[y].time += options.difference;
			}
			for(y = 0; y < lines[i].rightSide.mouth.length; y++)
			{
				lines[i].rightSide.mouth[y].time += options.difference;
			}
			for(y = 0; y < lines[i].center.mouth.length; y++)
			{
				lines[i].center.mouth[y].time += options.difference;
			}
			for(y = 0; y < lines[i].background.mouth.length; y++)
			{
				lines[i].background.mouth[y].time += options.difference;
			}
		}
		if(options.pushLines)
		{
			newArray[newArray.Length-1] = lines[lines.Length-1];
			lines = newArray;
		}
	}
	if(options.recordingType != RecordType.None)
	{
		for(i = 0; i < lines.length; i++)
		{
			if(options.recordingType == RecordType.Left && options.toChange == SideChange.MouthStates)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					lines[i].leftSide.mouth = new MouthState[0];
				}
				if(options.toChange == SideChange.Speaking)
				{
					lines[lineMarker].leftSide.isSpeaking = false;
				}
				if(options.toChange == SideChange.Flipped)
				{
					lines[lineMarker].leftSide.flip = false;
				}
			}
			if(options.recordingType == RecordType.Center && options.toChange == SideChange.MouthStates)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					lines[i].center.mouth = new MouthState[0];
				}
				if(options.toChange == SideChange.Speaking)
				{
					lines[lineMarker].center.isSpeaking = false;
				}
				if(options.toChange == SideChange.Flipped)
				{
					lines[lineMarker].center.flip = false;
				}
			}
			if(options.recordingType == RecordType.Right && options.toChange == SideChange.MouthStates)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					lines[i].rightSide.mouth = new MouthState[0];
				}
				if(options.toChange == SideChange.Speaking)
				{
					lines[lineMarker].rightSide.isSpeaking = false;
				}
				if(options.toChange == SideChange.Flipped)
				{
					lines[lineMarker].rightSide.flip = false;
				}
			}
			if(options.recordingType == RecordType.Background && options.toChange == SideChange.MouthStates)
			{
				lines[i].background.mouth = new MouthState[0];
			}
			if(options.recordingType == RecordType.MusicTiming)
			{
				lines[i].targetTime = 1000;
			}
		}
		Record();
	}
	else
	{
		MouthShape(0,false);
		MouthShape(1,false);
		MouthShape(2,false);
		MouthShape(0,true);
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
	
	background.color.r = Mathf.MoveTowards(background.color.r,newColor.r,Time.deltaTime * speed * (1 + backgroundChangeSpeed));
	background.color.g = Mathf.MoveTowards(background.color.g,newColor.g,Time.deltaTime * speed * (1 + backgroundChangeSpeed));
	background.color.b = Mathf.MoveTowards(background.color.b,newColor.b,Time.deltaTime * speed * (1 + backgroundChangeSpeed));
	background.color.a = Mathf.MoveTowards(background.color.a,newColor.a,Time.deltaTime * speed * (1 + backgroundChangeSpeed));
}

// Recording function for mouth movement.
function Record () {
	while(true)
	{
		if(Input.GetKeyDown("space"))
		{
			if(options.recordingType == RecordType.Left)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(spriteObjects[0],1,Phoneme.type1);
					lines[lineMarker].leftSide.mouth = ChangeMouthValue(lines[lineMarker].leftSide.mouth,1);
				}
				if(options.toChange == SideChange.Speaking)
				{
					lines[lineMarker].leftSide.isSpeaking = true;
					spriteObjects[0].transform.position.y += 1;
				}
				if(options.toChange == SideChange.Flipped)
				{
					lines[lineMarker].leftSide.flip = !lines[lineMarker].leftSide.flip;
					if(spriteObjects[0].transform.tag == "Player")
					{
						spriteObjects[0].GetComponent(AnimationManager).flipped = -1;
					}
					spriteObjects[0].transform.localScale.x = Mathf.Abs(spriteObjects[0].transform.localScale.x) * -1;
				}
				if(options.toChange == SideChange.ClearMouth)
				{
					lines[lineMarker].leftSide.mouth = new MouthState[0];
				}
				if(options.toChange == SideChange.Frown)
				{
					lines[lineMarker].leftSide.frown = true;
					spriteObjects[0].BroadcastMessage("Frown",true,SendMessageOptions.DontRequireReceiver);
				}
			}
			if(options.recordingType == RecordType.Center)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(spriteObjects[2],1,Phoneme.type1);
					lines[lineMarker].center.mouth = ChangeMouthValue(lines[lineMarker].center.mouth,1);
				}
				if(options.toChange == SideChange.Speaking)
				{
					lines[lineMarker].center.isSpeaking = true;
					spriteObjects[2].transform.position.y += 1;
				}
				if(options.toChange == SideChange.Flipped)
				{
					lines[lineMarker].center.flip = !lines[lineMarker].center.flip;
					if(spriteObjects[2].transform.tag == "Player")
					{
						spriteObjects[2].GetComponent(AnimationManager).flipped = -1;
					}
					spriteObjects[2].transform.localScale.x = Mathf.Abs(spriteObjects[2].transform.localScale.x) * -1;
				}
				if(options.toChange == SideChange.ClearMouth)
				{
					lines[lineMarker].center.mouth = new MouthState[0];
				}
				if(options.toChange == SideChange.Frown)
				{
					lines[lineMarker].center.frown = true;
					spriteObjects[2].BroadcastMessage("Frown",true,SendMessageOptions.DontRequireReceiver);
				}
			}
			if(options.recordingType == RecordType.Right)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(spriteObjects[1],1,Phoneme.type1);
					lines[lineMarker].rightSide.mouth = ChangeMouthValue(lines[lineMarker].rightSide.mouth,1);
				}
				if(options.toChange == SideChange.Speaking)
				{
					lines[lineMarker].rightSide.isSpeaking = true;
					spriteObjects[1].transform.position.y += 1;
				}
				if(options.toChange == SideChange.Flipped)
				{
					lines[lineMarker].rightSide.flip = !lines[lineMarker].rightSide.flip;
					if(spriteObjects[1].transform.tag == "Player")
					{
						spriteObjects[1].GetComponent(AnimationManager).flipped = -1;
					}
					spriteObjects[1].transform.localScale.x = Mathf.Abs(spriteObjects[1].transform.localScale.x) * -1;
				}
				if(options.toChange == SideChange.ClearMouth)
				{
					lines[lineMarker].rightSide.mouth = new MouthState[0];
				}
				if(options.toChange == SideChange.Frown)
				{
					lines[lineMarker].rightSide.frown = true;
					spriteObjects[1].BroadcastMessage("Frown",true,SendMessageOptions.DontRequireReceiver);
				}
			}
			if(options.recordingType == RecordType.Background)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(currentBackground,1,Phoneme.type1);
					lines[lineMarker].background.mouth = ChangeMouthValue(lines[lineMarker].background.mouth,1);
				}
			}
			if(options.recordingType == RecordType.MusicTiming)
			{
				lines[lineMarker].targetTime = AudioManager.GetLocation();
				CountDown(lines[lineMarker].targetTime);
			}
		}
		else if(Input.GetKeyUp("space"))
		{
			if(options.recordingType == RecordType.Left)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(spriteObjects[0],0,Phoneme.type1);
					lines[lineMarker].leftSide.mouth = ChangeMouthValue(lines[lineMarker].leftSide.mouth,0);
				}
			}
			if(options.recordingType == RecordType.Center)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(spriteObjects[2],0,Phoneme.type1);
					lines[lineMarker].center.mouth = ChangeMouthValue(lines[lineMarker].center.mouth,0);
				}
			}
			if(options.recordingType == RecordType.Right)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(spriteObjects[1],0,Phoneme.type1);
					lines[lineMarker].rightSide.mouth = ChangeMouthValue(lines[lineMarker].rightSide.mouth,0);
				}
			}
			if(options.recordingType == RecordType.Background)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(currentBackground,0,Phoneme.type1);
					lines[lineMarker].background.mouth = ChangeMouthValue(lines[lineMarker].background.mouth,0);
				}
			}
		}
		if((Input.GetKeyDown(KeyCode.LeftShift) && Input.GetKey("space")))
		{
			if(options.recordingType == RecordType.Left)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(spriteObjects[0],2,Phoneme.type1);
					lines[lineMarker].leftSide.mouth = ChangeMouthValue(lines[lineMarker].leftSide.mouth,2);
				}
			}
			if(options.recordingType == RecordType.Center)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(spriteObjects[2],2,Phoneme.type1);
					lines[lineMarker].center.mouth = ChangeMouthValue(lines[lineMarker].center.mouth,2);
				}
			}
			if(options.recordingType == RecordType.Right)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(spriteObjects[1],2,Phoneme.type1);
					lines[lineMarker].rightSide.mouth = ChangeMouthValue(lines[lineMarker].rightSide.mouth,2);
				}
			}
			if(options.recordingType == RecordType.Background)
			{
				if(options.toChange == SideChange.MouthStates)
				{
					SetSprite(currentBackground,2,Phoneme.type1);
					lines[lineMarker].background.mouth = ChangeMouthValue(lines[lineMarker].background.mouth,2);
				}
			}
		}
		if(options.toChange == SideChange.SpriteType)
		{
			var newSpriteType:int = -1;
			if(Input.GetKeyDown("0"))
			{
				newSpriteType = 0;
			}
			if(Input.GetKeyDown("1"))
			{
				newSpriteType = 1;
			}
			if(Input.GetKeyDown("2"))
			{
				newSpriteType = 2;
			}
			if(Input.GetKeyDown("3"))
			{
				newSpriteType = 3;
			}
			if(Input.GetKeyDown("4"))
			{
				newSpriteType = 4;
			}
			if(Input.GetKeyDown("5"))
			{
				newSpriteType = 5;
			}
			if(Input.GetKeyDown("6"))
			{
				newSpriteType = 6;
			}
			if(Input.GetKeyDown("7"))
			{
				newSpriteType = 7;
			}
			if(Input.GetKeyDown("8"))
			{
				newSpriteType = 8;
			}
			if(Input.GetKeyDown("9"))
			{
				newSpriteType = 9;
			}
			if(newSpriteType >= 0)
			{
				if(options.recordingType == RecordType.Left)
				{
					lines[lineMarker].leftSide.spriteType = newSpriteType;
					spriteObjects[0].BroadcastMessage("SpriteChange",newSpriteType,SendMessageOptions.DontRequireReceiver);
				}
				if(options.recordingType == RecordType.Center)
				{
					lines[lineMarker].center.spriteType = newSpriteType;
					spriteObjects[2].BroadcastMessage("SpriteChange",newSpriteType,SendMessageOptions.DontRequireReceiver);
				}
				if(options.recordingType == RecordType.Right)
				{
					lines[lineMarker].rightSide.spriteType = newSpriteType;
					spriteObjects[1].BroadcastMessage("SpriteChange",newSpriteType,SendMessageOptions.DontRequireReceiver);
				}
			}
		}
		yield;
	}
}

function SetSprite (object:GameObject,spriteSetNumber:int,phoneme:Phoneme) {
	if(object != null)
	{
		object.BroadcastMessage("SetSongSprite",spriteSetNumber,SendMessageOptions.DontRequireReceiver);
		object.BroadcastMessage("PhonemeState",phoneme,SendMessageOptions.DontRequireReceiver);
		object.BroadcastMessage("MouthState",spriteSetNumber,SendMessageOptions.DontRequireReceiver);
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
function MouthShape(position:int,isBackground:boolean) {
	var movementMarker:int = 0;
	var currentLine:int = 0;
	while(true)
	{
		if(currentLine != lineMarker)
		{
			movementMarker = 0;
			currentLine = lineMarker;
		}
		if(isBackground)
		{
			if(lines[currentLine].background.mouth.length > movementMarker)
			{
				while(AudioManager.GetLocation() < lines[currentLine].background.mouth[movementMarker].time)
				{
					yield;
				}
				if(lines[currentLine].background.mouth.length > movementMarker)
				{
					SetSprite(currentBackground,lines[currentLine].background.mouth[movementMarker].sprite,lines[currentLine].background.mouth[movementMarker].phoneme);
				}
				movementMarker++;
			}
		}
		else
		{
			if(position == 0 && lines[currentLine].leftSide.mouth.length > movementMarker)
			{
				while(AudioManager.GetLocation() < lines[currentLine].leftSide.mouth[movementMarker].time)
				{
					yield;
				}
				if(lines[currentLine].leftSide.mouth.length > movementMarker)
				{
					SetSprite(spriteObjects[0],lines[currentLine].leftSide.mouth[movementMarker].sprite,lines[currentLine].leftSide.mouth[movementMarker].phoneme);
				}
				movementMarker++;
			}
			else if (position == 1 && lines[currentLine].rightSide.mouth.length > movementMarker)
			{
				while(AudioManager.GetLocation() + 0.015 < lines[currentLine].rightSide.mouth[movementMarker].time)
				{
					yield;
				}
				if(lines[currentLine].rightSide.mouth.length > movementMarker)
				{
					SetSprite(spriteObjects[1],lines[currentLine].rightSide.mouth[movementMarker].sprite,lines[currentLine].rightSide.mouth[movementMarker].phoneme);
				}
				movementMarker ++;
			}
			else if (position == 2 && lines[currentLine].center.mouth.length > movementMarker)
			{
				while(AudioManager.GetLocation() + 0.015 < lines[currentLine].center.mouth[movementMarker].time)
				{
					yield;
				}
				if(lines[currentLine].center.mouth.length > movementMarker)
				{
					SetSprite(spriteObjects[2],lines[currentLine].center.mouth[movementMarker].sprite,lines[currentLine].center.mouth[movementMarker].phoneme);
				}
				movementMarker ++;
			}
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
			if(!automatic)
			{
				Destroy(gameObject);
				Master.inCutscene = false;
			}	
		}
		if(transform.position.x == 30 && options.recordingType == RecordType.None && !options.rebalance)
		{
			Destroy(gameObject);
			Master.inCutscene = false;
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
		}
		else if(data.empty)
		{
			KillObject(spriteObjects[spritePosition]);
		}
		if(spriteObjects[spritePosition] != null)
		{
			spriteObjects[spritePosition].BroadcastMessage("SpriteChange",data.spriteType,SendMessageOptions.DontRequireReceiver);
			spriteObjects[spritePosition].BroadcastMessage("Frown",data.frown,SendMessageOptions.DontRequireReceiver);
			spriteObjects[spritePosition].BroadcastMessage("Cutscene",SendMessageOptions.DontRequireReceiver);
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
			if(lines.length >= lineMarker && spriteObjects[spritePosition].transform.tag == "Player")
			{
				if(data.state == PlayerState.StandingFront)
				{
					spriteObjects[spritePosition].GetComponent(PlayerManager).currentState = PlayerState.Cutscene;	
				}
				else
				{
					spriteObjects[spritePosition].GetComponent(PlayerManager).currentState = data.state;
				}
			}
		}
		
		var xPosition:float;
		var zPosition:float;
		switch(spritePosition)
		{
			case 0:
				xPosition = -6; 
				zPosition = transform.position.z+1;
				break;
			case 1:
				xPosition = 6;
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
	backgroundChangeSpeed = data.backgroundChangeMultiplier;
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
		if(automatic)
		{
			yield;
		}
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
	if(text.Length > marker + lineLength && options.recordingType == RecordType.None && !options.rebalance)
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
	if(text.Length > marker + lineLength + 1 && options.recordingType == RecordType.None && !options.rebalance)
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
	if(Application.loadedLevelName == "TitleScreen" && !notification)
	{
		AudioManager.StopSong();
	}
	else
	{
		AudioManager.EndCutscene();
	}
	finished = true;
}

function Next () {
	NextLine();
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
	var frown:boolean;
	var mouth:MouthState[];
	var spriteType:int;
	var state:PlayerState;
	var isSpeaking:boolean;
	var empty:boolean;
}

class Background {
	var object:GameObject;
	var position:Vector3;
	var scaleMultiplier:Vector3 = Vector3(0,0,0);
	var specialDirection:String;
	var backgroundChangeMultiplier:float;
	var mouth:MouthState[];
}
class MouthState {
	var time:float;
	var sprite:int;
	var phoneme:Phoneme;
}

class RecordOptions {
	var recordingType:RecordType;
	var toChange:SideChange;
	var rebalance:boolean;
	var difference:float;
	var pushLines:boolean;
	var whichLine:int;
}

class CreditsInfo {
	@HideInInspector var creditObject:GameObject;
	@HideInInspector var topVertical:Vector3;
	@HideInInspector var bottomVertical:Vector3;
	@HideInInspector var topHorizontal:Vector3;
	@HideInInspector var bottomHorizontal:Vector3;
	@HideInInspector var text:TextMesh;
	@HideInInspector var distanceProgress:float;
	@HideInInspector var currentTop:Vector3;
	@HideInInspector var currentBottom:Vector3;
	var waitTime:float = 1;
	var credits:String[];
}

function Credits () {
	if(transform.Find("Credits") != null)
	{
		credits.creditObject = transform.Find("Credits").gameObject;
		credits.text = credits.creditObject.transform.Find("CreditsText").GetComponent(TextMesh);
	}
	if(Master.device == "16:9")
	{
		credits.topVertical = Vector3(14.5,11.8,-.1);
		credits.bottomVertical = Vector3(14.5,9.5,-.1);
		credits.topHorizontal = Vector3(7.74,4.8,-.1);
		credits.bottomHorizontal = Vector3(7.74,2.5,-.1);
	}
	else if(Master.device == "4:3")
	{
		credits.topVertical = Vector3(11.7,11.8,-.1);
		credits.bottomVertical = Vector3(11.7,9.7,-.1);
		credits.topHorizontal = Vector3(7.74,7.8,-.1);
		credits.bottomHorizontal = Vector3(7.74,5.7,-.1);
	}
	else
	{
		credits.topVertical = Vector3(14.5,11.8,-.1);
		credits.bottomVertical = Vector3(14.5,9.7,-.1);
		credits.topHorizontal = Vector3(7.74,4.8,-.1);
		credits.bottomHorizontal = Vector3(7.74,2.7,-.1);
	}
	credits.currentTop = credits.topVertical;
	credits.currentBottom = credits.bottomVertical;
	credits.distanceProgress = 0;
	CreditsMovement();
	while(AudioManager.GetLocation() < credits.waitTime || AudioManager.GetLocation() > credits.waitTime + 1)
	{
		yield;
	}
	for(var i:int = 0; i < credits.credits.length; i ++)
	{
		if(credits.credits[i].Length > 27)
		{
			credits.text.characterSize = 0.044;
		}
		else if(credits.credits[i].Length > 22)
		{
			credits.text.characterSize = 0.048;
		}
		else
		{
			credits.text.characterSize = 0.052;
		}
		credits.text.text = credits.credits[i];
		while(credits.distanceProgress != 1)
		{
			credits.distanceProgress = Mathf.MoveTowards(credits.distanceProgress,1,Time.deltaTime * 4 * Time.timeScale);
			yield;
		}
		var counter:float = 1.4;
		while(counter > 0)
		{
			counter -= Time.deltaTime * Time.timeScale;
			yield;
		}
	}
	while(credits.distanceProgress != 0)
	{
		credits.distanceProgress = Mathf.MoveTowards(credits.distanceProgress,0,Time.deltaTime * 4 * Time.timeScale);
		yield;
	}
}

function CreditsMovement () {
	while(credits.creditObject != null)
	{
		if(Master.vertical)
		{
			credits.currentTop = credits.topVertical;
			credits.currentBottom = credits.bottomVertical;
		}
		else
		{
			credits.currentTop = credits.topHorizontal;
			credits.currentBottom = credits.bottomHorizontal;
		}
		credits.creditObject.transform.localPosition = Vector3.Lerp(credits.currentTop,credits.currentBottom,credits.distanceProgress);
		yield;
	}
}

////////////////////////////////////////////////////////////////////////////////////////
// Instructions for recording:
// Choose which side, background, or other option.
// Choose what's being changed about them.
// When "mouthstates" bar opens mouth, holding shift while space is pressed opens mouth further.
// When "music timing," space bar determines when to cut to the next line.
// When "speakers," space bar determines when the selected character is speaking.
// When "flipped", space bar determines when the selected character is flipped.
// 
// 
// 
// 
// 
// 
////////////////////////////////////////////////////////////////////////////////////////