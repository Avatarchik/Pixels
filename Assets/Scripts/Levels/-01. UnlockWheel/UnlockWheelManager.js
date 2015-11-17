#pragma strict

public enum UnlockWheelStatus{Clear,Spinning,Notify,Leaving};

var successSounds:AudioClip[];

static var currentState:UnlockWheelStatus;

@HideInInspector var currentStopButton:GameObject;

var unlockableItems:GameObject[];

@HideInInspector var lockedItems:GameObject[];

var lockedClothingItems:GameObject[];
var lockedTheaterPieces:GameObject[];

var itemNotificationObject:GameObject;

var notifier:GameObject;
@HideInInspector var currentNotifier:GameObject;

function Start () {
	AudioManager.PlaySong(Master.currentWorld.audio.music[0]);
	unlockableItems = Camera.main.GetComponent(Master).launchOptions.customizationPieces;
	UpdateUnlockables();
}

function Update () {
	
}

function UpdateUnlockables () {
	lockedItems = new GameObject[0];
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