#pragma strict

var worldMap:GameObject;
var worldMapManager:WorldMapManager;

var player:GameObject;
var playerManager:PlayerManager;

var playerDifference:float;

function Start () {
	playerManager = player.GetComponent(PlayerManager);
	worldMapManager = worldMap.GetComponent(WorldMapManager);
}

function Update () {
	transform.position = worldMap.transform.position;
	player.transform.position.x = Mathf.MoveTowards(player.transform.position.x,0,Time.deltaTime * (3 + Mathf.Abs(player.transform.position.x * .2)));
	playerManager.speed = .1;	

	if(player.transform.position.x > 0)
	{
		playerManager.currentState = PlayerState.WalkingLeft;
	}
	else if(player.transform.position.x < 0)
	{
		playerManager.currentState = PlayerState.WalkingRight;
	}
	else if(worldMapManager.currentState == MapStatus.Confirmation)
	{
		playerManager.currentState = PlayerState.StandingBack;
	}
	else
	{
		playerManager.currentState = PlayerState.StandingFront;
	}
}