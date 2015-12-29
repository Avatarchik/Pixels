#pragma strict

var sliders:GameObject[];
var sliderVolumes:SpriteRenderer[];
var largeVolume:SpriteRenderer;
var feedbackWarnings:SpriteRenderer[];
var largeWarnings:SpriteRenderer[];

var volumeSprites:Sprite[];

@HideInInspector var topLimit:float;
@HideInInspector var bottomLimit:float;
@HideInInspector var centers:float[];
@HideInInspector var originalCenters:float[];
@HideInInspector var volumeLevels:float[];

@HideInInspector var allowableDistance:float;

@HideInInspector var multiplyAmount:float;

@HideInInspector var score:float;
@HideInInspector var totalVolume:float;

@HideInInspector var startTime:float;
@HideInInspector var endTime:float;

@HideInInspector var speaker:AudioSource;

var eric:Eric;

function Start () {
	speaker = GetComponent(AudioSource);
	score = 100;
	startTime = 56;
	endTime = 86;
	volumeLevels = [1f,1f,1f];
	multiplyAmount = 1;
	topLimit = -1.4;
	bottomLimit = -7.45;
	centers = new float[3];
	originalCenters = new float[3];
	allowableDistance = 2;
	for(var i:int = 0; i < centers.length; i++)
	{
		centers[i] = sliders[i].transform.position.y;
		originalCenters[i] = centers[i];
	}
	if(eric.recording)
	{
		Recording();
	}
	else
	{
		EricMove();
		EricTalk();
	}
	GamePlay();
}

function Update () {
	for(var i:int = 0; i < sliders.length; i++)
	{
		for(var x:int = 0; x < Finger.identity.length; x++)
		{
			if(Finger.GetExists(x) && Vector2.Distance(Finger.GetPosition(x),sliders[i].transform.position) < allowableDistance)
			{
				sliders[i].transform.position.y = Mathf.Clamp(Finger.GetPosition(x).y,bottomLimit,topLimit);
			}
		}
		if(sliders[i].transform.position.y < centers[i])
		{
			volumeLevels[i] = Mathf.MoveTowards(volumeLevels[i],1 - ((sliders[i].transform.position.y - centers[i])/(bottomLimit - centers[i])),Time.deltaTime * 1.5);
		}
		else
		{
			volumeLevels[i] = Mathf.Clamp(volumeLevels[i] * ((sliders[i].transform.position.y - centers[i]) * Time.deltaTime * .25 + 1),0,2);
		}
		sliderVolumes[i].sprite = volumeSprites[Mathf.Min(Mathf.Floor(volumeLevels[i] * 12 + .3),volumeSprites.Length-1)];
	}
	totalVolume = 0;
	for(i = 0; i < volumeLevels.length; i++)
	{
		totalVolume += volumeLevels[i] - 1;
	}
	if(PlayerPrefs.GetInt("Sound") == 1 && ShowManager.currentMusicLocation < endTime && ShowManager.currentMusicLocation > startTime)
	{
		speaker.volume = Mathf.Max(0,totalVolume - .5)/3.5;
	}
	else
	{
		speaker.volume = Mathf.MoveTowards(speaker.volume,0,Time.deltaTime * 3);
	}
	totalVolume *= 4;
	totalVolume += 12;
	largeVolume.sprite = volumeSprites[Mathf.Min(Mathf.Floor(totalVolume),volumeSprites.Length-1)];
	score -= Time.deltaTime * Mathf.Abs((totalVolume-12) * .4);
}

function GamePlay () {
	var variance:float = 1.3;
	while(ShowManager.currentMusicLocation < startTime)
	{
		yield;
	}
	ShowManager.good = true;
	while(ShowManager.currentMusicLocation < endTime)
	{
		for(var i:int = 0; i < centers.length; i++)
		{
			centers[i] = originalCenters[i] + Random.Range(-variance,variance);
		}
		yield WaitForSeconds(Random.Range(.5,4));
	}
	GameObject.FindGameObjectWithTag("ShowManager").GetComponent(ShowManager).scores[2] = score;
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

function AddNumber (original:int[],addition:int):int[] {
	var finalArray:int[] = new int[original.length+1];
	for(var y:int = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}

function EricTalk () {
	for(var i:int = 0; i < eric.mouthChanges.length; i++)
	{
		while(ShowManager.currentMusicLocation < eric.mouthChanges[i])
		{
			yield;
		}
		eric.ericMouth.sprite = eric.ericMouthSprites[eric.mouthChangeNumbers[i]];
	}
}

function EricMove () {
	var which:boolean = true;
	for(var i:int = 0; i < eric.moveTimes.length; i++)
	{
		while(ShowManager.currentMusicLocation < eric.moveTimes[i])
		{
			yield;
		}
		if(which)
		{
			eric.eric.sprite = eric.ericSprites[0];
		}	
		else
		{
			eric.eric.sprite = eric.ericSprites[1];
		}
		eric.eric.transform.position.x -= eric.amountToMove;
		which = !which;
	}
}

function Recording () {
	while(true)
	{
		if(Input.GetKeyDown("m"))
		{
			eric.mouthChanges = AddNumber(eric.mouthChanges,ShowManager.currentMusicLocation);
			eric.mouthChangeNumbers = AddNumber(eric.mouthChangeNumbers,0);
		}
		if(Input.GetKeyUp("m"))
		{
			eric.mouthChanges = AddNumber(eric.mouthChanges,ShowManager.currentMusicLocation);
			eric.mouthChangeNumbers = AddNumber(eric.mouthChangeNumbers,1);
		}
		if(Input.GetKeyDown("q"))
		{
			eric.moveTimes = AddNumber(eric.moveTimes,ShowManager.currentMusicLocation);
		}
		yield;
	}
}

class Eric {
	var eric:SpriteRenderer;
	var ericMouth:SpriteRenderer;
	var ericSprites:Sprite[];
	var ericMouthSprites:Sprite[];
	var mouthChanges:float[];
	var mouthChangeNumbers:int[];
	var amountToMove:float;
	var moveTimes:float[];
	var recording:boolean;
}