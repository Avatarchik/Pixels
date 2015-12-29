#pragma strict

@HideInInspector var scores:float[];

@HideInInspector var totalScore:float;

var frontSign:SpriteRenderer;

var sceneScores:TextMesh[];
var finalScore:TextMesh;

static var finished:boolean;

var applause:AudioClip[];

var boom:AudioClip;

var click:AudioClip;

function Start () {
	finished = false;
	frontSign.color.a = 0;
	totalScore = 0;
	for(var i:int = 0; i < sceneScores.length; i++)
	{
		sceneScores[i].text = "";
	}
	finalScore.text = "";
}

function Update () {

}

function DisplayScores (newScores:float[]) {
	scores = newScores;
	for(var i:int = 0; i < scores.length; i++)
	{
		yield WaitForSeconds(.15);
		AudioManager.PlaySound(click);
		sceneScores[i].text = Mathf.Ceil(scores[i]).ToString();
		totalScore += scores[i];
	}
	yield WaitForSeconds(1);
	frontSign.color.a = 1;
	if(totalScore < 300)
	{
		AudioManager.PlaySound(applause[0],.7);
	}
	else if(totalScore < 400)
	{
		AudioManager.PlaySound(applause[1],.7);
	}
	else
	{
		AudioManager.PlaySound(applause[2],.7);
	}
	AudioManager.PlaySound(boom,.6);
	while(frontSign.transform.localScale != Vector3(1,1,1))
	{
		frontSign.transform.localScale = Vector3.MoveTowards(frontSign.transform.localScale,Vector3(1,1,1),Time.deltaTime * 12);
		yield;
	}
	finalScore.text = Mathf.Ceil(totalScore).ToString();
	PlayerPrefs.SetFloat(Master.currentWorld.basic.worldNameVar+"HighScore",totalScore);
	if(Master.allowShow)
	{
		if(Master.matinee)
		{
			PlayerPrefs.GetInt("MatineeShowDate:"+System.DateTime.Today,1);
		}
		else
		{
			PlayerPrefs.GetInt("NightShowDate:"+System.DateTime.Today,1);
		}
	}
	yield WaitForSeconds(1);
	finished = true;
}