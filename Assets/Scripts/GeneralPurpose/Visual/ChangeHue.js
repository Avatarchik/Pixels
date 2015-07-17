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
	ChangeHue(transform,hue,saturation);
}

function ChangeHue (thisObject:Transform,newHue:float,newSat:float) {
	ChangeHue(thisObject,newHue,newSat,Color.white);
}
function ChangeHue (thisObject:Transform,newHue:float,newSat:float,tint:Color) {
	if(thisObject.GetComponent(SpriteRenderer)!= null && thisObject.GetComponent(SpriteRenderer).material != hueMaterial)
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