#pragma strict

private var importantFinger:int;

var blocker:GameObject;

var introText:GameObject;
var undressText:GameObject;
var redressText:GameObject;
var redressedText:GameObject;
var loadWorldText:GameObject;

private var currentText:GameObject;
private var currentButtonLocation:Vector2;
private var tutorialStage:int;

var customizeTop:CustomizationButton;
var customizeBottom:CustomizationButton;

var transitionToWorld:AudioClip;
var transition:GameObject;

private var shown:float;
private var hidden:float;

var button1:GameObject;
var button2:GameObject;
var button3:GameObject;
var button4:GameObject;

var finger:GameObject;

var logo:GameObject;

var songs:AudioClip[];

function Start () {
	finger.transform.position.y = 100;
	finger.transform.position.x = 100;
	shown = -3.75;
	hidden = 0;
	tutorialStage = 0;
	importantFinger = -1;
	currentButtonLocation = Vector2(-100,-100);
	blocker.transform.position = Vector3(-23,12,-3.5);
	if(songs.length > 0)
	{
		AudioManager.PlaySoundTransition(songs[0]);
	}
	StartCoroutine(Tutorial());
}

function Update () {
	if(SkipButton.returning)
	{
		if(currentText != null)
		{
			currentText.GetComponent(TextManager).finished = true;
		}
	}
	if(importantFinger == -1)
	{
		for(var i:int = 0; i < Finger.identity.length; i++)
		{
			
			if(Finger.GetExists(i))
			{
				importantFinger = i;
				break;
			}
		}
	}
	else if(!Finger.GetExists(importantFinger))
	{
		TutorialClick(Finger.GetPosition(importantFinger));
		importantFinger = -1;
	}
}

function Tutorial () {
	yield WaitForSeconds(3.9);
	if(logo!=null)
	{
		Destroy(logo);
	}
	yield WaitForSeconds(2);
		LaunchText(introText);
		yield WaitForSeconds(21.5);
		if(songs.length > 1)
		{
			AudioManager.PlaySoundTransition(songs[1]);
		}
	while(!currentText.GetComponent(TextManager).finished) {yield;}
		currentButtonLocation = Vector2(-.25,-7.57);
		button1.transform.position.z = shown;
		finger.transform.position.y = -7.57;
		finger.transform.position.x = 2.84;
	while(tutorialStage != 1) {yield;}
		AudioManager.StopSong();
		if(songs.length > 2)
		{
			AudioManager.PlaySoundTransition(songs[2]);
		}
		button1.transform.position.z = hidden;
		finger.transform.position.y = 100;
		finger.transform.position.x = 100;
		currentButtonLocation = Vector2(-100,-100);
	while(transform.position.y != 29)
		{
			transform.position = Vector2.Lerp(transform.position, Vector2(0,29),Time.deltaTime*4);
			transform.position = Vector2.MoveTowards(transform.position, Vector2(0,29),Time.deltaTime*2);
			yield;
		}
		LaunchText(undressText);
	while(!currentText.GetComponent(TextManager).finished) {yield;}
		currentButtonLocation = Vector2(3.56,-1.9);
		button2.transform.position.z = shown;
		finger.transform.position.y = -3.325;
		finger.transform.position.x = 4.803;
	while(tutorialStage != 2) {yield;}
		button2.transform.position.z = hidden;
		finger.transform.position.y = 100;
		finger.transform.position.x = 100;
		button3.transform.position.z = shown;
		finger.transform.position.y = -5.272;
		finger.transform.position.x = 4.803;
		customizeTop.Clicked();
		currentButtonLocation = Vector2(3.56,-3.9);
	while(tutorialStage != 3) {yield;}
		AudioManager.StopSong();
		if(songs.length > 3)
		{
			AudioManager.PlaySoundTransition(songs[3]);
		}
		button3.transform.position.z = hidden;
		finger.transform.position.y = 100;
		finger.transform.position.x = 100;
		customizeBottom.Clicked();
		currentButtonLocation = Vector2(-100,-100);
		LaunchText(redressText);
	while(!currentText.GetComponent(TextManager).finished) {yield;}
		currentButtonLocation = Vector2(3.56,-1.9);
		button2.transform.position.z = shown;
		finger.transform.position.y = -3.325;
		finger.transform.position.x = 4.803;
	while(tutorialStage != 4) {yield;}
		AudioManager.StopSong();
		customizeTop.Clicked();
		currentButtonLocation = Vector2(3.56,-3.9);
		button2.transform.position.z = hidden;
		finger.transform.position.y = 100;
		finger.transform.position.x = 100;
		button3.transform.position.z = shown;
		finger.transform.position.y =  -5.272;
		finger.transform.position.x =  4.803;
	while(tutorialStage != 5) {yield;}
		if(songs.length > 4)
		{
			AudioManager.PlaySoundTransition(songs[4]);
		}
		button3.transform.position.z = hidden;
		finger.transform.position.y = 100;
		finger.transform.position.x = 100;
		customizeBottom.Clicked();
		currentButtonLocation = Vector2(-100,-100);
		LaunchText(loadWorldText);
	while(transform.position.y != 0)
		{
			transform.position = Vector2.Lerp(transform.position, Vector2(0,0),Time.deltaTime*4);
			transform.position = Vector2.MoveTowards(transform.position, Vector2(0,0),Time.deltaTime*2);
			yield;
		}
	while(!currentText.GetComponent(TextManager).finished) {yield;}
		finger.transform.position.y = 100;
		finger.transform.position.x = 100;
		blocker.transform.position = Vector3(-23,12,-3.5);
		currentButtonLocation = Vector2(-100,-100);
		Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
	yield WaitForSeconds(1.4);
		PlayerPrefs.SetInt("TutorialFinished", 1);
		Application.LoadLevel("TutorialWorld");
	yield;
}

function LaunchText(text:GameObject) {
	if(GameObject.FindGameObjectWithTag("Transition") == null)
	{
		currentText = Instantiate(text);
	}
}

function TutorialClick (location:Vector2) {
	//Debug.Log(location + "  " + currentButtonLocation);
	if(Vector2.Distance(location,currentButtonLocation) < 4)
	{
		tutorialStage ++;
	}
}