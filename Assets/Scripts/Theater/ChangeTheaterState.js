#pragma strict



var newState:TheaterStatus;
var allowedStates:TheaterStatus[];
@HideInInspector var manager:PlayerManager;
@HideInInspector var theaterController:TheaterController;
var removeLedger:boolean;
var leave:boolean;
@HideInInspector var done:boolean;
var transition:GameObject;
var vertical:boolean;

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
		TheaterController.buttonCooldown = .2;
		switch(newState)
		{
			case TheaterStatus.Home:
				if(LedgerController.songPlaying)
				{
					LedgerController.songPlaying = false;
					AudioManager.StopAll();
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
			case TheaterStatus.HomeLedger:
				TheaterController.currentState = newState;
				break;
			case TheaterStatus.FrontLedger:
				TheaterController.currentState = newState;
				break;
			case TheaterStatus.CustomizeNoColor:
				TheaterController.currentState = newState;
				break;
			case TheaterStatus.CustomizeColor:
				TheaterController.currentState = newState;
				break;
			default:
				break;
		}
		
		if(removeLedger){
			if(TheaterController.currentState == TheaterStatus.HomeLedger)
			{TheaterController.currentState = TheaterStatus.Home;}
			else{TheaterController.currentState = TheaterStatus.Front;}
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
	
	/*
	// Handles info if the ledger is being put away, regardless of location.
	if(TheaterController.currentState != TheaterStatus.Stats)
	{
		// Handles info if the goal is to leave the scene.
		else if(leave && (!vertical || TheaterController.currentState != TheaterStatus.HomeLedger))
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
		else if(leave && vertical && TheaterController.currentState != TheaterStatus.HomeLedger)
		{
			Debug.Log("hey");
			if(transition != null && !done)
			{
				controller = Camera.main.GetComponent(Master);
				AudioManager.PlaySoundTransition(controller.currentWorld.audio.transitionOut);
				Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
				done = true;
			}
			yield WaitForSeconds(.7);
			AudioManager.StopSong();
			yield WaitForSeconds(1.3);
			Application.LoadLevel("WorldSelect");
		}
		else
		{
			if(newState == TheaterStatus.Home && TheaterController.currentState == TheaterStatus.FrontLedger && !hidden)
			{
				TheaterController.currentState = TheaterStatus.HomeLedger;
			}
			else if(newState == TheaterStatus.Front && TheaterController.currentState == TheaterStatus.HomeLedger && !hidden)
			{
				TheaterController.currentState = TheaterStatus.FrontLedger;
			}
			else if(newState == TheaterStatus.HomeLedger && TheaterController.currentState == TheaterStatus.Front)
			{
				TheaterController.currentState = TheaterStatus.FrontLedger;
			}
			else
			{
				if((TheaterController.currentState == TheaterStatus.HomeLedger || TheaterController.currentState == TheaterStatus.FrontLedger) && hidden)
				{
				}
				else if((TheaterController.currentState == TheaterStatus.CustomizeNoColor || TheaterController.currentState == TheaterStatus.CustomizeColor) && newState == TheaterStatus.CustomizeNoColor)
				{
					TheaterController.currentState = TheaterStatus.Home;
				}
				else
				{
					TheaterController.currentState = newState;
				}
			}
		}
	}
	else if(newState == TheaterStatus.Home && GameObject.FindGameObjectWithTag("LedgerController").GetComponent(LedgerController).loadedText == null)
	{
		TheaterController.currentState = newState;
	}
	*/
}