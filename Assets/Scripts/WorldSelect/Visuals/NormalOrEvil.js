#pragma strict

var normal:boolean = false;

function Start () {
	if((PlayerPrefs.GetInt("Neverland") == 1 && normal) || (PlayerPrefs.GetInt("Neverland") != 1 && !normal))
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
	else if(PlayerPrefs.GetInt("Neverland") != 1 && !normal)
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