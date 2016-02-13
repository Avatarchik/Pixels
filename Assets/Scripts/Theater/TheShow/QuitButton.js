#pragma strict

var transition:GameObject;

@HideInInspector var done:boolean;

var manager:ShowManager;

function Start () {
	done = false;
}

function Update () {
	if(manager.openingText == null)
	{
		GetComponent(SpriteRenderer).color.a = 1;
	}
	else
	{
		GetComponent(SpriteRenderer).color.a = 0;
	}
}

function Clicked () {
	if(transition != null && !done && manager.openingText == null)
	{
		manager.EndSong();
		var controller:Master = Camera.main.GetComponent(Master);
		AudioManager.PlaySoundTransition(controller.currentWorld.audio.transitionOut);
		Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
		done = true;
		yield WaitForSeconds(.7);
		AudioManager.StopSong();
		yield WaitForSeconds(1.3);
		Application.LoadLevel("WorldSelect");
	}
}