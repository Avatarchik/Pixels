#pragma strict

// Audio
var transitionToWorld:AudioClip;

var transition:GameObject;
var done:boolean;

var paidGameNotification:GameObject;

function Start () {
	DontDestroyOnLoad(gameObject);
	done = false;
}

function Clicked () {
	if(transition != null && !done && TitleManager.currentState == TitleStatus.Home && !Master.notifying)
	{
		TitleManager.currentState = TitleStatus.Leaving;
		if(PlayerPrefs.GetInt("PlayerHasBeenToldAboutPayment") != 1)
		{
			PlayerPrefs.SetInt("PlayerHasBeenToldAboutPayment",1);
			var newNote:GameObject = Instantiate(paidGameNotification);
			while(newNote != null)
			{
				yield;
			}
		}
		AudioManager.PlaySoundTransition(transitionToWorld);
		Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
		done = true;
		yield WaitForSeconds(.7);
		AudioManager.StopSong();
		yield WaitForSeconds(1);
		Master.initialLoad = false;
		Application.LoadLevel("WorldSelect");
		yield WaitForSeconds(2);
	}
}