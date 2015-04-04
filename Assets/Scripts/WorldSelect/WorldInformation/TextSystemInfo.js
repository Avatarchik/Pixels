#pragma strict

var controller:Master;

var firstOpening:GameObject;
var regularOpening:GameObject;
var end1:GameObject;
var end2:GameObject;
var end3:GameObject;
var end4:GameObject;
var beatEnd:GameObject;

var firstOpeningSong:AudioClip;
var regularOpeningSong:AudioClip;
var end1Song:AudioClip;
var end2Song:AudioClip;
var end3Song:AudioClip;
var end4Song:AudioClip;
var beatEndSong:AudioClip;


function Start () {
	controller = Camera.main.GetComponent(Master);
}

function Update () {

}

function ReplaceMaster () {
	controller.selectedWorldFirstOpening = firstOpening;
	controller.selectedWorldRegularOpening = regularOpening;
	controller.selectedWorldEnd1 = end1;
	controller.selectedWorldEnd2 = end2;
	controller.selectedWorldEnd3 = end3;
	controller.selectedWorldEnd4 = end4;
	controller.selectedWorldBeatEnd = beatEnd;
	
	controller.selectedWorldFirstOpeningSong = firstOpeningSong;
	controller.selectedWorldRegularOpeningSong = regularOpeningSong;
	controller.selectedWorldEnd1Song = end1Song;
	controller.selectedWorldEnd2Song = end2Song;
	controller.selectedWorldEnd3Song = end3Song;
	controller.selectedWorldEnd4Song = end4Song;
	controller.selectedWorldBeatEndSong = beatEndSong;
}