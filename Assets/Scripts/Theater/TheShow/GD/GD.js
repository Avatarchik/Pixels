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

function Start () {
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
	totalVolume *= 4;
	totalVolume += 12;
	largeVolume.sprite = volumeSprites[Mathf.Min(Mathf.Floor(totalVolume),volumeSprites.Length-1)];
	score -= Time.deltaTime * Mathf.Abs((totalVolume-12) * .4);
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
	}
	GameObject.FindGameObjectWithTag("ShowManager").GetComponent(ShowManager).scores[2] = score;
}