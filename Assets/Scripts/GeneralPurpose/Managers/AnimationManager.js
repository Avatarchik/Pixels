#pragma strict

var standingSprites:Sprite[];
var walkSpriteBack:Sprite[];
var walkSpriteFront:Sprite[];
var walkSpriteSide:Sprite[];

var waitTime:float;

function Start () {
	StartCoroutine(Move());
}

function Move() {
	while(true)
	{
		waitTime = PlayerManager.speed;
		switch(PlayerManager.currentState)
		{
			case PlayerState.StandingFront:
				transform.localScale.x = Mathf.Abs(transform.localScale.x);
				GetComponent(SpriteRenderer).sprite = standingSprites[1];
				break;
			case PlayerState.StandingBack:
				transform.localScale.x = Mathf.Abs(transform.localScale.x);
				GetComponent(SpriteRenderer).sprite = standingSprites[0];
				break;
			case PlayerState.StandingLeft:
				if(GetComponent(PlayerManager) != null)
				{
					transform.localScale.x = Mathf.Abs(transform.localScale.x) * -1;
				}
				GetComponent(SpriteRenderer).sprite = standingSprites[2];
				break;
			case PlayerState.StandingRight:
				transform.localScale.x = Mathf.Abs(transform.localScale.x);
				GetComponent(SpriteRenderer).sprite = standingSprites[2];
				break;
			case PlayerState.WalkingFront:
				transform.localScale.x = Mathf.Abs(transform.localScale.x);
				GetComponent(SpriteRenderer).sprite = walkSpriteFront[0];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = standingSprites[1];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = walkSpriteFront[1];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = standingSprites[1];
				yield WaitForSeconds(waitTime);
				break;
			case PlayerState.WalkingBack:
				transform.localScale.x = Mathf.Abs(transform.localScale.x);
				GetComponent(SpriteRenderer).sprite = walkSpriteBack[0];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = standingSprites[0];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = walkSpriteBack[1];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = standingSprites[0];
				yield WaitForSeconds(waitTime);
				break;
			case PlayerState.WalkingLeft:
				if(GetComponent(PlayerManager) != null)
				{
					transform.localScale.x = Mathf.Abs(transform.localScale.x) * -1;
				}
				GetComponent(SpriteRenderer).sprite = walkSpriteSide[0];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = standingSprites[2];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = walkSpriteSide[1];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = standingSprites[2];
				yield WaitForSeconds(waitTime);
				break;
			case PlayerState.WalkingRight:
				transform.localScale.x = Mathf.Abs(transform.localScale.x);
				GetComponent(SpriteRenderer).sprite = walkSpriteSide[0];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = standingSprites[2];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = walkSpriteSide[1];
				yield WaitForSeconds(waitTime);
				GetComponent(SpriteRenderer).sprite = standingSprites[2];
				yield WaitForSeconds(waitTime);
				break;
			default:
				break;
		}
		yield;
	}
}
