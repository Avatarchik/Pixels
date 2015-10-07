#pragma strict

var replay:boolean;

function Start () {

}

function Clicked () {
	GameManager.replay = replay;
	transform.parent.SendMessage("Clicked",SendMessageOptions.DontRequireReceiver);
}