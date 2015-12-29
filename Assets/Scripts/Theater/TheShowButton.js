#pragma strict

@HideInInspector var variableName:String;

function Start () {
	variableName = "TheaterTheShowButton";
}

function Update () {
}

function Clicked () {
	if(!Master.notifying && TheaterController.currentState == TheaterStatus.Stats && TheaterController.buttonCooldown < 0)
	{
		TheaterController.buttonCooldown = .2;
		if(PlayerPrefs.GetInt("HighSchool") == 1)
		{
			LedgerController.currentState = LedgerState.Closed;
			if(!PlayerPrefs.HasKey(variableName) || PlayerPrefs.GetInt(variableName) == 0)
			{
				if(Master.allowShow)
				{
					Camera.main.GetComponent(Master).LaunchNotification("Perform the show weekdays at 7 PM and weekends at 2 PM!",NotificationType.notEnoughCoins);
				}
				else
				{
					Camera.main.GetComponent(Master).LaunchNotification("When the show is dark, come here to rehearse!",NotificationType.notEnoughCoins);
				}
				PlayerPrefs.SetInt(variableName,1);
				while(Master.notifying)
				{
					yield;
				}
			}
			TheaterController.customizing = false;
			TheaterController.buttonCooldown = .2;
			TheaterController.currentState = TheaterStatus.Show;
			yield WaitForSeconds(1);
			AudioManager.StopSong();
			Application.LoadLevel("TheShow");
		}
		else
		{
			Camera.main.GetComponent(Master).LaunchNotification("You need more people's help before you put on a show!",NotificationType.notEnoughCoins);
			while(Master.notifying)
			{
				yield;
			}
		}
	}
}