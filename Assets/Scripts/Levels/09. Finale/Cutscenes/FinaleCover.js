﻿#pragma strict

var particle:ParticleSystem;

var amount:float;

function Start () {

}

function Update () {
	if(transform.position.x < .1)
	{
		particle.emissionRate = 150;
	}
	else
	{
		particle.emissionRate = 0;
	}
}