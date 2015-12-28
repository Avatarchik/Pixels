#pragma strict

function Start () {

}

function Update () {

}

function StartEvent (which:int) {
	GetComponent(ParticleSystem).emissionRate = 100;
	GetComponent(ParticleSystem).startSpeed = 12;
	GetComponent(ParticleSystem).startLifetime = 3;
}