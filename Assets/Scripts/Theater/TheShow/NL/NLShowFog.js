#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

function Start () {

}

function Update () {

}

function StartEvent (which:int) {
	if(Master.allowShow)
	{
		GetComponent(ParticleSystem).emissionRate = 100;
		GetComponent(ParticleSystem).startSpeed = 12;
		GetComponent(ParticleSystem).startLifetime = 3;
	}
}