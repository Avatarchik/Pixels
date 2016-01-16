#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

function Start () {
	if(ObscuredPrefs.GetInt("HighSchool") != 1)
	{
		GetComponent(SpriteRenderer).color = Color.gray;
		GetComponent(ButtonSquare).up = GetComponent(ButtonSquare).down;
	}
}

function Update () {
}

function Clicked () {
	if(!Master.notifying && TheaterController.currentState == TheaterStatus.Stats && TheaterController.buttonCooldown < 0)
	{
		TheaterController.buttonCooldown = .2;
		if(ObscuredPrefs.GetInt("HighSchool") == 1)
		{
			LedgerController.currentState = LedgerState.Closed;
			TheaterController.customizing = false;
			TheaterController.buttonCooldown = .2;
			TheaterController.currentState = TheaterStatus.Show;
			AudioManager.SongVolumeChange(0,2);
			yield WaitForSeconds(.6);
			AudioManager.StopSong();
			AudioManager.SongVolumeChange(1,100);
			Application.LoadLevel("TheShow");
		}
		else
		{
			Camera.main.GetComponent(Master).LaunchNotification("You need more people before you put on a show!",NotificationType.notEnoughCoins);
			while(Master.notifying)
			{
				yield;
			}
		}
	}
}