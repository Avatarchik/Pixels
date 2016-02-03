#pragma strict

@HideInInspector var done:boolean;

function Start () {
	done = false;
}

function Update () {

}

function NotConnected () {
	yield WaitForSeconds(.1);
	Results("Connect to the internet to save game data!");
}

function SuccessfulPurchase (note:String) {
	Results(note, true);
}

function RestoreSuccess () {
	Results("Item restored!");
}

function RestoreFailed () {
	Results("Unable to restore this item!");
}

function PurchaseCancelled () {
	Results("Unlock from the menu if you change your mind!");
}

function FailedPurchase () {
	Results("Purchase failed! Unlock from menu when connected!");
}

function Results (note:String) {
	if(!done)
	{
		done = true;
		Master.notifying = false;
		Camera.main.GetComponent(Master).LaunchNotification(note,NotificationType.tutorial);
		transform.position.x = 100;
		while(Master.notifying)
		{
			yield;
		}
		Destroy(gameObject);
	}
}

function Results (note:String,success:boolean)
{
	if(!done)
	{
		Results(note);
	}
	else if(success)
	{
		Camera.main.GetComponent(Master).ChangeNotificationText(note);
	}
}