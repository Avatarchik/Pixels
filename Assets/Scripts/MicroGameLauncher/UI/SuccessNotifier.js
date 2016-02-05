#pragma strict

var coinParticle:ParticleSystem;

var characterObject:GameObject;

var characterSprite:Sprite[];

var characterParticle:ParticleSystem;

@HideInInspector var startLocation:Vector3;

@HideInInspector var particleLocation:Vector3;

@HideInInspector var endLocation:Vector3;

@HideInInspector var coinBurstAmount:float;

@HideInInspector var characterBurstAmount:float;

@HideInInspector var speed:float;

function Start () {
	startLocation = Vector3(-25,-13,transform.position.z);
	particleLocation = Vector3(0,-4,transform.position.z);
	endLocation = Vector3(25,-13,transform.position.z);
	coinBurstAmount = 10;
	characterBurstAmount = 15;
	speed = 130;
	Notify();
	Rotate();
}

function Notify () {
	characterObject.GetComponent(SpriteRenderer).sprite = characterSprite[Random.Range(0,characterSprite.length)];
	characterObject.transform.position = startLocation;
	coinParticle.Emit(coinBurstAmount);
	while(characterObject.transform.position != particleLocation)
	{
		characterObject.transform.position = Vector3.MoveTowards(characterObject.transform.position,particleLocation,Time.deltaTime * speed);
		yield;
	}
		characterParticle.Emit(characterBurstAmount);
	yield WaitForSeconds(.6);
	while(characterObject.transform.position != endLocation)
	{
		characterObject.transform.position = Vector3.MoveTowards(characterObject.transform.position,endLocation,Time.deltaTime * speed);
		yield;
	}
	yield WaitForSeconds(1.2);
	Destroy(gameObject);
}

function Rotate () {
	var waitTime:float = .07;
	while(true)
	{
		characterObject.transform.rotation.eulerAngles.z = -15;
		yield WaitForSeconds(waitTime);
		characterObject.transform.rotation.eulerAngles.z = 0;
		yield WaitForSeconds(waitTime);
		characterObject.transform.rotation.eulerAngles.z = 15;
		yield WaitForSeconds(waitTime);
		characterObject.transform.rotation.eulerAngles.z = 0;
		yield WaitForSeconds(waitTime);
		yield;
	}
}