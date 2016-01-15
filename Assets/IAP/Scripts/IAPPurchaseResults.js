#pragma strict

@HideInInspector var notConnected:boolean;
@HideInInspector var succesfullyPurchased:boolean;

function Start () {
	notConnected = false;
	succesfullyPurchased = false;
}

function Update () {

}

function NotConnected () {
	Results("Couldn't connect! Unlock from menu when connected!");
}

function SuccessfulPurchase (note:String) {
	Results(note);
}

function PurchaseCancelled () {
	Results("Unlock from the menu if you change your mind!");
}

function FailedPurchase () {
	Results("Purchase failed! Unlock from menu when connected!");
}

function Results (note:String) {
	Camera.main.GetComponent(Master).LaunchNotification(note,NotificationType.tutorial);
	transform.position.x = 100;
	while(Master.notifying)
	{
		yield;
	}
	Destroy(gameObject);
}