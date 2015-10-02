#pragma strict



var newState:TheaterStatus;
var allowedStates:TheaterStatus[];
@HideInInspector var manager:PlayerManager;
@HideInInspector var theaterController:TheaterController;
var leave:boolean;
@HideInInspector var done:boolean;
var transition:GameObject;

function Start () {
	done = false;
	theaterController = GameObject.FindGameObjectWithTag("Theater").GetComponent(TheaterController);
}

function Update () {

}

function Unclicked () {
	var allowed:boolean = false;
	for(var i:int = 0; i < allowedStates.length; i++)
	{
		if(allowedStates[i] == TheaterController.currentState)
		{
			allowed = true;
		}
	}
	if(allowed && TheaterController.buttonCooldown < 0)
	{
		TheaterController.customizing = false;
		TheaterController.buttonCooldown = .2;
		switch(newState)
		{
			case TheaterStatus.Home:
				if(LedgerController.songPlaying)
				{
					LedgerController.songPlaying = false;
					AudioManager.StopAll(0);
					theaterController.PlayAudio();
				}
				if(TheaterController.currentState == TheaterStatus.Stats)
				{
					if(!LedgerController.videoPlaying && LedgerController.currentState != LedgerState.Transition && LedgerController.currentState != LedgerState.FirstOpened)
					{
						LedgerController.currentState = LedgerState.Leaving;
						TheaterController.currentState = newState;
					}
				}
				else
				{
					TheaterController.currentState = newState;
				}
				break;
			case TheaterStatus.Front:
				TheaterController.currentState = newState;
				break;
			case TheaterStatus.Stats:
				if(TheaterController.currentState == TheaterStatus.CustomizeNoColor || TheaterController.currentState == TheaterStatus.CustomizeColor)
				{
					TheaterController.currentState = TheaterStatus.Home;
				}
				else
				{
					TheaterController.currentState = newState;
				}
				break;
			case TheaterStatus.CustomizeNoColor:
				if(TheaterController.currentState == TheaterStatus.CustomizeNoColor || TheaterController.currentState == TheaterStatus.CustomizeColor)
				{
					TheaterController.currentState = TheaterStatus.Home;
				}
				else
				{
					TheaterController.currentState = newState;
				}
				break;
			case TheaterStatus.CustomizeColor:
				TheaterController.currentState = newState;
				break;
			default:
				break;
		}

		if(leave)
		{
			if(transition != null && !done)
			{
				var controller:Master = Camera.main.GetComponent(Master);
				AudioManager.PlaySoundTransition(controller.currentWorld.audio.transitionOut);
				Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
				done = true;
			}
			yield WaitForSeconds(.7);
			AudioManager.StopSong();
			yield WaitForSeconds(1.3);
			Application.LoadLevel("WorldSelect");
		}
	}
}