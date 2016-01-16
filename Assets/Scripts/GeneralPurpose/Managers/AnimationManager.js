#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var standingSprites:Sprite[];
var walkSpriteBack:Sprite[];
var walkSpriteFront:Sprite[];

var specialHeadBob:Sprite;
var specialOneHand:Sprite;
var specialTwoHandsOut:Sprite;
var specialTwoHandsUp:Sprite;

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
	if(transform.parent != null || transform.parent.parent != null)
	{
		if(gameObject.tag == "Player")
		{
			playerManager = GetComponent(PlayerManager);
		}
		else if(transform.parent.GetComponent(PlayerManager) != null)
		{
			playerManager = transform.parent.GetComponent(PlayerManager);
		}
		else if(transform.parent.parent != null)
		{
			if(transform.parent.parent.GetComponent(PlayerManager) != null)
			{
				playerManager = transform.parent.parent.GetComponent(PlayerManager);
			}
		}
		
		rotatingSprites = new Sprite[4];
		if(playerManager != null)
		{
			FillInBlanks();
			GrabAnimationLoop();
			StartCoroutine(Move());
		}
	}
}
function Update () {

}

function Move() {
	while(true)
	{
		if(transform.name == "Mouth" && cutscene)
		{
			GetComponent(SpriteRenderer).sprite = rotatingSprites[0];
		}
		else if(!cutscene)
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
		case PlayerState.SpecialHeadBob:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = specialHeadBob;
			rotatingSprites[1] = standingSprites[1];
			rotatingSprites[2] = specialHeadBob;
			rotatingSprites[3] = standingSprites[1];
			break;
		case PlayerState.Cutscene:
			transform.localScale.x = Mathf.Abs(transform.localScale.x) * flipped;
			rotatingSprites[0] = standingSprites[1];
			rotatingSprites[1] = specialOneHand;
			rotatingSprites[2] = specialTwoHandsOut;
			rotatingSprites[3] = specialTwoHandsUp;
			break;
		default:
			break;
	}
}

function FillInBlanks () {
	if(specialHeadBob == null)
	{
		specialHeadBob = standingSprites[1];
	}
	if(specialOneHand == null)
	{
		specialOneHand = standingSprites[1];
	}
	if(specialTwoHandsOut == null)
	{
		specialTwoHandsOut = standingSprites[1];
	}
	if(specialTwoHandsUp == null)
	{
		specialTwoHandsUp = standingSprites[1];
	}
}

function Frown (frowning:boolean) {
	frown = frowning;
}

function SpriteChange(data:int) {
	yield WaitForEndOfFrame;
	if(transform.name != "Mouth")
	{
		GetComponent(SpriteRenderer).sprite = rotatingSprites[Mathf.Min(data,3)];
	}
}

function Cutscene () {
	cutscene = true;
}