#pragma strict

@HideInInspector var scores:float[];

@HideInInspector var totalScore:float;

var frontSign:SpriteRenderer;

var sceneScores:TextMesh[];
var finalScore:TextMesh;

function Start () {
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
		yield WaitForSeconds(.2);
		sceneScores[i].text = Mathf.Ceil(scores[i]).ToString();
		totalScore += scores[i];
	}
	yield WaitForSeconds(1.5);
	frontSign.color.a = 1;
	while(frontSign.transform.localScale != Vector3(1,1,1))
	{
		frontSign.transform.localScale = Vector3.MoveTowards(frontSign.transform.localScale,Vector3(1,1,1),Time.deltaTime * 20);
		yield;
	}
	yield WaitForSeconds(1);
	finalScore.text = Mathf.Ceil(totalScore).ToString();
}