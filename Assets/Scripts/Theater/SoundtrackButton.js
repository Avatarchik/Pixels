#pragma strict

function Start () {
}

function Update () {

}

function Clicked () {
	if(!Master.notifying)
	{
		var doThing:boolean = true;
		if(Application.loadedLevelName == "Theater")
		{
			if(LedgerController.videoPlaying)
			{
				doThing = false;
			}
		}
		if(doThing)
		{
			Application.OpenURL("http://itunes.apple.com/album/id1079612781?ls=1&app=itunes");
		}
	}
}