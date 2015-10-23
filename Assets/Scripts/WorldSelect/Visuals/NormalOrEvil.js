#pragma strict

var normal:boolean = false;

function Start () {
	if((PlayerPrefs.GetInt("HighSchoolBeatEndPlayed") == 1 && normal) || (PlayerPrefs.GetInt("HighSchoolBeatEndPlayed") != 1 && !normal))
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
}