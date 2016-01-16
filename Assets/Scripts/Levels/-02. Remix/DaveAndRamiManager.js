#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var welcomeSounds:AudioClip[];
var goodSounds:AudioClip[];
var neutralSounds:AudioClip[];
var badSounds:AudioClip[];

@HideInInspector var play:boolean;

function Start () {
	play = true;
}

function Update () {

}

function EnterVR () {
	AudioManager.PlayCutscene(welcomeSounds[Random.Range(0,welcomeSounds.length)]);
}		

function NotifySuccess (win:boolean)
{
	if(play)
	{
		if(Random.value < .7)
		{
			if(win)
			{
				AudioManager.PlayCutscene(goodSounds[Random.Range(0,goodSounds.length)]);
			}
			else
			{
				AudioManager.PlayCutscene(badSounds[Random.Range(0,badSounds.length)]);
			}
		}
		else
		{
			AudioManager.PlayCutscene(neutralSounds[Random.Range(0,neutralSounds.length)]);
		}
	}
	play = !play;
}
