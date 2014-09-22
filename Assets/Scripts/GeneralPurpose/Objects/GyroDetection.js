#pragma strict

static var delay:float;
static var automatic:boolean;
var gyro:Gyroscope;

var initial:Quaternion;
var gyroChange:Quaternion;
static var rotation:Vector3;

function Start () {
	gyro = Input.gyro;
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
		if (Input.deviceOrientation == DeviceOrientation.Portrait)
		{
			rotation = Vector3(rotation.y,rotation.x,rotation.z);
			rotation *= -1;
		}
		if (Input.deviceOrientation == DeviceOrientation.LandscapeLeft)
		{
			rotation.x *= -1;
			rotation.z *= -1;
		}
		if (Input.deviceOrientation == DeviceOrientation.LandscapeRight)
		{
			rotation.y *= -1;
			rotation.z *= -1;
		}
		if (Input.deviceOrientation == DeviceOrientation.PortraitUpsideDown)
		{
			rotation = Vector3(rotation.y,rotation.x,rotation.z);
			rotation.z *= -1;
		}
		yield;
	}
	yield;
}

function ConvertRotation(q:Quaternion):Quaternion {
    return new Quaternion(q.x, q.y, -q.z, -q.w);
}