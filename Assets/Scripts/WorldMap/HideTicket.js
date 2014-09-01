#pragma strict

function Clicked () {
	if(WorldMapManager.currentState == MapStatus.Confirmation)
	{
		WorldMapManager.currentState = MapStatus.Clear;
	}
}