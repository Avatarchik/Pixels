#pragma strict

@HideInInspector var step:int;
var smokeLeft:ParticleSystem;
var smokeRight:ParticleSystem;
var sparksLeft:ParticleSystem;
var sparksRight:ParticleSystem;
var theaterLeft:SpriteRenderer;
var theaterRight:SpriteRenderer;
var monster:SpriteRenderer;

function Start () {
	step = 0;
	theaterLeft.color.a = 0;
	theaterRight.color.a = 0;
}

function Update () {
	switch(step)
	{
		case 0:
			smokeLeft.emissionRate = 30;
			smokeRight.emissionRate = 30;
			sparksLeft.emissionRate = 0;
			sparksRight.emissionRate = 0;
			
			theaterLeft.color.a = Mathf.MoveTowards(theaterLeft.color.a,1,Time.deltaTime * .4);
			theaterRight.color.a = Mathf.MoveTowards(theaterRight.color.a,1,Time.deltaTime * .4);
			monster.color.a = Mathf.MoveTowards(monster.color.a,0,Time.deltaTime);
			break;
		case 1:
			smokeLeft.emissionRate = 30;
			smokeRight.emissionRate = 30;
			sparksLeft.emissionRate = 0;
			sparksRight.emissionRate = 0;
			
			theaterLeft.color.a = Mathf.MoveTowards(theaterLeft.color.a,1,Time.deltaTime);
			theaterRight.color.a = Mathf.MoveTowards(theaterRight.color.a,1,Time.deltaTime);
			
			monster.color.a = Mathf.MoveTowards(monster.color.a,0,Time.deltaTime);
			break;
		case 2:
			smokeLeft.emissionRate = 30;
			smokeRight.emissionRate = 30;
			sparksLeft.emissionRate = 40;
			sparksRight.emissionRate = 0;
			
			theaterLeft.color.a = Mathf.MoveTowards(theaterLeft.color.a,1,Time.deltaTime);
			theaterRight.color.a = Mathf.MoveTowards(theaterRight.color.a,1,Time.deltaTime);
			
			theaterLeft.transform.position.x -= Time.deltaTime * .65;
			theaterRight.transform.position.x += Time.deltaTime * .65;
			
			monster.color.a = Mathf.MoveTowards(monster.color.a,0,Time.deltaTime);
			break;
		case 3:
			smokeLeft.emissionRate = 80;
			smokeRight.emissionRate = 80;
			sparksLeft.emissionRate = 40;
			sparksRight.emissionRate = 40;
			
			theaterLeft.color.a = Mathf.MoveTowards(theaterLeft.color.a,1,Time.deltaTime);
			theaterRight.color.a = Mathf.MoveTowards(theaterRight.color.a,1,Time.deltaTime);
			
			theaterLeft.transform.position.x -= Time.deltaTime * .65;
			theaterRight.transform.position.x += Time.deltaTime * .65;
			
			monster.color.a = Mathf.MoveTowards(monster.color.a,0,Time.deltaTime);
			break;
		case 4:
			smokeLeft.emissionRate = 10;
			smokeRight.emissionRate = 10;
			sparksLeft.emissionRate = 0;
			sparksRight.emissionRate = 0;
			
			theaterLeft.color.a = Mathf.MoveTowards(theaterLeft.color.a,0,Time.deltaTime);
			theaterRight.color.a = Mathf.MoveTowards(theaterRight.color.a,0,Time.deltaTime);
			
			theaterLeft.transform.position.x -= Time.deltaTime * .65;
			theaterRight.transform.position.x += Time.deltaTime * .65;
			
			monster.color.a = Mathf.MoveTowards(monster.color.a,0,Time.deltaTime);
			break;
		case 5:
			smokeLeft.emissionRate = 30;
			smokeRight.emissionRate = 30;
			sparksLeft.emissionRate = 0;
			sparksRight.emissionRate = 0;
			
			theaterLeft.color.a = Mathf.MoveTowards(theaterLeft.color.a,0,Time.deltaTime);
			theaterRight.color.a = Mathf.MoveTowards(theaterRight.color.a,0,Time.deltaTime);
			
			theaterLeft.transform.position.x -= Time.deltaTime * .65;
			theaterRight.transform.position.x += Time.deltaTime * .65;
			
			monster.color.a = Mathf.MoveTowards(monster.color.a,1,Time.deltaTime);
			monster.transform.position.y += Time.deltaTime * .5;
			break;
		case 6:
			smokeLeft.emissionRate = 30;
			smokeRight.emissionRate = 30;
			sparksLeft.emissionRate = 0;
			sparksRight.emissionRate = 0;
			
			theaterLeft.color.a = Mathf.MoveTowards(theaterLeft.color.a,0,Time.deltaTime);
			theaterRight.color.a = Mathf.MoveTowards(theaterRight.color.a,0,Time.deltaTime);
			
			monster.color.a = Mathf.MoveTowards(monster.color.a,0,Time.deltaTime * .2);
			monster.transform.position.y += Time.deltaTime * .5;
			break;
		case 7:
			smokeLeft.emissionRate = 0;
			smokeRight.emissionRate = 0;
			sparksLeft.emissionRate = 0;
			sparksRight.emissionRate = 0;
			
			theaterLeft.color.a = Mathf.MoveTowards(theaterLeft.color.a,0,Time.deltaTime);
			theaterRight.color.a = Mathf.MoveTowards(theaterRight.color.a,0,Time.deltaTime);
			
			monster.color.a = Mathf.MoveTowards(monster.color.a,0,Time.deltaTime);
			monster.transform.position.y += Time.deltaTime * .5;
			break;
		case 8:
			smokeLeft.emissionRate = 0;
			smokeRight.emissionRate = 0;
			sparksLeft.emissionRate = 0;
			sparksRight.emissionRate = 0;
			
			theaterLeft.color.a = Mathf.MoveTowards(theaterLeft.color.a,0,Time.deltaTime);
			theaterRight.color.a = Mathf.MoveTowards(theaterRight.color.a,0,Time.deltaTime);
			break;
		default:
			break;
	}
}

function SetSongSprite (spriteNumber:int) {
	if(spriteNumber == 1)
	{
		step++;
	}
}