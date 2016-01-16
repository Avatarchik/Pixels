#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

var letter0A:SpriteRenderer;
var letter1R:SpriteRenderer;
var letter2C:SpriteRenderer;
var letter3A:SpriteRenderer;
var letter4D:SpriteRenderer;
var letter5E:SpriteRenderer;

@HideInInspector var max:float;

@HideInInspector var on:boolean[];
@HideInInspector var brightness:float[];

@HideInInspector var speed:float;

function Start () {
	speed = 10;
	on = new boolean[6];
	brightness = new float[6];
	brightness = [0.0,0,0,0,0,0];
	on = [false,false,false,false,false,false];
	SignStuff();
	Brightness();
}

function Update () {
	if(on[0])
	{
		letter0A.color.a = Mathf.MoveTowards(letter0A.color.a,brightness[0],speed*Time.deltaTime);
	}
	else
	{
		letter0A.color.a = Mathf.MoveTowards(letter0A.color.a,0,speed*Time.deltaTime);	
	}
	if(on[1])
	{
		letter1R.color.a = Mathf.MoveTowards(letter1R.color.a,brightness[1],speed*Time.deltaTime);
	}
	else
	{
		letter1R.color.a = Mathf.MoveTowards(letter1R.color.a,0,speed*Time.deltaTime);
	}
	if(on[2])
	{
		letter2C.color.a = Mathf.MoveTowards(letter2C.color.a,brightness[2],speed*Time.deltaTime);
	}
	else
	{
		letter2C.color.a = Mathf.MoveTowards(letter2C.color.a,0,speed*Time.deltaTime);
	}
	if(on[3])
	{
		letter3A.color.a = Mathf.MoveTowards(letter3A.color.a,brightness[3],speed*Time.deltaTime);
	}
	else
	{
		letter3A.color.a = Mathf.MoveTowards(letter3A.color.a,0,speed*Time.deltaTime);
	}
	if(on[4])
	{
		letter4D.color.a = Mathf.MoveTowards(letter4D.color.a,brightness[4],speed*Time.deltaTime);
	}
	else
	{
		letter4D.color.a = Mathf.MoveTowards(letter4D.color.a,0,speed*Time.deltaTime);
	}
	if(on[5])
	{
		letter5E.color.a = Mathf.MoveTowards(letter5E.color.a,brightness[5],speed*Time.deltaTime);
	}
	else
	{
		letter5E.color.a = Mathf.MoveTowards(letter5E.color.a,0,speed*Time.deltaTime);
	}
}

function SignStuff () {
	while(true)
	{
		on[0] = true;
		yield WaitForSeconds(.8);
		on[1] = true;
		yield WaitForSeconds(.8);
		on[2] = true;
		yield WaitForSeconds(.8);
		on[3] = true;
		yield WaitForSeconds(.8);
		on[4] = true;
		yield WaitForSeconds(.8);
		on[5] = true;
		yield WaitForSeconds(1.5);
		on[0] = false;
		on[1] = false;
		on[2] = false;
		on[3] = false;
		on[4] = false;
		on[5] = false;
		yield WaitForSeconds(.5);
		on[0] = true;
		on[1] = true;
		on[2] = true;
		on[3] = true;
		on[4] = true;
		on[5] = true;
		yield WaitForSeconds(.5);
		on[0] = false;
		on[1] = false;
		on[2] = false;
		on[3] = false;
		on[4] = false;
		on[5] = false;
		yield WaitForSeconds(.5);
		on[0] = true;
		on[1] = true;
		on[2] = true;
		on[3] = true;
		on[4] = true;
		on[5] = true;
		yield WaitForSeconds(.5);
		on[0] = false;
		on[1] = false;
		on[2] = false;
		on[3] = false;
		on[4] = false;
		on[5] = false;
		yield WaitForSeconds(.5);
		on[0] = true;
		on[1] = true;
		on[2] = true;
		on[3] = true;
		on[4] = true;
		on[5] = true;
		yield WaitForSeconds(6);
		on[0] = false;
		on[1] = false;
		on[2] = false;
		on[3] = false;
		on[4] = false;
		on[5] = false;
		yield WaitForSeconds(.8);
		yield;
	}
}

function Brightness () {
	while(true)
	{
		yield WaitForSeconds(.05);
		{
			for(var i:int = 0; i < brightness.length; i++)
			{
				if(max == 0)
				{
					brightness[i] = 0;	
				}
				else
				{
					brightness[i] = Random.Range(.93,1);
				}
			}
		}
	yield;
	}
}

function StartRotation () {
	max = 1;
}

function StopRotation () {
	max = 0;
}