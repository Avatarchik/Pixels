#pragma strict

var objectNumbers:float[];
var creditsObjects:GameObject[];
@HideInInspector var credits:GameObject[];
@HideInInspector var speed:float;

var record:boolean;
var recordBars:boolean;

var creditsSong:AudioClip;

var endGameNote:GameObject;

@HideInInspector var newNote:GameObject;
@HideInInspector var leaving:boolean;

var transition:GameObject;

var colorBars:CreditsColorBars[];

var colorBarTimes:float[];

function Start () {
	leaving = false;
	credits = new GameObject[creditsObjects.length];
	if(creditsObjects.Length > 0)
	{
		credits[0] = Instantiate(creditsObjects[0],Vector3.zero + Vector3(100,0,5),Quaternion.identity);
	}
	ShowObject(0);
	speed = 50;
	if(record)
	{
		AudioManager.PlaySong(creditsSong);
		Record();
	}
	else
	{
		if(recordBars)
		{
			RecordBars();
		}
		else
		{
			ColorBars();
		}
		Credits();
	}
}

function Update () {

}

function ColorBars () {
	for(var i:int = 0; i < colorBarTimes.length; i++)
	{
		while(AudioManager.GetLocation() < colorBarTimes[i])
		{
			yield;
		}
		ActivateColorBars();
	}
}

function Credits () {
	yield WaitForSeconds(.5);
	AudioManager.PlaySong(creditsSong);
	for(var i:int = 1; i < objectNumbers.length; i++)
	{
		while(AudioManager.GetLocation() < objectNumbers[i])
		{
			yield;
		}
		if(leaving)
		{
			break;
		}
		if(i < creditsObjects.length)
		{
			ShowObject(i);
			if(i > 0)
			{
				HideObject(i-1);
			}
		}
		else
		{
			HideObject(i);
		}
	}
	yield WaitForSeconds(1);
	Leave();
}

function ShowObject (object:int) {
	var start:Vector3 = Vector3.zero + Vector3(0,0,5);
	switch(object%4)
	{
		case 0:
			start.x = 25;
			break;
		case 1:
			start.y = -25;
			break;
		case 2:
			start.x = -25;
			break;
		case 3:
			start.y = 25;
			break;
		default:
			break;
	}
	credits[object] = Instantiate(creditsObjects[object],start,Quaternion.identity);
	while(credits[object].transform.position != Vector3.zero + Vector3(0,0,5))
	{
		credits[object].transform.position = Vector3.MoveTowards(credits[object].transform.position,Vector3.zero + Vector3(0,0,5),Time.deltaTime*Time.timeScale*speed);
		yield;
	}
}

function HideObject (object:int) {
	var end:Vector3 = Vector3.zero + Vector3(0,0,5);
	switch(object%4)
	{
		case 0:
			end.x = -100;
			break;
		case 1:
			end.y = 100;
			break;
		case 2:
			end.x = 100;
			break;
		case 3:
			end.y = -100;
			break;
		default:
			break;
	}
	var randomNumber:float = Random.value;
	if(object >= 0 && object < credits.Length)
	{
		while(credits[object].transform.position != end)
		{
			credits[object].transform.position = Vector3.MoveTowards(credits[object].transform.position,end,Time.deltaTime*Time.timeScale*speed);
			if(randomNumber < .5)
			{
				credits[object].transform.Rotate(Vector3(0,0,40) * Time.deltaTime);
			}	
			else
			{
				credits[object].transform.Rotate(Vector3(0,0,-40) * Time.deltaTime);
			}
			yield;
		}
		Destroy(credits[object]);
	}
}

function Record () {
	var placeHolder:int = 1;
	objectNumbers = new float[1];
	objectNumbers[0] = 0;
	while(true)
	{
		
		if(Input.GetKeyDown("a"))
		{
			objectNumbers = AddNumber(objectNumbers,AudioManager.GetLocation());
			ShowObject(placeHolder);
			if(placeHolder > 0)
			{
				HideObject(placeHolder-1);
			}
			placeHolder++;
		}
		yield;
	}
}

function RecordBars () {
	var placeHolder:int = 0;
	colorBarTimes = new float[0];
	while(true)
	{
		
		if(Input.GetKeyDown("a"))
		{
			colorBarTimes = AddNumber(colorBarTimes,AudioManager.GetLocation());
			ActivateColorBars();
			placeHolder++;
		}
		yield;
	}
}

function ActivateColorBars () {
	if(colorBars.length > 0)
	{
		var randomNumber:int = Random.Range(0,colorBars[0].colors.length);
	}
	for(var i:int = 0; i < colorBars.length; i++)
	{
		colorBars[i].ShootColor(randomNumber);
	}
}

function AddNumber (original:float[],addition:float):float[] {
	var finalArray:float[] = new float[original.length+1];
	for(var y:float = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function Leave () {
	if(!leaving)
	{
		leaving = true;
		if(PlayerPrefs.GetInt("EndGameMoreToDo") != 1)
		{
			PlayerPrefs.SetInt("EndGameMoreToDo",1);
			newNote = Instantiate(endGameNote);
			for(var i:int = 0; i < creditsObjects.length; i++)
			{
				if(credits[i] != null)
				{
					HideObject(i);
				}
			}
		}
		while(newNote != null)
		{
			yield;
		}
		var controller:Master = Camera.main.GetComponent(Master);
		AudioManager.PlaySoundTransition(controller.currentWorld.audio.transitionOut);
		Instantiate(transition, Vector3(0,0,-5), Quaternion.identity);
		yield WaitForSeconds(.7);
		AudioManager.StopSong();
		yield WaitForSeconds(1.3);
		Application.LoadLevel("TitleScreen");
	}
}