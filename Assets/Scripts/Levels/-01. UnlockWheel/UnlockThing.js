#pragma strict

var unlock1Item:GameObject;
var unlock2Item:GameObject;
var unlock3Item:GameObject;

var unlock1Text:TextMesh;
var unlock2Text:TextMesh;
var unlock3Text:TextMesh;

@HideInInspector var step:int;

function Start () {
	step = 1;
	unlock1Item.transform.localScale = Vector3(2,2,2);
	unlock2Item.transform.localScale = Vector3(2,2,2);
	unlock3Item.transform.localScale = Vector3(2,2,2);
}

function Update () {
	if(unlock1Item == null && unlock2Item == null && unlock3Item == null)
	{
		Destroy(gameObject);
	}
	switch(step)
	{
		case 1:
			if(unlock1Item != null)
			{
				unlock1Item.transform.position.y = 3.36;
				unlock1Item.transform.localScale = Vector3.MoveTowards(unlock1Item.transform.localScale,Vector3(.9,.9,.9),Time.deltaTime*10);
			}
			if(unlock2Item != null)
			{
				unlock2Item.transform.position.y = 200;
			}
			if(unlock3Item != null)
			{
				unlock3Item.transform.position.y = 200;
			}
			break; 
		case 2:
			if(unlock1Item != null)
			{
				Destroy(unlock1Item);
			}
			if(unlock2Item != null)
			{
				unlock2Item.transform.position.y = 3.36;
				unlock2Item.transform.localScale = Vector3.MoveTowards(unlock2Item.transform.localScale,Vector3(.9,.9,.9),Time.deltaTime*10);
			}
			if(unlock3Item != null)
			{
				unlock3Item.transform.position.y = 200;
			}
			break;
		case 3:
			if(unlock1Item != null)
			{
				Destroy(unlock1Item);
			}
			if(unlock2Item != null)
			{
				Destroy(unlock2Item);
			}
			if(unlock3Item != null)
			{
				unlock3Item.transform.position.y = 3.36;
				unlock3Item.transform.localScale = Vector3.MoveTowards(unlock3Item.transform.localScale,Vector3(.9,.9,.9),Time.deltaTime*10);
			}
			break;
		default:
			if(unlock1Item != null)
			{
				Destroy(unlock1Item);
			}
			if(unlock2Item != null)
			{
				Destroy(unlock2Item);
			}
			if(unlock3Item != null)
			{
				Destroy(unlock3Item);
			}
			break;
	}
}

function Clicked () {
	step ++;
}