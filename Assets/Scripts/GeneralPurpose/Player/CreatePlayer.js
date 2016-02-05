#pragma strict

var simpleReplace:boolean;
var playerPrefab:GameObject;
var startPosition:Vector3;
var startScale:Vector3;
var isParent:boolean;
var speedOverride:boolean;
var newSpeed:float;
var currentState:PlayerState;

@HideInInspector var player:GameObject;
@HideInInspector var playerManager:PlayerManager;

function Awake () {
	if(simpleReplace)
	{
		if(GetComponent(PlayerManager) != null)
		{
			GetComponent(PlayerManager).hair = playerPrefab.GetComponent(PlayerManager).hair;
			GetComponent(PlayerManager).eyes = playerPrefab.GetComponent(PlayerManager).eyes;
			GetComponent(PlayerManager).tops = playerPrefab.GetComponent(PlayerManager).tops;
			GetComponent(PlayerManager).bottoms = playerPrefab.GetComponent(PlayerManager).bottoms;
			GetComponent(PlayerManager).hairColor = playerPrefab.GetComponent(PlayerManager).hairColor;
			GetComponent(PlayerManager).eyesColor = playerPrefab.GetComponent(PlayerManager).eyesColor;
			GetComponent(PlayerManager).topsColor = playerPrefab.GetComponent(PlayerManager).topsColor;
			GetComponent(PlayerManager).bottomsColor = playerPrefab.GetComponent(PlayerManager).bottomsColor;
			GetComponent(PlayerManager).bodyColor = playerPrefab.GetComponent(PlayerManager).bodyColor;
		}
	}
	else
	{
		player = Instantiate(playerPrefab,startPosition,Quaternion.identity);
		playerManager = player.GetComponent(PlayerManager);
		if(isParent)
		{
			player.transform.parent = transform;
			player.transform.localPosition = startPosition;
		}
		player.transform.localScale = startScale;
		playerManager.speedOverride = speedOverride;
		playerManager.thisSpeed = newSpeed;
		playerManager.currentState = currentState;
	}
}

function Update () {

}