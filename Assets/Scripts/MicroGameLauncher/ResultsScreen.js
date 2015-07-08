#pragma strict

var progressBar:Transform;

var goals:float[];
@HideInInspector var goalMarker:int;
@HideInInspector var currentLocationGoal:float;

var iconHolders:SpriteRenderer[];
var iconDefaultSprites:Sprite[];
var iconNewUnlockWorldSprites:Sprite[];
var iconOldUnlockWorldSprites:Sprite[];

var alert:GameObject;
var currentAlert:GameObject;
static var notifying:boolean;

var done:boolean;

var finished:boolean;

var ribbon:SpriteRenderer;

function Start () {
	ribbon.color.a = 0;
	goalMarker = 0;
	done = false;
	notifying = false;
	progressBar.localScale.x = 1;
	for(var i:int = 1; i < 4; i++)
	{
		if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Unlocks")>=i)
		{
			iconHolders[i-1].sprite = iconOldUnlockWorldSprites[i-1];
		}
	}
	StartCoroutine(ProgressIncrease());
}

function Update () {
	progressBar.localScale.x = Mathf.MoveTowards(progressBar.localScale.x,currentLocationGoal,Time.deltaTime*10);
	if(done && Master.lastScore < 15 && PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Unlocks")<1 && progressBar.localScale.x == currentLocationGoal)
	{
		ribbon.color.a = 1;
	}
}

function ProgressIncrease() {
	yield WaitForSeconds(.3);
	PlayerPrefs.SetInt("CurrencyNumber",PlayerPrefs.GetInt("CurrencyNumber")+Master.lastScore);
	while(!done)
	{
		NextGoal(goalMarker);
		while(progressBar.localScale.x != currentLocationGoal) { yield; }
		if(notifying)
		{
			currentAlert = Instantiate(alert);
			currentAlert.GetComponent(PieceGetting).text = Master.currentWorld.unlocks.unlockNotificationTextLine1[goalMarker-1] + "\n" + Master.currentWorld.unlocks.unlockNotificationTextLine2[goalMarker-1];
			yield WaitForSeconds(.3);
			iconHolders[goalMarker-1].sprite = iconNewUnlockWorldSprites[goalMarker-1];
		}
		while(notifying) { yield; }
		goalMarker++;
		yield;
	}
	yield;
}

function NextGoal(goalNumber:float) {
	if(Master.lastScore >= Master.unlockLevels[goalNumber])
	{
		currentLocationGoal = goals[goalNumber];
		if(Master.lastScore <= Master.unlockLevels[goalNumber])
		{
			done = true;
		}
		if(PlayerPrefs.GetInt(Master.currentWorld.basic.worldNameVar+"Unlocks")<goalNumber && goalNumber < 4)
		{
			PlayerPrefs.SetInt(Master.currentWorld.basic.worldNameVar+"Unlocks",goalNumber);
			notifying = true;
			switch(goalNumber)
			{
				case 1:
					for(var variableName:String in Master.currentWorld.unlocks.unlocksLevel1)
					{
						PlayerPrefs.SetInt(variableName,1);
					}
					break;
				case 2:
					for(var variableName:String in Master.currentWorld.unlocks.unlocksLevel2)
					{
						PlayerPrefs.SetInt(variableName,1);
					}
					break;
				case 3:
					for(var variableName:String in Master.currentWorld.unlocks.unlocksLevel3)
					{
						PlayerPrefs.SetInt(variableName,1);
					}
					break;
				default:
					break;
			}
		}
	}
	else
	{
		currentLocationGoal = goals[goalNumber-1] + ((Master.lastScore-Master.unlockLevels[goalNumber-1]) / (Master.unlockLevels[goalNumber] - Master.unlockLevels[goalNumber-1])) * (goals[goalNumber]-goals[goalNumber-1]);
		done = true;
	}
	
}

function Clicked() {
	if(progressBar.localScale.x != currentLocationGoal)
	{
		progressBar.localScale.x = currentLocationGoal;
	}
	else if(done)
	{
		finished = true;
	}
}
