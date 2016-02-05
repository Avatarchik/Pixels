#pragma strict

static var currentTime:float;

@HideInInspector var text:TextMesh;

function Start () {
	currentTime = 0;
	text = GetComponent(TextMesh);
}

function Update () {
	text.text = currentTime.ToString("f2");
	transform.position.z = -9.1;
}