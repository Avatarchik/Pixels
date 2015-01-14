#pragma strict

static var musicSpeaker:AudioSource;
static var effectSpeaker:AudioSource;

static var musicVolume:float = 1;
static var soundVolume:float = 1;

static var musicChangeSpeed:float = 10;

function Start () {
	musicSpeaker = GetComponents(AudioSource)[0];
	effectSpeaker = GetComponents(AudioSource)[1];
	musicSpeaker.loop = true;
}

function Update () {
	if(PlayerPrefs.GetInt("Music") == 1 && PlayerPrefs.HasKey("Music"))
	{
		musicSpeaker.volume = Mathf.MoveTowards(musicSpeaker.volume,musicVolume,Time.deltaTime*musicChangeSpeed);
	}
	else
	{
		musicSpeaker.volume = 0;
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
	musicSpeaker.Stop();
	musicSpeaker.clip = song;
	musicSpeaker.Play();
}

static function PlaySongIntro (intro:AudioClip, song:AudioClip, pause:float) {
	musicSpeaker.Stop();
	if(intro != null)
	{
		effectSpeaker.PlayOneShot(intro);
	}
	yield WaitForSeconds(pause);
	musicSpeaker.clip = song;
	musicSpeaker.Play();
}

static function StopSong () {
	musicSpeaker.clip = null;
	musicSpeaker.Stop();
}

static function SongVolumeChange (volume:float, speed:float) {
	musicSpeaker.volume = volume;
	musicChangeSpeed = speed;
}

static function PlaySoundTransition (sound:AudioClip) {
	effectSpeaker.clip = sound;
	effectSpeaker.Play();
}
static function PlaySound (sound:AudioClip) {
	effectSpeaker.PlayOneShot(sound);
}

static function SoundVolumeChange (volume:float) {
	effectSpeaker.volume = volume;
}