#pragma strict

var wordHolder:Transform;
var wordPrefab:GameObject;
var words:String[];
var times:float[];

var score:float;

@HideInInspector var buttons:GameObject[];
@HideInInspector var goodScore:float;
@HideInInspector var badScore:float;

@HideInInspector var finished:boolean;

var speakers:AudioSource[];
var failSounds:AudioClip[];
@HideInInspector var failChoice:int;

var musicStartTime:float;
var musicEndTime:float;

@HideInInspector var good:boolean;
@HideInInspector var numberGood:float;
@HideInInspector var numberBad:float;
@HideInInspector var threshold:float;

function Start () {
	good = true;
	score = 100;
	goodScore = 1;
	badScore = 1.8;
	numberGood = 1;
	numberBad = 1;
	threshold = .65;
	finished = false;
	buttons = new GameObject[words.length];
	for(var i:int = 0; i < words.length; i++)
	{
		buttons[i] = Instantiate(wordPrefab,Vector3(Random.Range(-7.9,7.9),Random.Range(-7.9,7.9),-.1), Quaternion.identity);
		buttons[i].transform.parent = wordHolder;
		var buttonManager:HSTextObject = buttons[i].GetComponent(HSTextObject);
		buttonManager.text = words[i];
		buttonManager.manager = transform.GetComponent(HS);
		buttonManager.thisOneNumber = i;
		if(times.Length > i)
		{
			buttonManager.tapTime = times[i];
		}
	}
	for(i = 0; i < times.length; i++)
	{
		times[i] -= .2;
	}
	MusicControl();
}

function Update () {
	if(Input.GetKeyDown("a"))
	{
		times = AddNumber(times,ShowManager.currentMusicLocation);
	}
	if(ShowManager.currentMusicLocation > times[times.length-1] + 1 && !finished)
	{
		finished = true;
		GameObject.FindGameObjectWithTag("ShowManager").GetComponent(ShowManager).scores[3] = score;
	}
}

function MusicControl () {
	while(ShowManager.currentMusicLocation < musicStartTime)
	{
		yield;
	}
	Debug.Log(ShowManager.currentMusicLocation);
	for(var i:int = 0; i < speakers.length; i++)
	{
		if(failSounds.Length > i)
		{
			speakers[i].clip = failSounds[i];
		}
		speakers[i].Play();
	}
	while(ShowManager.currentMusicLocation < musicEndTime)
	{
		if(good)
		{
			ShowManager.good = true;
			for(i = 0; i < speakers.length; i++)
			{
				speakers[i].volume = Mathf.MoveTowards(speakers[i].volume,0,Time.deltaTime * 4);
			}
		}
		else
		{
			ShowManager.good = false;
			speakers[failChoice].volume = Mathf.MoveTowards(speakers[failChoice].volume,4.5,Time.deltaTime);
		}
		yield;
	}
}

function GoodHit () {
	//score += goodScore;
	numberGood++;
	if(!good && numberBad/numberGood < threshold)
	{
		good = true;
	}
}

function BadHit () {
	score = Mathf.MoveTowards(score,0,badScore);
	numberBad++;
	if(good && numberBad/numberGood > threshold)
	{
		good = false;
		failChoice = Random.Range(0,speakers.Length);
	}
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

function AddNumber (original:float[],addition:float):float[] {
	var finalArray:float[] = new float[original.length+1];
	for(var y:float = 0; y < original.length; y++)
	{
		finalArray[y] = original[y];
	}
	finalArray[finalArray.length-1] = addition;
	return finalArray;
}