#pragma strict

var menu:GameObject; 
var newState:MapStatus;

static var currentMenu:GameObject;

var thisWorld:WorldSelect;
var thisWorldDisplay:Sprite[];
var worldNameFull:String;
var worldNameVar:String;
var worldNameLine1:String;
var worldNameLine2:String;
var thisWorldGames:GameObject[];
var thisWorldCovers:GameObject[];
var thisWorldColors:Color[];
var thisWorldUI:GameObject;
var thisWorldOpeningText:GameObject;
var thisWorldClosingText:GameObject;
var thisWorldTransitionIn:AudioClip;
var thisWorldTransitionOut:AudioClip;
var thisWorldMusic:AudioClip[];

private var controller:Master;

function Start () {
	if(thisWorldDisplay.Length == 2)
	{
		GetComponent(SpriteRenderer).sprite = thisWorldDisplay[PlayerPrefs.GetInt(worldNameVar)];
	}
}


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
			Debug.Log(PlayerPrefs.GetInt(worldNameVar));
			if(PlayerPrefs.GetInt(worldNameVar) == 1)
			{
				controller = Camera.main.GetComponent(Master);
				controller.selectedWorld = thisWorld;
				controller.worldNameFull = worldNameFull;
				controller.worldNameLine1 = worldNameLine1;
				controller.worldNameLine2 = worldNameLine2;
				controller.selectedWorldGames = thisWorldGames;
				controller.selectedWorldCovers = thisWorldCovers;
				controller.selectedWorldColors = thisWorldColors;
				controller.selectedWorldUI = thisWorldUI;
				controller.selectedWorldOpeningText = thisWorldOpeningText;
				controller.selectedWorldEndingText = thisWorldClosingText;
				controller.selectedWorldTransitionIn = thisWorldTransitionIn;
				controller.selectedWorldTransitionOut = thisWorldTransitionOut;
				controller.selectedWorldMusic = thisWorldMusic;
				if(WorldMapManager.currentState == MapStatus.Clear)
				{
					WorldMapManager.currentState = MapStatus.Confirmation;
				}
			}
			break;
		default:
			break;
	}
}