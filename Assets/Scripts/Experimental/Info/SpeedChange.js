﻿#pragma strict

static var textThing:String;

function Start () {

}

function Update () {
	GetComponent(TextMesh).text = textThing;
}