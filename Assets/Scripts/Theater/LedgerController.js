#pragma strict

public enum LedgerState{Closed,FirstOpened,Transition,Menu,Worlds,Leaving};

class StatPieces {
	var menu:GameObject;
	var worlds:GameObject;
}

static var currentState:LedgerState;

@HideInInspector var controller:Master;
@HideInInspector var theaterController:TheaterController;
@HideInInspector var currentSelection:int;
@HideInInspector var world:World;

@HideInInspector var worldNames:String[];

var cover:GameObject;

var openingButton:GameObject;
var repriseButton:GameObject;
var entracteButton:GameObject;
var act2Button:GameObject;
var encore1Button:GameObject;
var encore2Button:GameObject;
var encore3Button:GameObject;
var encore4Button:GameObject;

@HideInInspector private var openingButtonOriginalSprite:Sprite;
@HideInInspector private var repriseButtonOriginalSprite:Sprite;
@HideInInspector private var entracteButtonOriginalSprite:Sprite;
@HideInInspector private var act2ButtonOriginalSprite:Sprite;
@HideInInspector private var encore1ButtonOriginalSprite:Sprite;
@HideInInspector private var encore2ButtonOriginalSprite:Sprite;
@HideInInspector private var encore3ButtonOriginalSprite:Sprite;
@HideInInspector private var encore4ButtonOriginalSprite:Sprite;

var lockedSprite:Sprite;
var worldSprites:Sprite[];
var worldDisplays:SpriteRenderer[];

var blackout:SpriteRenderer;
var border:SpriteRenderer;
var pageFlipSprites:Sprite[];
var pageFlip:SpriteRenderer;

var pieces:StatPieces;

static var videoPlaying:boolean;
static var songPlaying:boolean;

@HideInInspector var onScreen:float;
@HideInInspector var offScreen:float;
@HideInInspector var loadedText:GameObject;

function Start () {
	pageFlip.sprite = null;
	openingButtonOriginalSprite = openingButton.transform.GetChild(0).GetComponent(SpriteRenderer).sprite;
	repriseButtonOriginalSprite = repriseButton.transform.GetChild(0).GetComponent(SpriteRenderer).sprite;
	entracteButtonOriginalSprite = entracteButton.transform.GetChild(0).GetComponent(SpriteRenderer).sprite;
	act2ButtonOriginalSprite = act2Button.transform.GetChild(0).GetComponent(SpriteRenderer).sprite;
	encore1ButtonOriginalSprite = encore1Button.transform.GetChild(0).GetComponent(SpriteRenderer).sprite;
	encore2ButtonOriginalSprite = encore2Button.transform.GetChild(0).GetComponent(SpriteRenderer).sprite;
	encore3ButtonOriginalSprite = encore3Button.transform.GetChild(0).GetComponent(SpriteRenderer).sprite;
	encore4ButtonOriginalSprite = encore4Button.transform.GetChild(0).GetComponent(SpriteRenderer).sprite;
			
	theaterController = GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterController);
	worldNames = ["PackingPeanutFactory","Museum","HighSchool","Neverland"];
	onScreen = 0;
	offScreen = -100;
	videoPlaying = false;
	songPlaying = false;
	currentState = LedgerState.Closed;
	controller = Camera.main.GetComponent(Master);
	currentSelection = 0;
	ChooseWorld();
	UpdateDisplay(world.basic.worldNameVar);
}

function Update () {
	if(theaterController.currentState == TheaterStatus.Stats)
	{
		if(currentState == LedgerState.Closed && Mathf.Abs(transform.position.x) < 1)
		{
			RemoveCover();
			currentState = LedgerState.FirstOpened;
		}
	}
	else
	{
		if(currentState == LedgerState.Leaving)
		{
			CloseCover();
		}
		currentState = LedgerState.Closed;
	}
	if(loadedText == null)
	{
		blackout.color.a = Mathf.MoveTowards(blackout.color.a,0,Time.deltaTime);
		border.color.a = 0;
	}
	else
	{
		blackout.color.a = Mathf.MoveTowards(blackout.color.a,.75,Time.deltaTime);
		border.color.a = Mathf.MoveTowards(border.color.a,1,Time.deltaTime * 8);
	}
}

function ChooseWorld() {
	for(var selection:World in controller.worlds)
	{
		if(selection.basic.worldNameVar == worldNames[currentSelection])
		{
			world = selection;
		}
	}
}

function ChangeSelection(change:int) {
	currentSelection += change;
	if(currentSelection >= worldNames.Length)
	{
		currentSelection = 0;
	}
	else if(currentSelection < 0)
	{
		currentSelection = worldNames.Length - 1;
	}
	ReplaceCover(currentState);
}

function UpdateDisplay(worldName:String){
	for(var i:int = 0; i < worldDisplays.length; i++)
	{
		worldDisplays[i].sprite = worldSprites[currentSelection];
	}
	EnableButton(openingButton,openingButtonOriginalSprite);
	EnableButton(entracteButton,entracteButtonOriginalSprite);
	EnableButton(repriseButton,repriseButtonOriginalSprite);
	EnableButton(encore1Button,encore1ButtonOriginalSprite);
	EnableButton(act2Button,act2ButtonOriginalSprite);
	EnableButton(encore2Button,encore2ButtonOriginalSprite);
	EnableButton(encore3Button,encore3ButtonOriginalSprite);
	EnableButton(encore4Button,encore4ButtonOriginalSprite);
	if(PlayerPrefs.GetInt(worldName+"PlayedOnce") != 1)
	{
		DisableButton(openingButton);
		DisableButton(entracteButton);
		DisableButton(repriseButton);
	}
	if(PlayerPrefs.GetInt(worldName+"HighScore") < 1)
	{
		DisableButton(encore1Button);
	}
	if(PlayerPrefs.GetInt(worldName+"Beaten") < 1)
	{
		DisableButton(act2Button);
	}
	if(PlayerPrefs.GetInt(worldName+"Unlocks") < 1)
	{	
		DisableButton(encore2Button);
	}
	if(PlayerPrefs.GetInt(worldName+"Unlocks") < 2)
	{
		DisableButton(encore3Button);
	}
	if(PlayerPrefs.GetInt(worldName+"Unlocks") < 3)
	{
		DisableButton(encore4Button);
	}
}

function DisableButton(button:GameObject) {
	button.GetComponent(ButtonRectangle).subText.GetComponent(SpriteRenderer).sprite = lockedSprite;
	button.GetComponent(ButtonRectangle).enabled = false;
	button.GetComponent(SpriteRenderer).color = Color(.8,.2,.2,1);
}

function EnableButton(button:GameObject, sprite:Sprite) {
	button.GetComponent(ButtonRectangle).subText.GetComponent(SpriteRenderer).sprite = sprite;
	button.GetComponent(ButtonRectangle).enabled = true;
	button.GetComponent(SpriteRenderer).color = Color(.324,.6,.78,1);
}

function VideoButtonPress (which:String) {
	if(!videoPlaying)
	{
		switch (which)
		{
			case "Opening":
				RunVideo(world.text.firstOpening,world.text.firstOpeningSong);
				break;
			case "Reprise":
				RunVideo(world.text.regularOpening,world.text.regularOpeningSong);
				break;
			case "Entracte":
				if(songPlaying)
				{
					AudioManager.StopAll();
					AudioManager.PlaySound(world.audio.music[0]);
				}
				else
				{
					AudioManager.StopAll();
					theaterController.PlayAudio();
				}
				break;
			case "Fin":
				RunVideo(world.text.beatEnd,world.text.beatEndSong);
				break;
			case "1":
				RunVideo(world.text.end1,world.text.end1Song);
				break;
			case "2":
				RunVideo(world.text.end2,world.text.end2Song);
				break;
			case "3":
				RunVideo(world.text.end3,world.text.end3Song);
				break;
			case "4":
				RunVideo(world.text.end4,world.text.end4Song);
				break;
		}
	}
}

function RunVideo (text:GameObject,song:AudioClip) {
	songPlaying = false;
	videoPlaying = true;
	loadedText = Instantiate(text);
	AudioManager.StopAll();
//	AudioManager.PlaySound(song);
	while(loadedText != null)
	{
		blackout.color.a = Mathf.MoveTowards(blackout.color.a,.75,Time.deltaTime);
		border.color.a = Mathf.MoveTowards(border.color.a,1,Time.deltaTime * 8);
		yield;
	}
	AudioManager.StopAll();
	theaterController.PlayAudio();
	videoPlaying = false;
	border.color.a = 0;
	while(blackout.color.a != 0)
	{
		blackout.color.a = Mathf.MoveTowards(blackout.color.a,0,Time.deltaTime);
		yield;
	}
}

function SwitchLocations (choice:LedgerState) {
	switch(choice)
	{
		case LedgerState.Closed:
			break;
		case LedgerState.FirstOpened:
			break;
		case LedgerState.Transition:
			break;
		case LedgerState.Menu:
			pieces.menu.transform.localPosition.x = onScreen;
			pieces.worlds.transform.localPosition.x = offScreen;
			break;
		case LedgerState.Worlds:
			pieces.menu.transform.localPosition.x = offScreen;
			pieces.worlds.transform.localPosition.x = onScreen;
			break;
		case LedgerState.Leaving:
			break;
		default:
			break;
	}
}

function RemoveCover () {
	yield WaitForSeconds(.5);
	SwitchLocations(LedgerState.Menu);
	while(Mathf.Abs(cover.transform.localPosition.x + 2.4) > .01 && theaterController.currentState == TheaterStatus.Stats)
	{
		cover.transform.localPosition.x = Mathf.MoveTowards(cover.transform.localPosition.x,-2.4,Time.deltaTime * 1.3);
		cover.transform.localPosition.x = Mathf.Lerp(cover.transform.localPosition.x,-2.4,Time.deltaTime * 1.3);
		yield;
	}
	currentState = LedgerState.Menu;
}

function ReplaceCover (newState:LedgerState) {
	var waitSpeed:float = .025;
	pageFlip.sprite = pageFlipSprites[0]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[1]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[2]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[3]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[4]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[5]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[6]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[7]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[8]; yield WaitForSeconds(waitSpeed);
	currentState = newState;
	SwitchLocations(currentState);
	ChooseWorld();
	UpdateDisplay(world.basic.worldNameVar);
	yield WaitForSeconds(.05);
	pageFlip.sprite = pageFlipSprites[7]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[6]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[5]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[4]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[3]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[2]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[1]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = pageFlipSprites[0]; yield WaitForSeconds(waitSpeed);
	pageFlip.sprite = null;
}

function CloseCover () {
	while(Mathf.Abs(cover.transform.localPosition.x) > 0.01 && theaterController.currentState != TheaterStatus.Stats)
	{
		cover.transform.localPosition.x = Mathf.MoveTowards(cover.transform.localPosition.x,0,Time.deltaTime * 1.3);
		cover.transform.localPosition.x = Mathf.Lerp(cover.transform.localPosition.x,0,Time.deltaTime * 1.3);
		yield;
	}
}