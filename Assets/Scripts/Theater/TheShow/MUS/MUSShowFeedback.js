#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var speed:float;
var colorChangeSpeed:float;

function Start () {

}

function Update () {
	transform.position.y += Time.deltaTime * speed;
	GetComponent(TextMesh).color.a = Mathf.MoveTowards(GetComponent(TextMesh).color.a,0,Time.deltaTime * colorChangeSpeed);
	if(GetComponent(TextMesh).color.a == 0)
	{
		Destroy(gameObject);
	}
}