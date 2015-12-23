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

var startTime:float;
var endTime:float;

function Start () {
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
	GamePlay();
}

function Update () {
	Debug.Log(volumeLevels[0] + " Center: " + centers[0]);
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
			volumeLevels[i] = Mathf.MoveTowards(volumeLevels[i],1 - ((sliders[i].transform.position.y - centers[i])/(bottomLimit - centers[i])),Time.deltaTime);
		}
		else
		{
			volumeLevels[i] = Mathf.Clamp(volumeLevels[i] * ((sliders[i].transform.position.y - centers[i]) * Time.deltaTime * .25 + 1),0,2);
		}
		sliderVolumes[i].sprite = volumeSprites[Mathf.Floor(volumeLevels[i] * 12 + .3)];
	}
	
}

function GamePlay () {
	var variance:float = .8;
	while(ShowManager.currentMusicLocation < startTime)
	{
		yield;
	}
	while(ShowManager.currentMusicLocation < endTime)
	{
		for(var i:int = 0; i < centers.length; i++)
		{
			centers[i] = originalCenters[i] + Random.Range(-variance,variance);
		}
		yield WaitForSeconds(Random.Range(.5,4));
		yield;
	}
}