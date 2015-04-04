#pragma strict

static var musicGetter:Component[];
static var musicSpeaker:AudioSource[];
static var effectSpeaker:AudioSource;

static var musicVolume:float = 1;
static var soundVolume:float = 1;

static var musicChangeSpeed:float = 10;

static var internalDeltaTime:float;

function Start () {
	musicGetter	= GetComponents(AudioSource);
	musicSpeaker = new AudioSource[musicGetter.length - 1];
	for(var i:int = 1; i < musicGetter.length; i++)
	{
		musicSpeaker[i-1] = musicGetter[i];
	}
	effectSpeaker = musicGetter[0];
	for(i = 0; i < musicSpeaker.length; i++)
	{
		musicSpeaker[i].loop = true;
	}
	//effectSpeaker.loop = false;
	internalDeltaTime = Time.realtimeSinceStartup;
}

function Update () {
	internalDeltaTime = Time.realtimeSinceStartup - internalDeltaTime;
	if(PlayerPrefs.GetInt("Music") == 1 && PlayerPrefs.HasKey("Music"))
	{
		for(var i:int = 0; i < musicSpeaker.length; i++)
		{
			musicSpeaker[i].volume = Mathf.MoveTowards(musicSpeaker[i].volume,musicVolume,internalDeltaTime*musicChangeSpeed);
		}
	}
	else
	{
		for(i = 0; i < musicSpeaker.length; i++)
		{
			musicSpeaker[i].volume = 0;
		}
	}
	if(PlayerPrefs.GetInt("Sound") == 1 && PlayerPrefs.HasKey("Sound"))
	{
		effectSpeaker.volume = soundVolume;
	}
	else
	{
		effectSpeaker.volume = 0;
	}
}

static function PlaySong (song:AudioClip) {
	StopSong();
	musicSpeaker[0].clip = song;
	musicSpeaker[0].Play();
}
static function PlaySong (song:AudioClip[]) {
	for(var i:int = 0; i < song.length; i++)
	{
		musicSpeaker[i].Stop();
		musicSpeaker[i].clip = song[i];
		musicSpeaker[i].Play();
	}
}

static function PlaySongIntro (intro:AudioClip, song:AudioClip, pause:float) {
	StopSong();
	if(intro != null)
	{
		effectSpeaker.PlayOneShot(intro);
	}
	yield WaitForSeconds(pause);
	musicSpeaker[0].clip = song;
	musicSpeaker[0].Play();
}

static function PlaySongIntro (intro:AudioClip, song:AudioClip[], pause:float) {
	StopSong();
	if(intro != null)
	{
		effectSpeaker.PlayOneShot(intro);
	}
	yield WaitForSeconds(pause);
	for(var i:int = 0; i < song.length; i++)
	{
		musicSpeaker[i].clip = song[i];
		musicSpeaker[i].Play();
	}
}

static function StopSong () {
	for(var i:int = 0; i < musicSpeaker.length; i++)
	{
		musicSpeaker[i].clip = null;
		musicSpeaker[i].Stop();
	}
}

static function StopSound () {
	effectSpeaker.Stop();
}

static function SongVolumeChange (volume:float, speed:float) {
	for(var i:int = 0; i < musicSpeaker.length; i++)
	{
		musicSpeaker[i].volume = volume;
	}
	musicChangeSpeed = speed;
}

static function PlaySoundTransition (sound:AudioClip) {
	effectSpeaker.clip = sound;
	effectSpeaker.Play();
}
static function PlaySound (sound:AudioClip) {
	effectSpeaker.PlayOneShot(sound);
}

static function PlaySound (sound:AudioClip, volume:float) {
	if(PlayerPrefs.GetInt("Sound") == 1 && PlayerPrefs.HasKey("Sound"))
	{
		effectSpeaker.PlayOneShot(sound,volume);
	}	
}

static function SoundVolumeChange (volume:float) {
	effectSpeaker.volume = volume;
}