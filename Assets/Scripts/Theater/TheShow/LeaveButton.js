#pragma strict

var vertical:boolean;

var transition:GameObject;

@HideInInspector var done:boolean;

function Start () {
	done = false;
}

function Update () {
	if(((Master.vertical && vertical) || (!Master.vertical && !vertical)) && TheShowResultsScreen.finished)
	{
		GetComponent(SpriteRenderer).color.a = 1;
		GetComponent(ButtonSquare).enabled = true;
	}
	else
	{
		GetComponent(SpriteRenderer).color.a = 0;
		GetComponent(ButtonSquare).enabled = false;
	}
}

function Clicked () {
	if(TheShowResultsScreen.finished)
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