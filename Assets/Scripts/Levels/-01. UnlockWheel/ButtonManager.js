#pragma strict

var manager:UnlockWheelManager;
var spinButton:SpriteRenderer;
var spinReadOut:TextMesh;

@HideInInspector var availableNumber:float;
@HideInInspector var totalNumber:float;

@HideInInspector var percent:float;

@HideInInspector var minimumCost:float;
@HideInInspector var maximumCost:float;
@HideInInspector var smallPrice:int;
@HideInInspector var specialPrice:int;
@HideInInspector var maxBet:int;

var normalPriceReadouts:TextMesh[];
var specialPriceReadouts:TextMesh[];
var maxBetPriceReadouts:TextMesh[];

@HideInInspector var currentBet:int;

@HideInInspector var smallBet:int;
@HideInInspector var bigBet:int;

function Start () {
	minimumCost = 2;
	maximumCost = 50;
	currentBet = 0;
}

function Update () {
	currentBet = smallPrice;
	GetValue();
	UpdateText(normalPriceReadouts,smallPrice);
	UpdateText(specialPriceReadouts,specialPrice);
	UpdateText(maxBetPriceReadouts,maxBet);
	if(UnlockWheelManager.currentState == UnlockWheelStatus.Spinning)
	{
		spinButton.transform.position.x = 1000;
	}
	else
	{
		spinButton.transform.position.x = 1.6872;
	}
	spinReadOut.text = currentBet.ToString();
}

function UpdateText (array:TextMesh[],price:int) {
	for(var i:int = 0; i < array.length; i++)
	{
		array[i].text = price.ToString();
	}
}

function GetValue () {
	availableNumber = Mathf.Max(1,manager.lockedItems.length);
	totalNumber = manager.unlockableItems.length;
	percent = availableNumber/totalNumber;
	smallPrice = Mathf.Lerp(maximumCost,minimumCost,percent);
	specialPrice = Mathf.Lerp(maximumCost,minimumCost,percent) + 5;
	maxBet = smallPrice * 16 * .9;
}

function CancelBet () {
	manager.Reset();
	smallBet = 0;
	bigBet = 0;
}
function Spin () {
	manager.Spin(currentBet);
	smallBet = 0;
	bigBet = 0;
}