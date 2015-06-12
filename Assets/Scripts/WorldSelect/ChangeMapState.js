#pragma strict

var menu:GameObject; 
var newState:MapStatus;

static var currentMenu:GameObject;

var thisWorld:WorldSelect;
var thisWorldDisplay:Sprite[];

private var controller:Master;

var worldNameVar:String;
var topLine:String;
var bottomLine:String;

function Start () {
	StartCoroutine(UpdateWorldAvailability());
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
				controller.currentWorld.basic.world = thisWorld;
				SendMessage("ReplaceMaster",SendMessageOptions.DontRequireReceiver);
				for(var level:World in controller.worlds)
				{
					if(level.basic.worldNameVar == worldNameVar)
					{
						Master.currentWorld = level;
					}
				}
				if(WorldMapManager.currentState == MapStatus.Clear)
				{
					WorldMapManager.currentState = MapStatus.Confirmation;
				}
			}
			WorldMapManager.selectedLocation = transform.localPosition.x;
			break;
		default:
			break;
	}
}

function UpdateWorldAvailability () {
	while(true)
	{
		if(thisWorldDisplay.Length == 2)
		{
			GetComponent(SpriteRenderer).sprite = thisWorldDisplay[PlayerPrefs.GetInt(worldNameVar)];
		}
		yield WaitForSeconds(1);
	}
	yield;
}