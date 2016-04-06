#pragma strict

var normal:boolean = false;

function Start () {
	if((PlayerPrefs.GetInt("WorldMapState") == 1 && normal) || (PlayerPrefs.GetInt("WorldMapState") != 1 && !normal))
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
	if(PlayerPrefs.GetInt("IgnoreTimeOfDay") == 1)
	{
		GetComponent(ParticleSystem).enableEmission = false;
	}
	//HighSchoolBeatEndPlayed
	/*
	else if(PlayerPrefs.GetInt("HighSchoolBeatEndPlayed") != 1 && !normal)
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