#pragma strict

function Clicked() {
	if(Application.loadedLevelName == "MicroTester")
	{
		GameObject.FindGameObjectWithTag("GameController").GetComponent(MicroTester).Clicked();
	}
	else 
	{
		if(GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).loadedText!=null)
		{
			GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).loadedText.GetComponent(TextManager).Clicked();
			//GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).loadedText.GetComponent(TextManager).NextLine();
		}
		GameObject.FindGameObjectWithTag("GameController").GetComponent(GameManager).Clicked();
	}
}