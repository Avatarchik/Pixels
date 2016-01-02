#pragma strict

public enum UnlockWheelStatus{Clear,Spinning,Notify,Leaving};
static var currentState:UnlockWheelStatus;
var successSounds:AudioClip[];

var slotCoinSound:AudioClip;
var slotRandomSound:AudioClip;
var slotStopSound:AudioClip;

var spinningSprites:Sprite[];
var bombSprite:Sprite;
var characterSprite:Sprite;
var theaterSprite:Sprite;
var propSprite:Sprite;
var specialSprites:Sprite[];

var machine:GameObject;
var slot1:SpriteRenderer;
var slot2:SpriteRenderer;
var slot3:SpriteRenderer;

var costReader1:TextMesh;
var costReader2:TextMesh;
var backgroundBlack:SpriteRenderer;

@HideInInspector var unlockableItems:GameObject[];
var lockedItems:GameObject[];
@HideInInspector var lockedClothingItems:GameObject[];
@HideInInspector var lockedTheaterPieces:GameObject[];
@HideInInspector var lockedPropPieces:GameObject[];

@HideInInspector var minimumPrice:float;
@HideInInspector var maximumPrice:float;
@HideInInspector var price:int;

@HideInInspector var winners:GameObject[];
@HideInInspector var winType:String;
@HideInInspector var winNumber:int;
@HideInInspector var shakeAmount:float;
@HideInInspector var choices:GameObject[];

var notifier:GameObject;
@HideInInspector var currentNotifier:GameObject;

@HideInInspector var endSprites:Sprite[];

var welcomeSounds:AudioClip[];
var winSounds:AudioClip[];
var loseSounds:AudioClip[];

var dylan:DylanTalk;

function Start () {
	if(!PlayerPrefs.HasKey("PlayerUnlockSlotLosses"))
	{
		PlayerPrefs.SetFloat("PlayerUnlockSlotLosses", 0);
	}
	dylan.Talk(welcomeSounds);
	endSprites = new Sprite[3];
	choices = new GameObject[3];
	price = 0;
	AudioManager.PlaySong(Master.currentWorld.audio.music[0]);
	currentState = UnlockWheelStatus.Clear;
	unlockableItems = Camera.main.GetComponent(Master).settings.customizationPieces;
	UpdateUnlockables();
	GetPrice();
	Shake();
}

function Update () {
	costReader1.text = price.ToString();
	costReader2.text = price.ToString();
	if(currentState == UnlockWheelStatus.Spinning)
	{
		backgroundBlack.color.a += Time.deltaTime * .1;
	}
	else
	{
		backgroundBlack.color.a -= Time.deltaTime * .1;
	}
}

function GetPrice () {
	minimumPrice = Camera.main.GetComponent(Master).settings.economy.minimumUnlockCost;
	maximumPrice = Camera.main.GetComponent(Master).settings.economy.maximumUnlockCost;
	price = Mathf.Lerp(maximumPrice,minimumPrice,((lockedItems.length * 1.0)/(unlockableItems.Length * 1.0)));
}

function Spin () {
	if(lockedItems.Length > 0)
	{
		if(PlayerPrefs.GetInt("CurrencyNumber") >= price)
		{
			AudioManager.PlaySound(slotCoinSound,.65);
			yield WaitForSeconds(.5);
			PlayerPrefs.SetInt("CurrencyNumber",PlayerPrefs.GetInt("CurrencyNumber")-price);
			currentState = UnlockWheelStatus.Spinning;
			var spinCounter:int = 0;
			var spinlimit:int = Random.Range(45,55);
			shakeAmount = .05;
			DetermineWinners();
			while(spinCounter < spinlimit)
			{
				slot1.sprite = spinningSprites[Random.Range(0,spinningSprites.length)];
				slot2.sprite = spinningSprites[Random.Range(0,spinningSprites.length)];
				slot3.sprite = spinningSprites[Random.Range(0,spinningSprites.length)];
				spinCounter ++;
				if(spinCounter % 6 == 0)
				{
					AudioManager.PlaySound(slotRandomSound,.5,Random.Range(.5,1.5));
				}
				yield;
			}
			AudioManager.PlaySound(slotStopSound);
			shakeAmount = .1;
			slot1.sprite = endSprites[0];
			spinlimit += Random.Range(20,40);
			while(spinCounter < spinlimit)
			{
				slot2.sprite = spinningSprites[Random.Range(0,spinningSprites.length)];
				slot3.sprite = spinningSprites[Random.Range(0,spinningSprites.length)];
				spinCounter ++;
				if(spinCounter % 6 == 0)
				{
					AudioManager.PlaySound(slotRandomSound,.5,Random.Range(.5,1.5));
				}
				yield;
			}
			AudioManager.PlaySound(slotStopSound);
			shakeAmount = .15;
			slot2.sprite = endSprites[1];
			spinlimit += Random.Range(20,40);
			while(spinCounter < spinlimit)
			{
				slot3.sprite = spinningSprites[Random.Range(0,spinningSprites.length)];
				spinCounter ++;
				if(spinCounter % 6 == 0)
				{
					AudioManager.PlaySound(slotRandomSound,.5,Random.Range(.5,1.5));
				}
				yield;
			}
			AudioManager.PlaySound(slotStopSound);
			slot3.sprite = endSprites[2];
			shakeAmount = 0;
			currentState = UnlockWheelStatus.Notify;
			yield WaitForSeconds(.5);
			Results(winNumber);
		}
		else
		{
			Camera.main.GetComponent(Master).LaunchNotification("You need more coins first!",NotificationType.notEnoughCoins);
			currentState = UnlockWheelStatus.Notify;
			while(Master.notifying)
			{
				yield;
			}
			currentState = UnlockWheelStatus.Clear;
		}
	}
	else
	{
		Camera.main.GetComponent(Master).LaunchNotification("You've unlocked everything! Good job!",NotificationType.notEnoughCoins);
		currentState = UnlockWheelStatus.Notify;
		while(Master.notifying)
		{
			yield;
		}
		currentState = UnlockWheelStatus.Clear;
	}
}

function DetermineWinners() {
	var player:boolean = (lockedClothingItems.length > 0);
	var theater:boolean = (lockedTheaterPieces.length > 0);
	var props:boolean = (lockedPropPieces.length > 0);
	winNumber = 0;
	var winValue:float = Random.value;
	if(PlayerPrefs.GetInt("FirstThingUnlocked") != 1)
	{
		winValue = .1;
	}
	if(winValue < .5 + (.1 * PlayerPrefs.GetFloat("PlayerUnlockSlotLosses")))
	{
		PlayerPrefs.SetFloat("PlayerUnlockSlotLosses", 0);
		winNumber = 1;
		if(winValue < .05)
		{
			winNumber = 3;
		}
	}
	else
	{
		PlayerPrefs.SetFloat("PlayerUnlockSlotLosses", PlayerPrefs.GetFloat("PlayerUnlockSlotLosses") + 1);
		winNumber = 0;
	}
	winners = new GameObject[winNumber];
	if(winNumber == 0) 
	{
		winType = "none";
	}
	else if(winNumber == 1)
	{
		winType = "?";
		var repeatability:int = 10;
		while(repeatability > 0 && winType == "?")
		{
			var randomNumber:float = Random.value;
			if(PlayerPrefs.GetInt("FirstThingUnlocked") != 1)
			{
				randomNumber = .2;
			}
			if(randomNumber < .3 && lockedClothingItems.Length > 0)
			{
				winType = "player";
				winners[0] = lockedClothingItems[Random.Range(0,lockedClothingItems.length)];
				endSprites[0] = characterSprite;
				endSprites[1] = characterSprite;
				endSprites[2] = characterSprite;
				choices[0] = lockedClothingItems[Random.Range(0,lockedClothingItems.length)];
			}
			else if(randomNumber < .7 && lockedTheaterPieces.Length > 0)
			{
				winType = "theater";
				winners[0] = lockedTheaterPieces[Random.Range(0,lockedTheaterPieces.length)];
				endSprites[0] = theaterSprite;
				endSprites[1] = theaterSprite;
				endSprites[2] = theaterSprite;
				choices[0] = lockedTheaterPieces[Random.Range(0,lockedTheaterPieces.length)];
			}
			else if(lockedPropPieces.Length > 0)
			{
				winType = "prop";
				winners[0] = lockedPropPieces[Random.Range(0,lockedPropPieces.length)];
				endSprites[0] = propSprite;
				endSprites[1] = propSprite;
				endSprites[2] = propSprite;
				choices[0] = lockedPropPieces[Random.Range(0,lockedPropPieces.length)];
			}
			repeatability --;
		}
	}
	else if(winNumber == 3)
	{
		winType = "special";
		for(var i:int = 0; i < 3; i++)
		{	
			randomNumber = Random.value;
			if(randomNumber < .25 && lockedClothingItems.Length > 0)
			{
				winners[i] = lockedClothingItems[Random.Range(0,lockedClothingItems.length)];
			}
			else if(randomNumber < .75 && lockedTheaterPieces.Length > 0)
			{
				winners[i] = lockedTheaterPieces[Random.Range(0,lockedTheaterPieces.length)];
			}
			else if(lockedPropPieces.Length > 0)
			{
				winners[i] = lockedPropPieces[Random.Range(0,lockedPropPieces.length)];
			}
			else
			{
				winners[i] = null;
			}
		}
		endSprites[0] = specialSprites[0];
		endSprites[1] = specialSprites[1];
		endSprites[2] = specialSprites[2];
		var retries:int = 50;
		if(lockedItems.Length > 2)
		{
			choices[0] = lockedItems[Random.Range(0,lockedItems.length)];
			choices[1] = lockedItems[Random.Range(0,lockedItems.length)];
			while(choices[1] == choices[0] && retries > 0)
			{
				choices[1] = lockedItems[Random.Range(0,lockedItems.length)];
				retries --;
			}
			retries = 50;
			choices[2] = lockedItems[Random.Range(0,lockedItems.length)];
			while((choices[2] == choices[0] || choices[2] == choices[1]) && retries > 0)
			{
				choices[2] = lockedItems[Random.Range(0,lockedItems.length)];
				retries --;
			}
		}
		else if(lockedItems.Length > 1)
		{
			choices[0] = lockedItems[Random.Range(0,lockedItems.length)];
			choices[1] = lockedItems[Random.Range(0,lockedItems.length)];
			while(choices[1] == choices[0] && retries > 0)
			{
				choices[1] = lockedItems[Random.Range(0,lockedItems.length)];
				retries --;
			}
			winNumber = 2;
		}
		else
		{
			choices[0] = lockedItems[Random.Range(0,lockedItems.length)];
			winNumber = 1;
		}
	}
	if(winType == "none")
	{
		randomNumber = Random.value;
		if(randomNumber < .1)
		{
			endSprites[0] = theaterSprite;
			endSprites[1] = bombSprite;
			endSprites[2] = bombSprite;
		}
		else if(randomNumber < .2)
		{
			endSprites[0] = characterSprite;
			endSprites[1] = characterSprite;
			endSprites[2] = bombSprite;
		}
		else if(randomNumber < .3)
		{
			endSprites[0] = theaterSprite;
			endSprites[1] = theaterSprite;
			endSprites[2] = bombSprite;
		}
		else if(randomNumber < .4)
		{
			endSprites[0] = propSprite;
			endSprites[1] = characterSprite;
			endSprites[2] = bombSprite;
		}
		else if(randomNumber < .5)
		{
			endSprites[0] = propSprite;
			endSprites[1] = propSprite;
			endSprites[2] = bombSprite;
		}
		else if(randomNumber < .6)
		{
			endSprites[0] = bombSprite;
			endSprites[1] = bombSprite;
			endSprites[2] = bombSprite;
		}
		else if(randomNumber < .7)
		{
			endSprites[0] = characterSprite;
			endSprites[1] = bombSprite;
			endSprites[2] = theaterSprite;
		}
		else if(randomNumber < .8)
		{
			endSprites[0] = theaterSprite;
			endSprites[1] = bombSprite;
			endSprites[2] = propSprite;
		}
		else if(randomNumber < .9)
		{
			endSprites[0] = bombSprite;
			endSprites[1] = bombSprite;
			endSprites[2] = bombSprite;
		}
		else
		{
			endSprites[0] = characterSprite;
			endSprites[1] = characterSprite;
			endSprites[2] = bombSprite;
		}
	}
}

function Results (number:int) {
	if(number > 0)
	{
		currentNotifier = Instantiate(notifier);
		var textLength:int = 13;
		if(number > 0)
		{
			currentNotifier.GetComponent(UnlockThing).unlock1Item.GetComponent(SpriteRenderer).sprite = choices[0].GetComponent(VariablePrefix).objectTypeImage;
			currentNotifier.GetComponent(UnlockThing).unlock1Text.text = choices[0].GetComponent(VariablePrefix).unlockText + "\n Unlocked!";
			if(choices[0].GetComponent(VariablePrefix).unlockText.length > textLength)
			{
				currentNotifier.GetComponent(UnlockThing).unlock1Text.characterSize = .1;
			}
		}
		if(number > 1)
		{
			currentNotifier.GetComponent(UnlockThing).unlock2Item.GetComponent(SpriteRenderer).sprite = choices[1].GetComponent(VariablePrefix).objectTypeImage;
			currentNotifier.GetComponent(UnlockThing).unlock2Text.text = choices[1].GetComponent(VariablePrefix).unlockText + "\n Unlocked!";
			if(choices[1].GetComponent(VariablePrefix).unlockText.length > textLength)
			{
				currentNotifier.GetComponent(UnlockThing).unlock2Text.characterSize = .1;
			}
		}
		else
		{
			Destroy(currentNotifier.GetComponent(UnlockThing).unlock2Item);
		}
		if(number > 2)
		{
			currentNotifier.GetComponent(UnlockThing).unlock3Item.GetComponent(SpriteRenderer).sprite = choices[2].GetComponent(VariablePrefix).objectTypeImage;
			currentNotifier.GetComponent(UnlockThing).unlock3Text.text = choices[2].GetComponent(VariablePrefix).unlockText + "\n Unlocked!";
			if(choices[2].GetComponent(VariablePrefix).unlockText.length > textLength)
			{
				currentNotifier.GetComponent(UnlockThing).unlock3Text.characterSize = .1;
			}
		}
		else
		{
			Destroy(currentNotifier.GetComponent(UnlockThing).unlock3Item);
		}
		for(var i:int  = 0; i < number; i++)
		{
			PlayerPrefs.SetInt(choices[i].GetComponent(VariablePrefix).variablePrefix + choices[i].transform.name,1);
		}
		while(currentNotifier != null)
		{
			yield;
		}
		if(Random.value < .5)
		{
			dylan.Talk(winSounds);
		}
		if(PlayerPrefs.GetInt("FirstThingUnlocked") != 1)
		{
			PlayerPrefs.SetInt("FirstThingUnlocked",1);
			Camera.main.GetComponent(Master).LaunchNotification("Go to the Theater or Title Screen to dress Peter!",NotificationType.notEnoughCoins);
			while(Master.notifying)
			{
				yield;
			}
		}
	}
	else
	{
		if(Random.value < .5)
		{
			dylan.Talk(loseSounds);
		}
	}
	UpdateUnlockables();
	GetPrice();
	currentState = UnlockWheelStatus.Clear;
}

function UpdateUnlockables () {
	lockedItems = new GameObject[0];
	lockedTheaterPieces = new GameObject[0];
	lockedClothingItems = new GameObject[0];
	lockedPropPieces = new GameObject[0];
	
	for(var i = 0; i < unlockableItems.length; i++)
	{
		if(PlayerPrefs.GetInt(unlockableItems[i].GetComponent(VariablePrefix).variablePrefix + unlockableItems[i].transform.name) != 1)
		{
			lockedItems = AddObject(lockedItems,unlockableItems[i]);
			var itemType:String = unlockableItems[i].GetComponent(VariablePrefix).variablePrefix;
			if(itemType.Contains("Ceiling") || itemType.Contains("Chairs") || itemType.Contains("Curtain") || itemType.Contains("StageFloor") || itemType.Contains("StageWall") || itemType.Contains("TheaterFloor") || itemType.Contains("TheaterWall"))
			{
				lockedTheaterPieces = AddObject(lockedTheaterPieces,unlockableItems[i]);
			}
			if(itemType.Contains("Bottoms") || itemType.Contains("Eyes") || itemType.Contains("Hair") || itemType.Contains("Tops"))
			{
				lockedClothingItems = AddObject(lockedClothingItems,unlockableItems[i]);
			}
			if(itemType.Contains("Prop:") || itemType.Contains("Set:"))
			{
				lockedPropPieces = AddObject(lockedPropPieces,unlockableItems[i]);
			}
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

function Shake () {
	var origin:Vector3 = machine.transform.position;
	while(true)
	{
		if(shakeAmount == 0)
		{
			machine.transform.position = origin;
		}
		else
		{
			machine.transform.position = origin + Vector3(Random.Range(-shakeAmount,shakeAmount),Random.Range(-shakeAmount,shakeAmount),0);
			yield WaitForSeconds(.01);
		}
		yield;
	}
}