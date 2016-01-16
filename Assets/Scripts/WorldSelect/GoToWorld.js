#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var transition:GameObject;
var done:boolean;
var controller:Master;
var whiteFlash:SpriteRenderer;

function Start () {
	done = false;
	whiteFlash.color.a = 0;
}

function Update () {
	whiteFlash.color.a = Mathf.MoveTowards(whiteFlash.color.a,0,Time.deltaTime * 3.5);
}

function Clicked () {
	whiteFlash.color.a = 1;
	if(WorldMapManager.currentState == MapStatus.Confirmation || WorldMapManager.currentState == MapStatus.Clear)
	{
		Load();
	}
}

function Load () {
	if(transition != null && !done)
	{
		Master.showWorldTitle = true;
		controller = Camera.main.GetComponent(Master);
		AudioManager.PlaySoundTransition(controller.currentWorld.audio.transitionIn);
		Instantiate(transition, Vector3(0,0,-9.5), Quaternion.identity);
		done = true;
		yield WaitForSeconds(.7);
		AudioManager.StopSong();
		yield WaitForSeconds(1);
		switch(controller.currentWorld.basic.world)
		{
			case WorldSelect.Theater:
				if(Master.hardMode && Master.allowShow)
				{	
					Application.LoadLevel("TheShow");
				}
				else
				{
					Application.LoadLevel("Theater");
				}
				break;
			case WorldSelect.Arcade:
				Application.LoadLevel("Arcade");
				break;
			case WorldSelect.UnlockWheel:
				Application.LoadLevel("UnlockWheel");
				break;
			case WorldSelect.Remix:
				Application.LoadLevel("VRMachine");
				break;
			default:
				Application.LoadLevel("MicroGameLauncher");
				break;
		}
	}
}