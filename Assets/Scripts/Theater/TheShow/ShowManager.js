#pragma strict

function Start () {

}

function Update () {

}

class Scene {
	var gameName:String;
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