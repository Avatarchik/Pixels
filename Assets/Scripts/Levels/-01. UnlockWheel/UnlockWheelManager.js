#pragma strict

public enum UnlockWheelStatus{Clear,Spinning,Notify};

var bigWheelPieces:SpriteRenderer[];
var smallWheelPieces:SpriteRenderer[];
var arrow:SpriteRenderer;
var arrowRestingSprite:Sprite;
var arrowSprites:Sprite[];

var winnerColor:Color;
var winnerHighlight:Color;
var specialColor:Color;
var specialHighlight:Color;
var failHighlight:Color;

@HideInInspector var currentState:UnlockWheelStatus;
@HideInInspector var bigWheelWinners:boolean[];
@HideInInspector var smallWheelWinners:boolean[];
@HideInInspector var specialSmallValues:boolean[];
@HideInInspector var normalSpots:int;
@HideInInspector var premiumSpots:int;

@HideInInspector var arrowLocation:int;

var stopButton:GameObject;
@HideInInspector var currentStopButton:GameObject;

var unlockableItems:GameObject[];

var lockedItems:GameObject[];

function Start () {
	UpdateUnlockables();
	currentState = UnlockWheelStatus.Clear;
	arrowLocation = -1;
	bigWheelWinners = new boolean[bigWheelPieces.length];
	smallWheelWinners = new boolean[smallWheelPieces.length];
	specialSmallValues = new boolean[smallWheelPieces.length];
	for(var i:int = 0; i < bigWheelWinners.length; i++)
	{
		bigWheelWinners[i] = false;
		BigSliceManager(i);
	}
	for(i = 0; i < smallWheelWinners.length; i++)
	{
		smallWheelWinners[i] = false;
		specialSmallValues[i] = false;
		SmallSliceManager(i);
	}
}

function Update () {
	if(Input.GetKeyDown("space") && currentState == UnlockWheelStatus.Clear)
	{
		Spin();
	}
	if(Input.GetKeyDown("up"))
	{
		AddBig();
	}
	if(Input.GetKeyDown("down"))
	{
		SubtractBig();
	}
	if(Input.GetKeyDown("w"))
	{
		AddSmall();
	}
	if(Input.GetKeyDown("s"))
	{
		SubtractSmall();
	}
	if(arrowLocation < 0)
	{	
		arrow.sprite = arrowRestingSprite;
	}
	else
	{
		if(arrowLocation >= 32)
		{
			arrowLocation = 0;
		}
		var spriteNumber:int = arrowLocation;
		while(spriteNumber >= 8)
		{
			spriteNumber -= 8;
		}
		arrow.sprite = arrowSprites[spriteNumber];
		if(arrowLocation < 8)
		{
			arrow.transform.rotation.eulerAngles.z = 0;
		}
		else if(arrowLocation < 16)
		{
			arrow.transform.rotation.eulerAngles.z = -90;
		}
		else if(arrowLocation < 24)
		{
			arrow.transform.rotation.eulerAngles.z = -180;
		}
		else
		{
			arrow.transform.rotation.eulerAngles.z = 90;
		}
	}
}

function BigSliceManager (slice:int) {
	var originalColor:Color = bigWheelPieces[slice].color;
	while(true)
	{
		if(bigWheelWinners[slice])
		{
			bigWheelPieces[slice].color = Color.Lerp(bigWheelPieces[slice].color,winnerColor,Time.deltaTime*6);
		}
		else
		{
			bigWheelPieces[slice].color = Color.Lerp(bigWheelPieces[slice].color,originalColor,Time.deltaTime*6);
		}
		yield;
	}
}

function SmallSliceManager (slice:int) {
	var originalColor:Color = smallWheelPieces[slice].color;
	while(true)
	{
		if(smallWheelWinners[slice])
		{
			smallWheelPieces[slice].color = Color.Lerp(smallWheelPieces[slice].color,specialColor,Time.deltaTime*8);
		}
		else
		{
			smallWheelPieces[slice].color = Color.Lerp(smallWheelPieces[slice].color,originalColor,Time.deltaTime*8);
		}
		yield;
	}
}

function AddBig ():boolean {
	if(currentState == UnlockWheelStatus.Clear)
	{
		CheckAvailable();
		var newAddition:int = Random.Range(0,bigWheelWinners.length);
		var checker:int = 0;
		while(bigWheelWinners[newAddition] && checker < 100)
		{
			newAddition = Random.Range(0,bigWheelWinners.length);
			checker ++;
		}
		bigWheelWinners[newAddition] = true;
		if(checker == 100)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}

function SubtractBig ():boolean {
	if(currentState == UnlockWheelStatus.Clear)
	{
		var newSubtraction:int = Random.Range(0,bigWheelWinners.length);
		var checker:int = 0;
		while(!bigWheelWinners[newSubtraction] && checker < 100)
		{
			newSubtraction = Random.Range(0,bigWheelWinners.length);
			checker ++;
		}
		bigWheelWinners[newSubtraction] = false;
		if(checker == 100)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}

function AddSmall ():boolean {
	if(currentState == UnlockWheelStatus.Clear)
	{
		CheckAvailable();
		var newAddition:int = Random.Range(0,smallWheelWinners.length);
		var checker:int = 0;
		while(smallWheelWinners[newAddition] && checker < 100)
		{
			newAddition = Random.Range(0,smallWheelWinners.length);
			checker ++;
		}
		smallWheelWinners[newAddition] = true;
		if(checker == 100)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}

function SubtractSmall ():boolean {
	if(currentState == UnlockWheelStatus.Clear)
	{
		var newSubtraction:int = Random.Range(0,smallWheelWinners.length);
		var checker:int = 0;
		while(!smallWheelWinners[newSubtraction] && checker < 100)
		{
			newSubtraction = Random.Range(0,smallWheelWinners.length);
			checker ++;
		}
		smallWheelWinners[newSubtraction] = false;
		if(checker == 100)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
}

function CheckAvailable () {
	var notify:boolean = true;
	for(var i:int = 0; i < bigWheelWinners.length; i++)
	{
		if(bigWheelWinners[i])
		{
			notify = false;
		}
	}
	for(i = 0; i < smallWheelWinners.length; i++)
	{
		if(smallWheelWinners[i])
		{
			notify = false;
		}
	}
	if(notify && lockedItems.Length == 0)
	{
		currentState = UnlockWheelStatus.Notify;
		Camera.main.GetComponent(Master).LaunchNotification("There's nothing to unlock right now! Playing the wheel would be a silly gamble!",NotificationType.tutorial);
		while(Master.notifying)
		{
			yield;
		}
		currentState = UnlockWheelStatus.Clear;
	}
}

function Spin () {
	if(currentState == UnlockWheelStatus.Clear)
	{
		var modifier:float = Random.Range(.2,.7);
		currentState = UnlockWheelStatus.Spinning;
		yield WaitForSeconds(.2);
		var waitTime:float = .15;
		while(waitTime > .001)
		{
			arrowLocation ++;
			Flash();
			yield WaitForSeconds(waitTime);
			waitTime = Mathf.MoveTowards(waitTime,.001,.01);
		}
		currentStopButton = Instantiate(stopButton);
		while(currentStopButton != null)
		{
			arrowLocation ++;
			Flash();
			yield WaitForSeconds(waitTime * modifier);
			yield;
		}
		while(waitTime < .6)
		{
			arrowLocation ++;
			Flash();
			yield WaitForSeconds(waitTime);
			waitTime = waitTime * (1 + (.2 * modifier));
			yield;
		}
		arrowLocation ++;
		Flash();
		yield WaitForSeconds(.6);
		arrowLocation ++;
		Flash();
		if(Random.value < .4)
		{
			yield WaitForSeconds(1.1);
			arrowLocation ++;
			Flash();
		}
		yield WaitForSeconds(.3);
		var amountWon:int = 0;
		if(bigWheelWinners[GetValue(true)])
		{
			amountWon ++;
		}
		if(smallWheelWinners[GetValue(false)])
		{
			amountWon += 2;
		}
		Results(amountWon);
		UpdateUnlockables();
		yield;
	}
}

function Results(amountWon:int) {
	if(amountWon > 0)
	{
		currentState = UnlockWheelStatus.Notify;
		if(lockedItems.Length > 0)
		{
			if(amountWon > 1)
			{
				Camera.main.GetComponent(Master).LaunchNotification("You unlocked some new items!", NotificationType.unlockedItems);
			}
			else
			{
				Camera.main.GetComponent(Master).LaunchNotification("You unlocked a new item!", NotificationType.unlockedItems);
			}
			var choices:int[] = GetChoices(amountWon);
			var newItem:GameObject[];
			newItem = new GameObject[choices.length];
			switch(choices.length)
			{
				case 1:
					newItem[0] = Instantiate(lockedItems[choices[0]],Vector3(0,5,-9.4),Quaternion.identity);
					break;
				case 2:
					newItem[0] = Instantiate(lockedItems[choices[0]],Vector3(-2,5,-9.4),Quaternion.identity);
					newItem[1] = Instantiate(lockedItems[choices[1]],Vector3(2,5,-9.4),Quaternion.identity);
					break;
				case 3:
					newItem[0] = Instantiate(lockedItems[choices[0]],Vector3(0,5,-9.4),Quaternion.identity);
					newItem[1] = Instantiate(lockedItems[choices[1]],Vector3(-4,5,-9.4),Quaternion.identity);
					newItem[2] = Instantiate(lockedItems[choices[2]],Vector3(4,5,-9.4),Quaternion.identity);
					break;
				default:
					break;
			}
			for(var i:int = 0; i < newItem.length; i++)
			{
				newItem[i].transform.localScale = Vector3(2,2,2);
			}
			while(Master.notifying)
			{
				yield;
			}
			for(i = 0; i < newItem.length; i++)
			{
				PlayerPrefs.SetInt(unlockableItems[i].GetComponent(VariablePrefix).variablePrefix + unlockableItems[i].transform.name,1);
				Destroy(newItem[i]);
			}
		}
	}
	else
	{
		yield WaitForSeconds(1);
	}
	Reset();
	currentState = UnlockWheelStatus.Clear;
}

function GetChoices(number:int):int[] {
	var choice1:int;
	choice1 = Random.Range(0,lockedItems.Length);
	var randomizer:int = 0;
	if(number > 1)
	{
		var choice2:int = Random.Range(0,lockedItems.Length);
		while(choice2 == choice1 && randomizer < 100)
		{
			choice2 = Random.Range(0,lockedItems.Length);
			randomizer ++;
			if(randomizer == 100)
			{
				for(var i:int = 0; i < lockedItems.Length; i++)
				{
					if(choice1 != i)
					{
						choice2 = i;
						break;
					}
				}
			}
		}
	}
	if(number > 2)
	{
		var choice3:int = Random.Range(0,lockedItems.Length);
		while((choice3 == choice2 || choice3 == choice1) && randomizer < 100)
		{
			choice3 = Random.Range(0,lockedItems.Length);
			randomizer ++;
			if(randomizer == 100)
			{
				for(i = 0; i < lockedItems.Length; i++)
				{
					if(choice1 != i && choice2 != i)
					{
						choice3 = i;
						break;
					}
				}
			}
		}
	}
	var finalArray:int[];
	finalArray = new int[0];
	switch(number)
	{
		case 1:
			finalArray = AddInt(finalArray,choice1);
			break;
		case 2:
			finalArray = AddInt(finalArray,choice1);
			if(choice1 != choice2)
			{
				finalArray = AddInt(finalArray,choice2);
			}
			break;
		case 3:
			finalArray = AddInt(finalArray,choice1);
			if(choice1 != choice2)
			{
				finalArray = AddInt(finalArray,choice2);
			}
			if(choice1 != choice3 && choice3 != choice2)
			{
				finalArray = AddInt(finalArray,choice3);
			}
			break;
		default:
			finalArray = new int[0];
			break;
	}
	return finalArray;
}

function Flash () {
	if(arrowLocation >= 32)
	{
		arrowLocation = 0;
	}
	if(bigWheelWinners[GetValue(true)])
	{
		bigWheelPieces[GetValue(true)].color = winnerHighlight;
	}
	else
	{
		bigWheelPieces[GetValue(true)].color = failHighlight;
	}
	if(smallWheelWinners[GetValue(false)])
	{
		smallWheelPieces[GetValue(false)].color = specialHighlight;
	}
	else
	{
		smallWheelPieces[GetValue(false)].color = failHighlight;
	}
}

function Reset () {
	for(var i:int = 0; i < bigWheelWinners.length; i++)
	{
		bigWheelWinners[i] = false;
	}
	for(i = 0; i < smallWheelWinners.length; i++)
	{
		smallWheelWinners[i] = false;
	}
}

function MaxBet () {
	for(var i:int = 0; i < bigWheelWinners.length; i++)
	{
		bigWheelWinners[i] = true;
	}
	for(i = 0; i < smallWheelWinners.length; i++)
	{
		smallWheelWinners[i] = true;
	}
}

function UpdateUnlockables () {
	lockedItems = new GameObject[0];
	for(var i = 0; i < unlockableItems.length; i++)
	{
		if(PlayerPrefs.GetInt(unlockableItems[i].GetComponent(VariablePrefix).variablePrefix + unlockableItems[i].transform.name) != 1)
		{
			lockedItems = AddObject(lockedItems,unlockableItems[i]);
		}
	}
}

function AddObject (original:GameObject[],addition:GameObject):GameObject[] {
	var finalArray:GameObject[] = new GameObject[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function AddInt (original:int[],addition:int):int[] {
	var finalArray:int[] = new int[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function GetValue (big:boolean):int {
	switch(arrowLocation)
	{
		case 0:
			if(big)
			{
				return 0;
			}
			else
			{
				return 0;
			}
			break;
		case 1:
			if(big)
			{
				return 0;
			}
			else
			{
				return 1;
			}
			break;
		case 2:
			if(big)
			{
				return 1;
			}
			else
			{
				return 1;
			}
			break;
		case 3:
			if(big)
			{
				return 1;
			}
			else
			{
				return 2;
			}
			break;
		case 4:
			if(big)
			{
				return 2;
			}
			else
			{
				return 3;
			}
			break;
		case 5:
			if(big)
			{
				return 2;
			}
			else
			{
				return 4;
			}
			break;
		case 6:
			if(big)
			{
				return 3;
			}
			else
			{
				return 4;
			}
			break;
		case 7:
			if(big)
			{
				return 3;
			}
			else
			{
				return 5;
			}
			break;
		case 8:
			if(big)
			{
				return 4;
			}
			else
			{
				return 6;
			}
			break;
		case 9:
			if(big)
			{
				return 4;
			}
			else
			{
				return 7;
			}
			break;
		case 10:
			if(big)
			{
				return 5;
			}
			else
			{
				return 7;
			}
			break;
		case 11:
			if(big)
			{
				return 5;
			}
			else
			{
				return 8;
			}
			break;
		case 12:
			if(big)
			{
				return 6;
			}
			else
			{
				return 9;
			}
			break;
		case 13:
			if(big)
			{
				return 6;
			}
			else
			{
				return 10;
			}
			break;
		case 14:
			if(big)
			{
				return 7;
			}
			else
			{
				return 10;
			}
			break;
		case 15:
			if(big)
			{
				return 7;
			}
			else
			{
				return 11;
			}
			break;
		case 16:
			if(big)
			{
				return 8;
			}
			else
			{
				return 12;
			}
			break;
		case 17:
			if(big)
			{
				return 8;
			}
			else
			{
				return 13;
			}
			break;
		case 18:
			if(big)
			{
				return 9;
			}
			else
			{
				return 13;
			}
			break;
		case 19:
			if(big)
			{
				return 9;
			}
			else
			{
				return 14;
			}
			break;
		case 20:
			if(big)
			{
				return 10;
			}
			else
			{
				return 15;
			}
			break;
		case 21:
			if(big)
			{
				return 10;
			}
			else
			{
				return 16;
			}
			break;
		case 22:
			if(big)
			{
				return 11;
			}
			else
			{
				return 16;
			}
			break;
		case 23:
			if(big)
			{
				return 11;
			}
			else
			{
				return 17;
			}
			break;
		case 24:
			if(big)
			{
				return 12;
			}
			else
			{
				return 18;
			}
			break;
		case 25:
			if(big)
			{
				return 12;
			}
			else
			{
				return 19;
			}
			break;
		case 26:
			if(big)
			{
				return 13;
			}
			else
			{
				return 19;
			}
			break;
		case 27:
			if(big)
			{
				return 13;
			}
			else
			{
				return 20;
			}
			break;
		case 28:
			if(big)
			{
				return 14;
			}
			else
			{
				return 21;
			}
			break;
		case 29:
			if(big)
			{
				return 14;
			}
			else
			{
				return 22;
			}
			break;
		case 30:
			if(big)
			{
				return 15;
			}
			else
			{
				return 22;
			}
			break;
		case 31:
			if(big)
			{
				return 15;
			}
			else
			{
				return 23;
			}
			break;
		default:
			return -1;
			break;
	}
}