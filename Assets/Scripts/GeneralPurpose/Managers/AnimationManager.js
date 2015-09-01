#pragma strict

var standingSprites:Sprite[];
var walkSpriteBack:Sprite[];
var walkSpriteFront:Sprite[];
var walkSpriteSide:Sprite[];

var specialHandsOut:Sprite;
var specialFrown:Sprite;
var specialFrownSinging:Sprite;
var specialHeadBob:Sprite;
var specialHighNote:Sprite;
var specialSinging:Sprite;
var specialLoudSing:Sprite;
var specialOneHandSing:Sprite;
var specialOneHand:Sprite;
var specialHandsOutSing:Sprite;
var specialHandsOutHighNote:Sprite;

@HideInInspector var frown:boolean = false;

@HideInInspector var rotatingSprites:Sprite[];

@HideInInspector var cutscene:boolean = false;

var flipped:int;

var playerManager:PlayerManager;

function Start () {
	if(flipped != -1)
	{
		flipped = 1;
	}
	if(gameObject.tag == "Player")
	{
		playerManager = GetComponent(PlayerManager);
	}
	else if(transform.parent.GetComponent(PlayerManager) != null)
	{
		playerManager = transform.parent.GetComponent(PlayerManager);
	}
	rotatingSprites = new Sprite[4];
	FillInBlanks();
	GrabAnimationLoop();
	StartCoroutine(Move());
}
function Update () {

}

function Move() {
	while(true)
	{
		if(transform.name == "Mouth")
		{
			GetComponent(SpriteRenderer).sprite = rotatingSprites[0];
		}
		else
		{
			switch(playerManager.step)
			{
				case 1:
					GetComponent(SpriteRenderer).sprite = rotatingSprites[0];
					break;
				case 2:
					GetComponent(SpriteRenderer).sprite = rotatingSprites[1];
					break;
				case 3:
					GetComponent(SpriteRenderer).sprite = rotatingSprites[2];
					break;
				case 4:
					GetComponent(SpriteRenderer).sprite = rotatingSprites[3];
					break;
				default:
					break;
			}
		}
		if(!cutscene)
		{
			GrabAnimationLoop();
		}
		yield;
	}
}

function GrabAnimationLoop()
{
	switch(playerManager.currentState)
	{
		case PlayerState.StandingFront:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = standingSprites[1];
			rotatingSprites[1] = standingSprites[1];
			rotatingSprites[2] = standingSprites[1];
			rotatingSprites[3] = standingSprites[1];
			break;
		case PlayerState.StandingBack:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = standingSprites[0];
			rotatingSprites[1] = standingSprites[0];
			rotatingSprites[2] = standingSprites[0];
			rotatingSprites[3] = standingSprites[0];
			break;
		case PlayerState.StandingLeft:
			if(GetComponent(PlayerManager) != null)
			{
				transform.localScale.x = Mathf.Abs(transform.localScale.x) * -1;
			}
			rotatingSprites[0] = standingSprites[2];
			rotatingSprites[1] = standingSprites[2];
			rotatingSprites[2] = standingSprites[2];
			rotatingSprites[3] = standingSprites[2];
			break;
		case PlayerState.StandingRight:
			transform.localScale.x = Mathf.Abs(transform.localScale.x);
			rotatingSprites[0] = standingSprites[2];
			rotatingSprites[1] = standingSprites[2];
			rotatingSprites[2] = standingSprites[2];
			rotatingSprites[3] = standingSprites[2];
			break;
		case PlayerState.WalkingFront:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = walkSpriteFront[0];
			rotatingSprites[1] = standingSprites[1];
			rotatingSprites[2] = walkSpriteFront[1];
			rotatingSprites[3] = standingSprites[1];
			break;
		case PlayerState.WalkingBack:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = walkSpriteBack[0];
			rotatingSprites[1] = standingSprites[0];
			rotatingSprites[2] = walkSpriteBack[1];
			rotatingSprites[3] = standingSprites[0];
			break;
		case PlayerState.WalkingLeft:
			if(GetComponent(PlayerManager) != null)
			{
				transform.localScale.x = Mathf.Abs(transform.localScale.x) * -1;
			}
			rotatingSprites[0] = walkSpriteSide[0];
			rotatingSprites[1] = standingSprites[2];
			rotatingSprites[2] = walkSpriteSide[1];
			rotatingSprites[3] = standingSprites[2];
			break;
		case PlayerState.WalkingRight:
			transform.localScale.x = Mathf.Abs(transform.localScale.x);
			rotatingSprites[0] = walkSpriteSide[0];
			rotatingSprites[1] = standingSprites[2];
			rotatingSprites[2] = walkSpriteSide[1];
			rotatingSprites[3] = standingSprites[2];
			break;
		case PlayerState.SpecialHandsOut:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = specialHandsOut;
			rotatingSprites[1] = specialHandsOut;
			rotatingSprites[2] = specialHandsOut;
			rotatingSprites[3] = specialHandsOut;
			break;
		case PlayerState.SpecialHeadBob:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = specialHeadBob;
			rotatingSprites[1] = standingSprites[1];
			rotatingSprites[2] = specialHeadBob;
			rotatingSprites[3] = standingSprites[1];
			break;
		case PlayerState.SpecialFrown:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = specialFrown;
			rotatingSprites[1] = specialFrown;
			rotatingSprites[2] = specialFrown;
			rotatingSprites[3] = specialFrown;
			break;
		case PlayerState.SpecialFrownSinging:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = specialFrown;
			rotatingSprites[1] = specialFrownSinging;
			rotatingSprites[2] = specialFrown;
			rotatingSprites[3] = specialFrownSinging;
			break;
		case PlayerState.SpecialSinging:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = standingSprites[1];
			rotatingSprites[1] = specialSinging;
			rotatingSprites[2] = standingSprites[1];
			rotatingSprites[3] = specialSinging;
			break;
		case PlayerState.SpecialLoudSinging:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = standingSprites[1];
			rotatingSprites[1] = specialSinging;
			rotatingSprites[2] = specialLoudSing;
			rotatingSprites[3] = specialLoudSing;
			break;
		case PlayerState.SpecialHighNote:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = specialHighNote;
			rotatingSprites[1] = specialHighNote;
			rotatingSprites[2] = specialHighNote;
			rotatingSprites[3] = specialHighNote;
			break;
		case PlayerState.SpecialOneHandSing:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = specialOneHand;
			rotatingSprites[1] = specialOneHandSing;
			rotatingSprites[2] = specialOneHand;
			rotatingSprites[3] = specialOneHandSing;
			break;
		case PlayerState.SpecialHandsOutSing:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = specialHandsOut;
			rotatingSprites[1] = specialHandsOutSing;
			rotatingSprites[2] = specialHandsOut;
			rotatingSprites[3] = specialHandsOutSing;
			break;
		case PlayerState.SpecialHandsOutLoudSing:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = specialHandsOut;
			rotatingSprites[1] = specialHandsOutSing;
			rotatingSprites[2] = specialHandsOutHighNote;
			rotatingSprites[3] = specialHandsOutHighNote;
			break;
		case PlayerState.SpecialHandsOutHighNote:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = specialHandsOutHighNote;
			rotatingSprites[1] = specialHandsOutHighNote;
			rotatingSprites[2] = specialHandsOutHighNote;
			rotatingSprites[3] = specialHandsOutHighNote;
			break;
		default:
			break;
	}
}

function FillInBlanks () {
	if(specialHandsOut == null)
	{
		specialHandsOut = standingSprites[1];
	}
	if(specialHeadBob == null)
	{
		specialHeadBob = standingSprites[1];
	}
	if(specialFrown == null)
	{
		specialFrown = standingSprites[1];
	}
	if(specialHighNote == null)
	{
		specialHighNote = standingSprites[1];
	}
	if(specialSinging == null)
	{
		specialSinging = standingSprites[1];
	}
	if(specialFrownSinging == null)
	{
		specialFrownSinging = specialSinging;
	}
	if(specialLoudSing == null)
	{
		specialLoudSing = standingSprites[1];
	}
	if(specialOneHandSing == null)
	{
		specialOneHandSing = standingSprites[1];
	}
	if(specialOneHand == null)
	{
		specialOneHand = specialOneHandSing;
	}
	if(specialHandsOutSing == null)
	{
		specialHandsOutSing = specialHandsOut;
	}
	if(specialHandsOutHighNote == null)
	{
		specialHandsOutHighNote = specialHandsOutSing;
	}
}

function Frown (frowning:boolean) {
	frown = frowning;
}

function Cutscene () {
	cutscene = true;
}