#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var emitter:ParticleSystem;

var amountToEmit:int;

var hold:boolean;

@HideInInspector var on:boolean;

var frequency:float;

function Start () {
	on = false;
	if(hold)
	{
		Hold();
	}
}

function Update () {

}

function Hold () {
	while(true)
	{
		yield WaitForSeconds(frequency);
		if(on)
		{
			emitter.Emit(amountToEmit);
		}
		yield;
	}	
}	

function StopParent () {
	transform.parent.GetComponent(ParticleSystem).emissionRate = 0;
}

function IncreaseRate () {
	frequency = Mathf.MoveTowards(frequency,0,.1);
}

function DecreaseRate () {
	frequency += .1;
}

function SetSongSprite (spriteNumber:int) {
	if(spriteNumber == 1)
	{	
		emitter.Emit(amountToEmit);
		on = true;
	}
	else
	{
		on = false;
	}
}