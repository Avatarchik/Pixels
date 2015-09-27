#pragma strict

function Start () {

}

function Update () {
	if(Finger.GetExists(0))
	{
		if(!Finger.GetInGame(0) && ((Finger.GetPosition(0).x > 9 && Finger.GetPosition(0).x < 11) || (Finger.GetPosition(0).y < -9 && Finger.GetPosition(0).y > -11)))
		{
			GetComponent(SpriteRenderer).color = Color(.6,.6,.6,1);
			transform.parent.parent.SendMessage("Finish",SendMessageOptions.DontRequireReceiver);
		}
	}
}