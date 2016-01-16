#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var normal:boolean = false;

function Start () {
	if((ObscuredPrefs.GetInt("WorldMapState") == 1 && normal) || (ObscuredPrefs.GetInt("WorldMapState") != 1 && !normal))
	{
		if(GetComponent(SpriteRenderer) != null)
		{
			GetComponent(SpriteRenderer).enabled = false;
		}
		if(GetComponent(ParticleSystem) != null)
		{
			GetComponent(ParticleSystem).enableEmission = false;
		}
	}
	
	//HighSchoolBeatEndPlayed
	/*
	else if(ObscuredPrefs.GetInt("HighSchoolBeatEndPlayed") != 1 && !normal)
	{
		if(GetComponent(SpriteRenderer) != null)
		{
			GetComponent(SpriteRenderer).enabled = false;
		}
		if(GetComponent(ParticleEmitter) != null)
		{
			GetComponent(ParticleEmitter).emit = false;
		}
	}
	*/
}