#pragma strict

var worldMap:GameObject;
@HideInInspector var worldMapManager:WorldMapManager;

var player:GameObject;
@HideInInspector var playerManager:PlayerManager;

var playerDifference:float;
static var wind:float;

function Start () {
	player.transform.position.x = 0;
	wind = 30;
	playerManager = player.GetComponent(PlayerManager);
	worldMapManager = worldMap.GetComponent(WorldMapManager);
}

function Update () {
	wind -= Time.deltaTime * 10;
	if(wind < -30)
	{
		wind = Random.Range(40,120);
	}
	transform.position = worldMap.transform.position;
	player.transform.position.x = Mathf.MoveTowards(player.transform.position.x,0,Time.deltaTime * (5 + Mathf.Abs(player.transform.position.x * .4)));
	//playerManager.speed = .1;	

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