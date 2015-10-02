#pragma strict

var replay:boolean;

function Start () {

}

function Clicked () {
	GameManager.replay = replay;
	AudioManager.StopAll(.5);
	transform.parent.SendMessage("Clicked",SendMessageOptions.DontRequireReceiver);
}