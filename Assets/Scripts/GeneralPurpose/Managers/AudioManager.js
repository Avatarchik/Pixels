#pragma strict

public enum Person{None,Peter,PeanutCEO};

static var musicGetter:Component[];
static var musicSpeaker:AudioSource[];
static var effectSpeaker:AudioSource;
static var cutsceneSpeaker:AudioSource;
static var musicPosition:float;

static var musicVolume:float = 1;
static var soundVolume:float = 1;

static var musicChangeSpeed:float = 10;

static var internalDeltaTime:float;

static var humCharacter:Person;
static var humming:boolean;

function Awake () {
	humming = false;
	humCharacter = Person.None;
	musicGetter	= GetComponents(AudioSource);
	musicSpeaker = new AudioSource[musicGetter.length - 2];
	for(var i:int = 2; i < musicGetter.length; i++)
	{
		musicSpeaker[i-2] = musicGetter[i];
	}
	effectSpeaker = musicGetter[0];
	cutsceneSpeaker = musicGetter[1];
	
	for(i = 0; i < musicSpeaker.length; i++)
	{
		musicSpeaker[i].loop = true;
	}
	effectSpeaker.loop = false;
	cutsceneSpeaker.loop = false;
	
	internalDeltaTime = Time.realtimeSinceStartup;
}

function Update () {
	internalDeltaTime = Time.realtimeSinceStartup - internalDeltaTime;
	if(PlayerPrefs.GetInt("Music") == 1 && PlayerPrefs.HasKey("Music"))
	{
		for(var i:int = 0; i < musicSpeaker.length; i++)
		{
			musicSpeaker[i].volume = Mathf.MoveTowards(musicSpeaker[i].volume,musicVolume,internalDeltaTime*musicChangeSpeed);
			musicSpeaker[i].pitch = Time.timeScale;
		}
		cutsceneSpeaker.pitch = Time.timeScale;
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
		effectSpeaker.pitch = Time.timeScale;
	}
	else
	{
		effectSpeaker.volume = 0;
	}
}

static function GetPlaying ():boolean {
	if(cutsceneSpeaker.isPlaying)
	{
		return true;
	}
	else if(musicSpeaker[0].isPlaying)
	{
		return true;
	}
	else
	{
		return false;
	}
}

static function GetLocation ():float {
	if(cutsceneSpeaker.isPlaying)
	{
		return cutsceneSpeaker.time;
	}
	else if(musicSpeaker[0].isPlaying)
	{
		return musicSpeaker[0].time;
	}
	else if(effectSpeaker.isPlaying)
	{
		return effectSpeaker.time;
	}
	else
	{
		return 0;	
	}
}

static function GetLength ():float {
	if(cutsceneSpeaker.isPlaying)
	{
		return cutsceneSpeaker.clip.length;
	}
	else if(musicSpeaker[0].isPlaying)
	{
		return musicSpeaker[0].clip.length;
	}
	else if(effectSpeaker.isPlaying)
	{
		return effectSpeaker.clip.length;
	}
	else
	{
		return 0;	
	}
}

static function PlaySong (song:AudioClip) {
	PlaySong(song,1);
}
static function PlaySong (song:AudioClip, volume:float) {
	StopSong();
	musicVolume = volume;
	musicSpeaker[0].clip = song;
	musicSpeaker[0].Play();
	humming = true;
}
static function PlaySong (song:AudioClip[]) {
	for(var i:int = 0; i < song.length; i++)
	{
		musicSpeaker[i].Stop();
		musicSpeaker[i].clip = song[i];
		musicSpeaker[i].Play();
	}
	humming = true;
}

static function PlaySongIntro (intro:AudioClip, song:AudioClip, pause:float) {
	StopSong();
	if(intro != null)
	{
		effectSpeaker.clip = intro;
		effectSpeaker.Play();
	}
	yield WaitForSeconds(pause);
	musicSpeaker[0].clip = song;
	musicSpeaker[0].Play();
	humming = true;
}

static function Loop (yes:boolean) {
	for(var i:int = 0; i < musicSpeaker.length; i++)
	{
		musicSpeaker[i].loop = yes;
	}
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
	if(musicSpeaker != null)
	{
		for(var i:int = 0; i < musicSpeaker.length; i++)
		{
			musicSpeaker[i].clip = null;
			musicSpeaker[i].Stop();
		}
	}
	humming = false;
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
	effectSpeaker.PlayOneShot(sound,1);
}

static function PlaySound (sound:AudioClip, volume:float) {
	if(PlayerPrefs.GetInt("Sound") == 1 && PlayerPrefs.HasKey("Sound"))
	{
		effectSpeaker.PlayOneShot(sound,volume);
	}	
}

static function PlayCutscene (sound:AudioClip) {
	cutsceneSpeaker.clip = sound;
	cutsceneSpeaker.volume = 1;
	cutsceneSpeaker.Play();
}

static function PlayCutscene (sound:AudioClip, volume:float) {
	if(PlayerPrefs.GetInt("Sound") == 1 && PlayerPrefs.HasKey("Sound"))
	{
		cutsceneSpeaker.clip = sound;
		cutsceneSpeaker.volume = volume;
		cutsceneSpeaker.Play();
	}	
}

static function EndCutscene () {
	while(cutsceneSpeaker.volume != 0)
	{
		cutsceneSpeaker.volume = Mathf.MoveTowards(cutsceneSpeaker.volume,0,Time.deltaTime * 3);
		yield;
	}
	cutsceneSpeaker.Stop();
	cutsceneSpeaker.volume = 1;
}

static function SoundVolumeChange (volume:float) {
	effectSpeaker.volume = volume;
}

static function StopAll () {
	StopAll(0);
}

static function StopAll (wait:float) {
	yield WaitForSeconds(wait);
	StopSound();
	StopSong();
}