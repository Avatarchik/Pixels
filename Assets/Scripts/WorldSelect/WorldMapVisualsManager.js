#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

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

@HideInInspector var worldMapMovement:float;
@HideInInspector var worldMapPreviousLocation:float;

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
	worldMapMovement = 0;
	worldMapPreviousLocation = worldMapManager.transform.position.x;
	KeepTrack();
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
	
	player.transform.position.x = Mathf.MoveTowards(player.transform.position.x,0,Time.deltaTime * (4 + Mathf.Abs(player.transform.position.x * .4)));
	if(player.transform.position.x < -18)
	{
		player.transform.position.x = -17.9;
	}
	if(player.transform.position.x > 18)
	{
		player.transform.position.x = 17.9;
	}
	//playerManager.speed = .1;	
	var allowableDistance:float = .05;
	if(player.transform.position.x > allowableDistance)
	{
		playerManager.currentState = PlayerState.WalkingFront;
		player.transform.GetComponent(AnimationManager).flipped = -1;
		player.GetComponent(PlayerManager).thisSpeed = .23;
	}
	else if(player.transform.position.x < -allowableDistance)
	{
		playerManager.currentState = PlayerState.WalkingFront;
		player.transform.GetComponent(AnimationManager).flipped = 1;
		player.GetComponent(PlayerManager).thisSpeed = .23;
	}
	else if(worldMapMovement < -allowableDistance)
	{
		playerManager.currentState = PlayerState.WalkingFront;
		player.transform.GetComponent(AnimationManager).flipped = -1;
		player.GetComponent(PlayerManager).thisSpeed = .23;
	}
	else if(worldMapMovement > allowableDistance)
	{
		playerManager.currentState = PlayerState.WalkingFront;
		player.transform.GetComponent(AnimationManager).flipped = 1;
		player.GetComponent(PlayerManager).thisSpeed = .23;
	}
	else if(worldMapManager.currentState == MapStatus.Confirmation)
	{
		playerManager.currentState = PlayerState.StandingBack;
		player.GetComponent(PlayerManager).thisSpeed = .23;
	}
	else
	{
		playerManager.currentState = PlayerState.SpecialHeadBob;
		player.GetComponent(PlayerManager).thisSpeed = .7;
	}
}

function KeepTrack () {
	while(true)
	{
		yield WaitForSeconds(.03);
		worldMapMovement = worldMapPreviousLocation - worldMapManager.transform.position.x;
		worldMapPreviousLocation = worldMapManager.transform.position.x;
	}
}