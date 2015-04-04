#pragma strict

var controller:Master;

var transitionIn:AudioClip;
var transitionOut:AudioClip;
var speedUp:AudioClip;
var success:AudioClip;
var failure:AudioClip;
var bossGameSounds:AudioClip[];
var music:AudioClip[];

function Start () {
	controller = Camera.main.GetComponent(Master);
}

function Update () {

}

function ReplaceMaster () {
	controller.selectedWorldTransitionIn = transitionIn;
	controller.selectedWorldTransitionOut = transitionOut;
	controller.selectedWorldSpeedUp = speedUp;
	controller.selectedWorldSuccessSound = success;
	controller.selectedWorldFailSound = failure;
	controller.selectedWorldBossGameSounds = bossGameSounds;
	controller.selectedWorldMusic = music;
}