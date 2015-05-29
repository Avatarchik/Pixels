#pragma strict

@HideInInspector var controller:Master;

var topLine:String;
var bottomLine:String;
var games:GameObject[];
var bossGame:GameObject;
var covers:GameObject[];
var colors:Color[];
var UI:GameObject;

function Start () {
	controller = Camera.main.GetComponent(Master);
}

function Update () {

}

function ReplaceMaster () {
	controller.worldNameLine1 = topLine;
	controller.worldNameLine2 = bottomLine;
	controller.selectedWorldGames = games;
	controller.selectedWorldCovers = covers;
	controller.selectedWorldColors = colors;
	controller.selectedWorldUI = UI;
	controller.selectedWorldBossGame = bossGame;
}