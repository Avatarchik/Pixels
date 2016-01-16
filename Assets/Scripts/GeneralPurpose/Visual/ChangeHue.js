#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var hueMaterial:Material;
var hue:float;
var saturation:float;
var doToChildren:boolean;
var onStart:boolean;

@HideInInspector var ignoreList:String[];

function Start () {
	ignoreList = new String[10];
	ignoreList = ["Vertical","Horizontal","01","02","03","04","05","06","07","08"];
	if(onStart)
	{
		Instant();
	}
}

function Instant () {
	yield WaitForEndOfFrame;
	yield WaitForEndOfFrame;
	ChangeHue(transform,hue,saturation);
}

function ChangeHue (thisObject:Transform,newHue:float,newSat:float) {
	ChangeHue(thisObject,newHue,newSat,Color.white);
}
function ChangeHue (thisObject:Transform,newHue:float,newSat:float,tint:Color) {
	var allowed:boolean = true;
	for(var text:String in ignoreList)
	{
		if(text == thisObject.transform.name)
		{
			allowed = false;
		}
	}
	if(thisObject.GetComponent(SpriteRenderer)!= null && thisObject.GetComponent(SpriteRenderer).material != hueMaterial && allowed)
	{
		thisObject.GetComponent(SpriteRenderer).material = hueMaterial;
		thisObject.GetComponent(SpriteRenderer).material.SetFloat("_Hue",newHue);
		thisObject.GetComponent(SpriteRenderer).material.SetFloat("_Saturation",newSat);
		thisObject.GetComponent(SpriteRenderer).material.SetColor("_Color",tint);
	}
	if(doToChildren)
	{
		for(var i:int = 1; i < thisObject.GetComponentsInChildren(Transform).length; i++)
		{
			ChangeHue(thisObject.GetComponentsInChildren(Transform)[i],newHue,newSat,tint);
		}
	}
}