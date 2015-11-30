#pragma strict

var scenes:Scene[];

function Start () {
	StartScene(scenes[0]);
}

function Update () {

}

function StartScene (scene:Scene) {
	var i:int = 0;
	for(i = 0; i < scene.effects.movingObjects.length; i++)
	{
		if(scene.effects.movingObjects[i].GetComponent(ShowObjectManager) != null)
		{
			scene.effects.movingObjects[i].GetComponent(ShowObjectManager).Show();
		}
	}
	for(i = 0; i < scene.effects.colorChangeObjects.length; i++)
	{
		if(scene.effects.colorChangeObjects[i].GetComponent(ShowObjectManager) != null)
		{
			scene.effects.colorChangeObjects[i].GetComponent(ShowObjectManager).ChangeColor(scene.effects.newColor[i]);
		}
	}
}

function EndScene (scene:Scene) {
	
}

class Scene {
	var gameName:String;
	var gameStartTime:float;
	var gameEndTime:float;
	var effects:SceneEffects;
	var info:SceneInfo;
}

class SceneEffects {
	var movingObjects:GameObject[];
	var colorChangeObjects:SpriteRenderer[];
	var newColor:Color[];
}

class SceneInfo {
	var variableCheck:String;
	var maximumScore:float;
}