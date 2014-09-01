#pragma strict

var thisWorld:WorldSelect;
var worldNameFull:String;
var worldNameLine1:String;
var worldNameLine2:String;
var thisWorldGames:GameObject[];
var thisWorldCovers:GameObject[];
var thisWorldColors:Color[];
var thisWorldUI:GameObject;

var manager:WorldMapManager;
var controller:Master;


function Clicked () {
	controller = Camera.main.GetComponent(Master);
	controller.selectedWorld = thisWorld;
	controller.worldNameFull = worldNameFull;
	controller.worldNameLine1 = worldNameLine1;
	controller.worldNameLine2 = worldNameLine2;
	controller.selectedWorldGames = thisWorldGames;
	controller.selectedWorldCovers = thisWorldCovers;
	controller.selectedWorldColors = thisWorldColors;
	controller.selectedWorldUI = thisWorldUI;
	
	if(WorldMapManager.currentState == MapStatus.Clear)
	{
		WorldMapManager.currentState = MapStatus.Confirmation;
	}
}