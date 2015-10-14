#pragma strict

var worldMap:GameObject;
@HideInInspector var worldMapManager:WorldMapManager;

@HideInInspector var player:GameObject;
var playerPrefab:GameObject;
@HideInInspector var playerManager:PlayerManager;

var layer00:GameObject;
var layer01:GameObject;
var layer02:GameObject;
var layer03:GameObject;
var layer04:GameObject;
var layer05:GameObject;

static var wind:float;

function Awake () {
	player = Instantiate(playerPrefab);
	player.transform.position = Vector3(0,-4.896,-.8);
	player.transform.localScale = Vector3(1.125,1.125,1.125);
	player.transform.parent = layer01.transform;
	player.GetComponent(PlayerManager).speedOverride = true;
	player.GetComponent(PlayerManager).thisSpeed = .28;
}

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
		wind = Random.Range(80,120);
	}
	transform.position.y = worldMap.transform.position.y;
	layer00.transform.position.x = worldMap.transform.position.x * 1.6;
	layer01.transform.position.x = worldMap.transform.position.x * 1.0;
	layer02.transform.position.x = worldMap.transform.position.x * 0.8;
	layer03.transform.position.x = worldMap.transform.position.x * 0.6;
	layer04.transform.position.x = worldMap.transform.position.x * 0.4;
	layer05.transform.position.x = worldMap.transform.position.x * 0.2;
	
	player.transform.position.x = Mathf.MoveTowards(player.transform.position.x,0,Time.deltaTime * (5 + Mathf.Abs(player.transform.position.x * .4)));
	//playerManager.speed = .1;	

	if(player.transform.position.x > .03)
	{
		playerManager.currentState = PlayerState.WalkingFront;
		player.transform.GetComponent(AnimationManager).flipped = -1;
		player.GetComponent(PlayerManager).thisSpeed = .28;
	}
	else if(player.transform.position.x < -.03)
	{
		playerManager.currentState = PlayerState.WalkingFront;
		player.transform.GetComponent(AnimationManager).flipped = 1;
		player.GetComponent(PlayerManager).thisSpeed = .28;
	}
	else if(worldMapManager.currentState == MapStatus.Confirmation)
	{
		playerManager.currentState = PlayerState.StandingBack;
		player.GetComponent(PlayerManager).thisSpeed = .28;
	}
	else
	{
		playerManager.currentState = PlayerState.SpecialHeadBob;
		player.GetComponent(PlayerManager).thisSpeed = .7;
	}
}