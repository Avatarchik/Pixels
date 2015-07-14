#pragma strict

var hueMaterial:Material;
var hue:float;
var saturation:float;
var doToChildren:boolean;
var onStart:boolean;

function Start () {
	if(onStart)
	{
		Instant();
	}
}

function Instant () {
	yield WaitForEndOfFrame;
	yield WaitForEndOfFrame;
	ChangeHue(transform);
}

function ChangeHue (thisObject:Transform) {
	if(thisObject.GetComponent(SpriteRenderer)!= null && thisObject.GetComponent(SpriteRenderer).material != hueMaterial)
	{
		thisObject.GetComponent(SpriteRenderer).material = hueMaterial;
		thisObject.GetComponent(SpriteRenderer).material.SetFloat("_Hue",hue);
		thisObject.GetComponent(SpriteRenderer).material.SetFloat("_Saturation",saturation);
	}
	if(doToChildren)
	{
		for(var i:int = 1; i < thisObject.GetComponentsInChildren(Transform).length; i++)
		{
			ChangeHue(thisObject.GetComponentsInChildren(Transform)[i]);
		}
	}
}