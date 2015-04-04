#pragma strict

var menu:GameObject; 
var newState:MapStatus;

static var currentMenu:GameObject;

var thisWorld:WorldSelect;
var thisWorldDisplay:Sprite[];
var worldNameFull:String;
var worldNameVar:String;

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
			if(PlayerPrefs.GetInt(worldNameVar) == 1 && WorldMapManager.allowClick && WorldMapManager.currentState != MapStatus.Results)
			{
				controller = Camera.main.GetComponent(Master);
				controller.selectedWorld = thisWorld;
				SendMessage("ReplaceMaster",SendMessageOptions.DontRequireReceiver);
				controller.worldNameFull = worldNameFull;
				controller.worldNameVar = worldNameVar;
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

function UpdateWorldAvailability () {
	if(thisWorldDisplay.Length == 2)
	{
		GetComponent(SpriteRenderer).sprite = thisWorldDisplay[PlayerPrefs.GetInt(worldNameVar)];
	}
}