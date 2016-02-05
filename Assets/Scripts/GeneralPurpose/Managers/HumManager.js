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
	// If there's an audiosource, check for a match between this character and currently humming character, and play sound.
	if(hum.time != AudioManager.GetLocation())
	{
		hum.time = AudioManager.GetLocation();
	}

	if(hum != null)
	{
		if(AudioManager.humming && !hum.isPlaying)
		{
			hum.Play();
		}
		if(thisCharacter == AudioManager.humCharacter)
		{
			hum.volume = Mathf.MoveTowards(hum.volume,.7,Time.deltaTime * .45);
		}
		else
		{
			hum.volume = Mathf.MoveTowards(hum.volume,0,Time.deltaTime * .45);
		}
	}
}