#pragma strict

public enum LedgerState{Closed,FirstOpened,Transition,Menu,Worlds,Leaving,EnteringHardMode};

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
var hardModeButtonVertical:GameObject;
var hardModeButtonHorizontal:GameObject;

@HideInInspector private var openingButtonOriginalSprite:Sprite;
@HideInInspector private var repriseButtonOriginalSprite:Sprite;
@HideInInspector private var entracteButtonOriginalSprite:Sprite;
@HideInInspector private var act2ButtonOriginalSprite:Sprite;
@HideInInspector private var encore1ButtonOriginalSprite:Sprite;
@HideInInspector private var encore2ButtonOriginalSprite:Sprite;
@HideInInspector private var encore3ButtonOriginalSprite:Sprite;
@HideInInspector private var encore4ButtonOriginalSprite:Sprite;
@HideInInspector private var hardModeOriginalSprite:Sprite;

var lockedSprite:Sprite;
var worldSprites:Sprite[];
var worldDisplays:SpriteRenderer[];

var blackout:SpriteRenderer;
var border:SpriteRenderer;
var pageFlipSprites:Sprite[];
var pageFlip:SpriteRenderer;

var pieces:StatPieces;

@HideInInspector var startTime:float;

static var videoPlaying:boolean;
static var songPlaying:boolean;

var transition:GameObject;

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
	hardModeOriginalSprite = hardModeButtonVertical.transform.GetChild(0).GetComponent(SpriteRenderer).sprite;
			
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
	startTime = 0;
}
function Update () {
	startTime += Time.deltaTime;
	if(theaterController.currentState == TheaterStatus.Stats && startTime > 1)
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
	EnableHardMode(hardModeButtonVertical,hardModeOriginalSprite);
	EnableHardMode(hardModeButtonHorizontal,hardModeOriginalSprite);
	if(PlayerPrefs.GetInt(worldName+"PlayedOnce") != 1)
	{
		DisableButton(entracteButton);
	}
	if(PlayerPrefs.GetInt(worldName+"FirstOpeningPlayed") < 1)
	{
		DisableButton(openingButton);
	}
	if(PlayerPrefs.GetInt(worldName+"RegularOpeningPlayed") < 1)
	{
		DisableButton(repriseButton);
	}
	if(PlayerPrefs.GetInt(worldName+"BeatEndPlayed") < 1)
	{
		DisableButton(act2Button);
	}
	if(PlayerPrefs.GetInt(worldName+"End1Played") < 1)
	{
		DisableButton(encore1Button);
	}
	if(PlayerPrefs.GetInt(worldName+"End2Played") < 1)
	{	
		DisableButton(encore2Button);
	}
	if(PlayerPrefs.GetInt(worldName+"End3Played") < 1)
	{
		DisableButton(encore3Button);
	}
	if(PlayerPrefs.GetInt(worldName+"End4Played") < 1)
	{
		DisableButton(encore4Button);
		DisableHardMode(hardModeButtonVertical);
		DisableHardMode(hardModeButtonHorizontal);
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

function EnableHardMode(button:GameObject, sprite:Sprite) {
	button.GetComponent(ButtonSquare).subText.GetComponent(SpriteRenderer).sprite = sprite;
	button.GetComponent(ButtonSquare).enabled = true;
}

function DisableHardMode(button:GameObject) {
	button.GetComponent(ButtonSquare).subText.GetComponent(SpriteRenderer).sprite = lockedSprite;
	button.GetComponent(ButtonSquare).subText.GetComponent(SpriteRenderer).color.a = .6;
	button.GetComponent(ButtonSquare).enabled = false;
	button.GetComponent(SpriteRenderer).color = Color(.4,.4,.4,1);
}

function VideoButtonPress (which:String) {
	if(!videoPlaying)
	{
		switch (which)
		{
			case "Opening":
				RunVideo(world.text.firstOpening);
				break;
			case "Reprise":
				RunVideo(world.text.regularOpening);
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
				RunVideo(world.text.beatEnd);
				break;
			case "1":
				RunVideo(world.text.end1);
				break;
			case "2":
				RunVideo(world.text.end2);
				break;
			case "3":
				RunVideo(world.text.end3);
				break;
			case "4":
				RunVideo(world.text.end4);
				break;
		}
	}
}

function RunVideo (text:GameObject) {
	songPlaying = false;
	videoPlaying = true;
	loadedText = Instantiate(text);
	AudioManager.StopAll();
	while(loadedText != null)
	{
		blackout.color.a = Mathf.MoveTowards(blackout.color.a,.75,Time.deltaTime);
		border.color.a = Mathf.MoveTowards(border.color.a,1,Time.deltaTime * 8);
		yield;
	}
	AudioManager.StopAll();
	theaterController.PlayAudio();
	border.color.a = 0;
	yield WaitForEndOfFrame;
	videoPlaying = false;
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

function StartHardMode () {
	if(currentState != LedgerState.EnteringHardMode && !videoPlaying) 
	{
		currentState = LedgerState.EnteringHardMode;
		Master.hardMode = true;
		Master.currentWorld = world;
		if(transition != null)
		{
			AudioManager.PlaySoundTransition(controller.currentWorld.audio.transitionIn);
			Instantiate(transition, Vector3(0,0,-9.5), Quaternion.identity);
		}
		yield WaitForSeconds(.7);
		AudioManager.StopSong();
		yield WaitForSeconds(1);
		Application.LoadLevel("MicroGameLauncher");
	}
}