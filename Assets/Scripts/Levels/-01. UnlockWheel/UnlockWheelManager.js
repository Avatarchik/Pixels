#pragma strict

public enum UnlockWheelStatus{Clear,Spinning,Notify,Leaving};

var bigWheelPieces:SpriteRenderer[];
var smallWheelPieces:SpriteRenderer[];
var arrow:SpriteRenderer;
var arrowGhost:SpriteRenderer;
var arrowRestingSprite:Sprite;
var arrowSprites:Sprite[];

var winnerColor:Color;
var winnerHighlight:Color;
var specialColor:Color;
var specialHighlight:Color;
var failHighlight:Color;

var successSounds:AudioClip[];

static var currentState:UnlockWheelStatus;
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

var itemNotificationObject:GameObject;

@HideInInspector var currentWinner:int;

var notifier:GameObject;
@HideInInspector var currentNotifier:GameObject;

var excitementBack:SpriteRenderer;
var excitementGlow:SpriteRenderer;

function Start () {
	excitementBack.color.a = 0;
	excitementGlow.color.a = 0;
	arrowGhost.color.a = 0;
	AudioManager.PlaySong(Master.currentWorld.audio.music[0]);
	unlockableItems = Camera.main.GetComponent(Master).launchOptions.customizationPieces;
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
	if(Input.GetKeyDown("space"))
	{
		Spin(0);
	}
	if(arrowLocation < 0)
	{	
		arrow.sprite = arrowRestingSprite;
		arrowGhost.sprite = arrowRestingSprite;
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
		if(spriteNumber > 0)
		{
			arrowGhost.sprite = arrowSprites[spriteNumber-1];
		}
		else
		{
			arrowGhost.sprite = arrowSprites[arrowSprites.Length-1];
		}
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
		if(arrowLocation < 9 && arrowLocation > 0)
		{
			arrowGhost.transform.rotation.eulerAngles.z = 0;
		}
		else if(arrowLocation < 17 && arrowLocation > 0)
		{
			arrowGhost.transform.rotation.eulerAngles.z = -90;
		}
		else if(arrowLocation < 25 && arrowLocation > 0)
		{
			arrowGhost.transform.rotation.eulerAngles.z = -180;
		}
		else
		{
			arrowGhost.transform.rotation.eulerAngles.z = 90;
		}
		arrowGhost.color.a = Mathf.MoveTowards(arrowGhost.color.a,0,Time.deltaTime * 3);
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

function AddBig () {
	if(currentState == UnlockWheelStatus.Clear)
	{
		currentWinner = Random.Range(0,bigWheelWinners.Length);
		bigWheelWinners[currentWinner] = true;
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
		yield WaitForEndOfFrame();
		currentState = UnlockWheelStatus.Clear;
	}
}

function Spin (cost:int) {
	if(PlayerPrefs.GetInt("CurrencyNumber") >= cost)
	{
		if(currentState == UnlockWheelStatus.Clear)
		{
			var amountWon:int = 0;
			PlayerPrefs.SetInt("CurrencyNumber",PlayerPrefs.GetInt("CurrencyNumber") - cost);
			var modifier:float = Random.Range(.2,17);
			AddBig();
			currentState = UnlockWheelStatus.Spinning;
			yield WaitForSeconds(.2);
			var waitTime:float = .15;
			while(waitTime > 0)
			{
				arrowLocation ++;
				Flash();
				yield WaitForSeconds(waitTime);
				waitTime = Mathf.MoveTowards(waitTime,0,.02);
			}
			currentStopButton = Instantiate(stopButton);
			while(currentStopButton != null)
			{
				arrowLocation ++;
				Flash();
				//yield WaitForSeconds(waitTime * modifier);
				yield;
			}
			waitTime = .02;
			var number:int = 0;
			while(number < 12)
			{
				number ++;
				arrowLocation ++;
				Flash();
				yield WaitForSeconds(waitTime);
				yield;
			}
			if(Random.value < .9)
			{
				amountWon = 1;
				if(Random.value < .5)
				{
					number = 0;
					amountWon = 2;
					SuperCharge();
					while(number < 15)
					{
						number ++;
						arrowLocation ++;
						Flash();
						yield WaitForSeconds(waitTime);
						yield;
					}
					if(Random.value < .5)
					{
						excitementBack.color.a = .7;
						excitementGlow.color.a = .7;
						number = 0;
						amountWon = 3;
						UltraCharge();
						while(number < 40)
						{
							number ++;
							arrowLocation ++;
							arrowGhost.color.a = .5;
							Flash();
							yield WaitForSeconds(waitTime);
							yield;
						}
					}
				}
				while(waitTime < .05 || currentWinner != GetValue())
				{
					arrowLocation ++;
					Flash();
					yield WaitForSeconds(waitTime);
					waitTime = waitTime * (1.08);
					if(waitTime > .35)
					{
						waitTime = .35;
					}
					yield;
				}
			}
			else
			{
				amountWon = 0;
				while(waitTime < .28 || currentWinner == GetValue())
				{
					arrowLocation ++;
					Flash();
					yield WaitForSeconds(waitTime);
					waitTime = waitTime * (1 + (.1 * modifier));
					if(waitTime > .35)
					{
						waitTime = .35;
					}
					yield;
				}
			}
			
			yield WaitForSeconds(.3);
			Results(amountWon);
			excitementBack.color.a = 0;
			excitementGlow.color.a = 0;
			yield;
		}
	}
	else
	{
		Camera.main.GetComponent(Master).LaunchNotification("Not enough money!", NotificationType.notEnoughCoins);
		currentState = UnlockWheelStatus.Notify;
		while(Master.notifying)
		{
			yield;
		}
		currentState = UnlockWheelStatus.Clear;
	}
}

function SuperCharge () {
	MaxBet();
}

function UltraCharge () {
	BetRest();
}

function Results(amountWon:int) {
	if(amountWon > 0)
	{
		currentState = UnlockWheelStatus.Notify;
		if(lockedItems.Length > 0)
		{
			currentState = UnlockWheelStatus.Notify;
			var choices:int[] = GetChoices(amountWon);
			currentNotifier = Instantiate(notifier);
			var textLength:int = 13;
			switch(choices.length)
			{
				case 1:
					currentNotifier.GetComponent(UnlockThing).unlock1Item.GetComponent(SpriteRenderer).sprite = lockedItems[choices[0]].GetComponent(VariablePrefix).objectTypeImage;
					currentNotifier.GetComponent(UnlockThing).unlock1Text.text = lockedItems[choices[0]].GetComponent(VariablePrefix).unlockText + "\n Unlocked!";
					if(lockedItems[choices[0]].GetComponent(VariablePrefix).unlockText.length > textLength)
					{
						currentNotifier.GetComponent(UnlockThing).unlock1Text.characterSize = .1;
					}
					
					Destroy(currentNotifier.GetComponent(UnlockThing).unlock2Item);
					Destroy(currentNotifier.GetComponent(UnlockThing).unlock3Item);
					break;
				case 2:
					currentNotifier.GetComponent(UnlockThing).unlock1Item.GetComponent(SpriteRenderer).sprite = lockedItems[choices[0]].GetComponent(VariablePrefix).objectTypeImage;
					currentNotifier.GetComponent(UnlockThing).unlock1Text.text = lockedItems[choices[0]].GetComponent(VariablePrefix).unlockText + "\n Unlocked!";
					if(lockedItems[choices[0]].GetComponent(VariablePrefix).unlockText.length > textLength)
					{
						currentNotifier.GetComponent(UnlockThing).unlock1Text.characterSize = .1;
					}
					
					currentNotifier.GetComponent(UnlockThing).unlock2Item.GetComponent(SpriteRenderer).sprite = lockedItems[choices[1]].GetComponent(VariablePrefix).objectTypeImage;
					currentNotifier.GetComponent(UnlockThing).unlock2Text.text = lockedItems[choices[1]].GetComponent(VariablePrefix).unlockText + "\n Unlocked!";
					if(lockedItems[choices[1]].GetComponent(VariablePrefix).unlockText.length > textLength)
					{
						currentNotifier.GetComponent(UnlockThing).unlock2Text.characterSize = .1;
					}
					
					Destroy(currentNotifier.GetComponent(UnlockThing).unlock3Item);
					break;
				case 3:
					currentNotifier.GetComponent(UnlockThing).unlock1Item.GetComponent(SpriteRenderer).sprite = lockedItems[choices[0]].GetComponent(VariablePrefix).objectTypeImage;
					currentNotifier.GetComponent(UnlockThing).unlock1Text.text = lockedItems[choices[0]].GetComponent(VariablePrefix).unlockText + "\n Unlocked!";
					if(lockedItems[choices[0]].GetComponent(VariablePrefix).unlockText.length > textLength)
					{
						currentNotifier.GetComponent(UnlockThing).unlock1Text.characterSize = .1;
					}
					
					currentNotifier.GetComponent(UnlockThing).unlock2Item.GetComponent(SpriteRenderer).sprite = lockedItems[choices[1]].GetComponent(VariablePrefix).objectTypeImage;
					currentNotifier.GetComponent(UnlockThing).unlock2Text.text = lockedItems[choices[1]].GetComponent(VariablePrefix).unlockText + "\n Unlocked!";
					if(lockedItems[choices[1]].GetComponent(VariablePrefix).unlockText.length > textLength)
					{
						currentNotifier.GetComponent(UnlockThing).unlock2Text.characterSize = .1;
					}
					
					currentNotifier.GetComponent(UnlockThing).unlock3Item.GetComponent(SpriteRenderer).sprite = lockedItems[choices[2]].GetComponent(VariablePrefix).objectTypeImage;
					currentNotifier.GetComponent(UnlockThing).unlock3Text.text = lockedItems[choices[2]].GetComponent(VariablePrefix).unlockText + "\n Unlocked!";
					if(lockedItems[choices[2]].GetComponent(VariablePrefix).unlockText.length > textLength)
					{
						currentNotifier.GetComponent(UnlockThing).unlock3Text.characterSize = .1;
					}
					break;
				default:
					break;
			}
			for(var i:int  = 0; i < choices.length; i++)
			{
				PlayerPrefs.SetInt(lockedItems[choices[i]].GetComponent(VariablePrefix).variablePrefix + lockedItems[choices[i]].transform.name,1);
			}
			while(currentNotifier != null)
			{
				yield;
			}
			currentState = UnlockWheelStatus.Clear;
			UpdateUnlockables();
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
	if(bigWheelWinners[GetValue()])
	{
		bigWheelPieces[GetValue()].color = winnerHighlight;
	}
	else
	{
		bigWheelPieces[GetValue()].color = failHighlight;
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
		//bigWheelWinners[i] = true;
	}
	for(i = 0; i < smallWheelWinners.length; i++)
	{
		smallWheelWinners[i] = true;
	}
}

function BetRest () {
	for(var i:int = 0; i < bigWheelWinners.length; i++)
	{
		bigWheelWinners[i] = true;
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

function GetValue ():int {
	switch(arrowLocation)
	{
		case 0:
			return 0;
			break;
		case 1:
			return 0;
			break;
		case 2:
			return 0;
			break;
		case 3:
			return 0;
			break;
		case 4:
			return 1;
			break;
		case 5:
			return 1;
			break;
		case 6:
			return 1;
			break;
		case 7:
			return 1;
			break;
		case 8:
			return 2;
			break;
		case 9:
			return 2;
			break;
		case 10:
			return 2;
			break;
		case 11:
			return 2;
			break;
		case 12:
			return 3;
			break;
		case 13:
			return 3;
			break;
		case 14:
			return 3;
			break;
		case 15:
			return 3;
			break;
		case 16:
			return 4;
			break;
		case 17:
			return 4;
			break;
		case 18:
			return 4;
			break;
		case 19:
			return 4;
			break;
		case 20:
			return 5;
			break;
		case 21:
			return 5;
			break;
		case 22:
			return 5;
			break;
		case 23:
			return 5;
			break;
		case 24:
			return 6;
			break;
		case 25:
			return 6;
			break;
		case 26:
			return 6;
			break;
		case 27:
			return 6;
			break;
		case 28:
			return 7;
			break;
		case 29:
			return 7;
			break;
		case 30:
			return 7;
			break;
		case 31:
			return 7;
			break;
		default:
			return -1;
			break;
	}
}