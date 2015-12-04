#pragma strict

var scenes:Scene[];

function Start () {
	for(var i:int = 0; i < scenes.length; i++)
	{
		scenes[i].effects.originalColor = new Color[scenes[i].effects.colorChangeObjects.length];
		for(var x:int = 0; x < scenes[i].effects.originalColor.length; x++)
		{
			scenes[i].effects.originalColor[x] = scenes[i].effects.colorChangeObjects[x].color;
		}
	}
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
	var i:int = 0;
	for(i = 0; i < scene.effects.movingObjects.length; i++)
	{
		if(scene.effects.movingObjects[i].GetComponent(ShowObjectManager) != null)
		{
			scene.effects.movingObjects[i].GetComponent(ShowObjectManager).Show();
		}
	}
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
	@HideInInspector var originalColor:Color[];
}

class SceneInfo {
	var variableCheck:String;
	var maximumScore:float;
	var theaterLocation:Vector3;	
}