#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var xyzAxis:int;
var greaterThan:boolean;
var limit:float;
var replace:float;

function Start () {

}

function Update () {
	switch(xyzAxis)
	{
		case 1:
			if(greaterThan)
			{
				if(transform.position.x > limit)
				{
					transform.position.x = replace;
				}
			}
			else
			{
				if(transform.position.x < limit)
				{
					transform.position.x = replace;
				}
			}
			break;
		case 2:
			if(greaterThan)
			{
				if(transform.position.y > limit)
				{
					transform.position.y = replace;
				}
			}
			else
			{
				if(transform.position.y < limit)
				{
					transform.position.y = replace;
				}
			}
			break;
		case 3:
			if(greaterThan)
			{
				if(transform.position.z > limit)
				{
					transform.position.z = replace;
				}
			}
			else
			{
				if(transform.position.z < limit)
				{
					transform.position.z = replace;
				}
			}
			break;
		default:
			break;
	}
}