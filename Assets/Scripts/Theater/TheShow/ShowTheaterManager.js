#pragma strict

@HideInInspector var stageWall:SpriteRenderer;
@HideInInspector var stageFloor:SpriteRenderer;
@HideInInspector var ceiling:SpriteRenderer;
@HideInInspector var theaterWall:SpriteRenderer;
@HideInInspector var theaterFloor:SpriteRenderer;
@HideInInspector var curtain:SpriteRenderer;
@HideInInspector var chairs:SpriteRenderer;

function Start () {
	FindPieces();
}

function FindPieces() {
	yield WaitForEndOfFrame();
	yield WaitForEndOfFrame();
	var manager:TheaterManager = GetComponent(TheaterManager);
	stageWall = manager.currentStageWall.GetComponent(SpriteRenderer);
	stageFloor = manager.currentStageFloor.GetComponent(SpriteRenderer);
	ceiling = manager.currentCeiling.GetComponent(SpriteRenderer);
	theaterWall = manager.currentTheaterWall.GetComponent(SpriteRenderer);
	theaterFloor = manager.currentTheaterFloor.GetComponent(SpriteRenderer);
	curtain = manager.currentCurtain.GetComponent(SpriteRenderer);
	chairs = manager.currentChairs.GetComponent(SpriteRenderer);
	StartOfShow();
}

function StartOfShow () {
	var brightness:float = chairs.color.r;
	while(brightness != .14)
	{
		ceiling.color = Color(brightness,brightness,brightness,1);
		theaterWall.color = Color(brightness,brightness,brightness,1);
		theaterFloor.color = Color(brightness,brightness,brightness,1);
		curtain.color = Color(brightness,brightness,brightness,1);
		chairs.color = Color(brightness,brightness,brightness,1);
		brightness = Mathf.MoveTowards(brightness,.14,Time.deltaTime * .3);
		yield;
	}
}

function Update () {

}