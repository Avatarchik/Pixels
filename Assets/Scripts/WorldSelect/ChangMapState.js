#pragma strict

var menu:GameObject; 
var newState:MapStatus;

static var currentMenu:GameObject;

var thisWorld:WorldSelect;
var worldNameFull:String;
var worldNameLine1:String;
var worldNameLine2:String;
var thisWorldGames:GameObject[];
var thisWorldCovers:GameObject[];
var thisWorldColors:Color[];
var thisWorldUI:GameObject;

var controller:Master;


function Clicked () {
	switch(newState)
	{
		case MapStatus.Menu:
			if(WorldMapManager.currentState == MapStatus.Clear && menu != null && currentMenu == null)
			{
				currentMenu = Instantiate(menu, Vector3(0,-24,-3),Quaternion.identity);
				WorldMapManager.currentState = MapStatus.Menu;
			}
			break;
		case MapStatus.Clear:
			if(WorldMapManager.currentState == MapStatus.Confirmation)
			{
				WorldMapManager.currentState = MapStatus.Clear;
				var menuManager:WorldMenuManager = GetComponentInParent(WorldMenuManager); 
			}
			else if(WorldMapManager.currentState == MapStatus.Menu)
			{
				WorldMapManager.currentState = MapStatus.Clear;
				GetComponentInParent(WorldMenuManager).Exit();
			}
			break;
		case MapStatus.Confirmation:
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
			break;
		default:
			break;
	}
}