#pragma strict

var thisCharacter:Person;

var hum:AudioSource;

function Start () {
	if(GetComponent(AudioSource)!=null)
	{
		hum = GetComponent(AudioSource);
	}
}

function Update () {
	if(hum != null)
	{
		if(AudioManager.humming && !hum.isPlaying)
		{
			hum.Play();
		}
		if(thisCharacter == AudioManager.humCharacter)
		{
			hum.volume = Mathf.MoveTowards(hum.volume,.7,Time.deltaTime * .3);
		}
		else
		{
			hum.volume = Mathf.MoveTowards(hum.volume,0,Time.deltaTime * .3);
		}
	}
}