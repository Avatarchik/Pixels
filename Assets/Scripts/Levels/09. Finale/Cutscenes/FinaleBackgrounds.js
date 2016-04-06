#pragma strict

var backgrounds:GameObject[];

var speed:float;

function Start () {
}

function Update () {
	for(var i:int = 0; i < backgrounds.length; i++)
	{
		backgrounds[i].transform.localPosition.x -= Time.deltaTime * speed;
		if(backgrounds[i].transform.localPosition.x <= -2.45)
		{
			if(i == 0)
			{
				backgrounds[i].transform.localPosition.x = backgrounds[backgrounds.length-1].transform.localPosition.x + 2.45;
			}
			else
			{
				backgrounds[i].transform.localPosition.x = backgrounds[i-1].transform.localPosition.x + 2.45;
			}
		}
	}
}