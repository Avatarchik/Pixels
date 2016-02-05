#pragma strict

@HideInInspector var open:boolean = false;
@HideInInspector var phonemeTime:float;

@HideInInspector var currentPhoneme:Phoneme;

var mouthClosed:Sprite;
var mouthOpen:Sprite;
var mouthWide:Sprite;

var mouthFrownClosed:Sprite;
var mouthFrownOpen:Sprite;
var mouthFrownWide:Sprite;

@HideInInspector var currentSprite:Sprite;
@HideInInspector var currentFrownSprite:Sprite;


function Start () {
	phonemeTime = .05;
	currentPhoneme = Phoneme.type1;
	currentFrownSprite = mouthFrownClosed;
	currentSprite = mouthClosed;
}

function Update () {
	if(transform.parent.GetComponent(PlayerManager).currentState != PlayerState.SpecialHeadBob && transform.parent.GetComponent(PlayerManager).currentState != PlayerState.WalkingFront)
	{
		UpdateSprites();
	}
}

function PhonemeState (phoneme:Phoneme) {
	currentPhoneme = phoneme;
}

function MouthState (state:int) {
	switch(state)
	{
		case 0:
			CloseMouth(mouthClosed,mouthFrownClosed);
			break;
		case 1:
			OpenMouth(mouthOpen,mouthFrownOpen);
			break;
		case 2:
			OpenMouth(mouthWide,mouthFrownWide);
			break;
		default:
			break;
	}
}

function OpenMouth (newSprite:Sprite, newFrownSprite:Sprite) {
	open = true;
	// do phoneme stuff here
	if(open)
	{
		currentSprite = newSprite;
		currentFrownSprite = newFrownSprite;
	}
	UpdateSprites();
}

function CloseMouth (newSprite:Sprite, newFrownSprite:Sprite) {
	open = false;
	if(!open)
	{
		currentSprite = newSprite;
		currentFrownSprite = newFrownSprite;
	}
	UpdateSprites();
}

function UpdateSprites () {
	if(GetComponent(AnimationManager).frown)
	{
		GetComponent(SpriteRenderer).sprite = currentFrownSprite;
		GetComponent(AnimationManager).rotatingSprites[0] = currentFrownSprite;
	}
	else
	{
		GetComponent(SpriteRenderer).sprite = currentSprite;
		GetComponent(AnimationManager).rotatingSprites[0] = currentSprite;
	}
}