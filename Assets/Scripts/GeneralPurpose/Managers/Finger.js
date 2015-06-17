#pragma strict

static var identity:int[];

static var location:Vector3[];

static var inGame:boolean[];

static var phase:TouchPhase[];

static var velocity:Vector2[];

var recognized:boolean;

function Start () {
	inGame = [false,false,false,false,false];
	phase = [TouchPhase.Canceled,TouchPhase.Canceled,TouchPhase.Canceled,TouchPhase.Canceled,TouchPhase.Canceled];
	identity = [-1,-1,-1,-1,-1];
	location = [Vector3(-100,-100,-100),Vector3(-100,-100,-100),Vector3(-100,-100,-100),Vector3(-100,-100,-100),Vector3(-100,-100,-100)];
	velocity = [Vector2.zero,Vector2.zero,Vector2.zero,Vector2.zero,Vector2.zero];
}

function Update () {
	Debug.Log(location[0]);
	for (var touch:Touch in Input.touches) {
		var recognized:boolean = false;
		for(var x:int = 0; x < identity.length; x++)
		{
			if(touch.fingerId == identity[x])
			{
				recognized = true;
			}
		}
		if(!recognized)
		{
			for(var i:int = 0; i < identity.length; i++)
			{
				if(identity[i] < 0)
				{
					identity[i] = touch.fingerId;
					recognized = true;
					break;
				}
			}
		}
		if(recognized)
		{
			for(var y:int = 0; y < identity.length; y++)
			{
				if(touch.fingerId == identity[y])
				{
					if(touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled)
					{
						identity[y] = -1;
						velocity[y] = Vector2.zero;
					}
					else
					{
						location[y] = GetComponent.<Camera>().ScreenToWorldPoint(Vector3(touch.position.x, touch.position.y, 0));
						phase[y] = touch.phase;
						if(location[y].x < 9 && location[y].x > -9 && location[y].y < 9 && location[y].y > -9)
						{
							inGame[y] = true;
						}
						else
						{
							inGame[y] = false;
						}
						velocity[y] = touch.deltaPosition;
					}
				}
			}
		}
	}
}

//Function to find a finger's identification number.

static function GetId (finger:int) : int {
	return(identity[finger]);
}

//Function to find if a finger exists.

static function GetExists (finger:int) : boolean {
	if(finger < 0 || finger >= identity.Length || identity[finger] == -1)
	{
		return false;
	}
	else
	{
		return true;
	}
}

//Function to find a finger's position.

static function GetPosition (finger:int) : Vector2 {
	return(Vector2(location[finger].x,location[finger].y));
}

//Function to find if a finger is in the game area. (9x9)

static function GetInGame (finger:int) : boolean {
	return(inGame[finger]);
}

//Function to get the phase of a finger's touch.

static function GetPhase (finger:int) : TouchPhase {
	return(phase[finger]);
}

//Function to find a finger's velocity.

static function GetVelocity (finger:int) : Vector2 {
	if(velocity[finger] != null && velocity[finger] != Vector2.zero)
	{
		return(Vector2(velocity[finger].x,velocity[finger].y));
	}
	else
	{
		return Vector2(0,0);
	}
}