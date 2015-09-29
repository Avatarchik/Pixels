#pragma strict

public enum UnlockWheelStatus{Clear,Spinning};

var bigWheelPieces:SpriteRenderer[];
var smallWheelPieces:SpriteRenderer[];
var arrow:SpriteRenderer;
var arrowRestingSprite:Sprite;
var arrowSprites:Sprite[];

var winnerColor:Color;
var specialColor:Color;

@HideInInspector var currentState:UnlockWheelStatus;
@HideInInspector var bigWheelWinners:boolean[];
@HideInInspector var smallWheelWinners:boolean[];
@HideInInspector var specialSmallValues:boolean[];
@HideInInspector var normalSpots:int;
@HideInInspector var premiumSpots:int;

@HideInInspector var arrowLocation:int;

var stopButton:GameObject;
@HideInInspector var currentStopButton:GameObject;

var unlockableItems:GameObject;

function Start () {
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
			bigWheelPieces[slice].color = winnerColor;
		}
		else
		{
			bigWheelPieces[slice].color = originalColor;
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
			if(specialSmallValues[slice])
			{
				smallWheelPieces[slice].color = specialColor;
			}
			else
			{
				smallWheelPieces[slice].color = winnerColor;
			}
		}
		else
		{
			smallWheelPieces[slice].color = originalColor;
		}
		yield;
	}
}

function AddBig ():boolean {
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

function SubtractBig ():boolean {
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

function AddSmall ():boolean {
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

function SubtractSmall ():boolean {
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

function Spin () {
	var modifier:float = Random.Range(.2,.7);
	currentState = UnlockWheelStatus.Spinning;
	yield WaitForSeconds(.2);
	var waitTime:float = .15;
	while(waitTime > .001)
	{
		arrowLocation ++;
		yield WaitForSeconds(waitTime);
		waitTime = Mathf.MoveTowards(waitTime,.001,.01);
	}
	currentStopButton = Instantiate(stopButton);
	while(currentStopButton != null)
	{
		arrowLocation ++;
		yield WaitForSeconds(waitTime * modifier);
		yield;
	}
	while(waitTime < .6)
	{
		arrowLocation ++;
		yield WaitForSeconds(waitTime);
		waitTime = waitTime * (1 + (.2 * modifier));
		yield;
	}
	arrowLocation ++;
	yield WaitForSeconds(.6);
	arrowLocation ++;
	if(Random.value < .4)
	{
		yield WaitForSeconds(1.1);
		arrowLocation ++;
	}
	yield WaitForSeconds(.3);
	currentState = UnlockWheelStatus.Clear;
	yield;
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