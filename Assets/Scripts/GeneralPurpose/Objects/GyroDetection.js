#pragma strict

static var delay:float;
static var automatic:boolean;
var gyro:Gyroscope;

var initial:Quaternion;
var gyroChange:Quaternion;
static var initialRotation:DeviceOrientation;
static var rotation:Vector3;

function Start () {
	gyro = Input.gyro;
	if(initialRotation == DeviceOrientation.Unknown)
	{
		initialRotation = Input.deviceOrientation;
	}
	gyro.enabled = true;
	if(automatic)
	{
		Initialize();
	}
}

function Initialize () {
	yield WaitForSeconds(delay);
	StartCoroutine(DetectGyro());
}


function DetectGyro () {
	initial = gyro.attitude;
	while(true)
	{
		gyroChange = initial * Quaternion.Inverse(gyro.attitude);
		rotation = gyroChange.eulerAngles;
		if(rotation.x > 180)
		{
			rotation.x -= 360;
		}
		if(rotation.y > 180)
		{
			rotation.y -= 360;
		}
		if(rotation.z > 180)
		{
			rotation.z -= 360;
		}
		if(initialRotation == DeviceOrientation.Portrait || initialRotation == DeviceOrientation.PortraitUpsideDown)
		{
			rotation = Vector3(rotation.y,rotation.x,rotation.z);
		}
		switch(Input.deviceOrientation)
		{
			case DeviceOrientation.Portrait:
				//rotation = Vector3(rotation.y,rotation.x,rotation.z);
				rotation *= -1;
				break;
			case DeviceOrientation.PortraitUpsideDown:
				rotation.z *= -1;
				//rotation = Vector3(rotation.y,rotation.x,rotation.z);
				break;
			case DeviceOrientation.LandscapeLeft:
				rotation *= -1;
				//rotation.y *= -1;
				//rotation.z *= -1;
				//rotation = Vector3(rotation.y,rotation.x,rotation.z);
				break;
			case DeviceOrientation.LandscapeRight:
				rotation *= -1;
				//rotation.y *= -1;
				//rotation.z *= -1;
				break;
			default:
				break;
		}
		yield;
	}
	yield;
}

function ConvertRotation(q:Quaternion):Quaternion {
    return new Quaternion(q.x, q.y, -q.z, -q.w);
}