#pragma strict

var colors:Color[];
var variable:String;

function Start () {
	ColorRotate();
	ColorFlicker();
}

function ColorRotate () {
	if(transform.GetComponent(SpriteRenderer) != null)
	{
		while(true)
		{
			yield WaitForSeconds(Random.Range(.2,1.3));
			transform.GetComponent(SpriteRenderer).color = colors[Random.Range(0,colors.length)];
			if(PlayerPrefs.GetInt(variable) == 1 || variable == "")
			{
				transform.GetComponent(SpriteRenderer).color.a = Random.Range(.6,1);
			}
			else
			{
				transform.GetComponent(SpriteRenderer).color.a = 0;
			}
			yield;
		}
	}
}
function ColorFlicker () {
	if(transform.GetComponent(SpriteRenderer) != null)
	{
		while(true)
		{
			yield WaitForSeconds(Random.Range(.05,.1));
			if(PlayerPrefs.GetInt(variable) == 1 || variable == "")
			{
				transform.GetComponent(SpriteRenderer).color.a += Random.Range(-.05,.05);
			}
			yield;
		}
	}
}