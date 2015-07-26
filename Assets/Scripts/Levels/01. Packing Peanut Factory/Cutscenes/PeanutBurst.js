#pragma strict

var peanutBurster:ParticleSystem;

function Start () {

}

function Update () {

}

function StopParent () {
	transform.parent.GetComponent(ParticleSystem).emissionRate = 0;
}
function SetSongSprite (spriteNumber:int) {
	if(spriteNumber == 1)
	{	
		peanutBurster.Emit(10);
	}
	else
	{
		
	}
}