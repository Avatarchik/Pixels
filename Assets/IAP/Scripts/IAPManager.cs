using UnityEngine;
using UnityEngine.Events;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using System.IO;
using AOT;
using sdkbox;

public class IAPManager : MonoBehaviour {

	Vector3 startPosition;

	public GameObject[] begging;

	// Use this for initialization
	void Start () {
		startPosition = transform.position;
		startPosition.x = 100;
		transform.position = startPosition;
		startPosition.x = 0;
		StartCoroutine(LaunchNote());
	}
	
	// Update is called once per frame
	IEnumerator LaunchNote () {
		if(begging.Length > 0)
		{
			GameObject newBeggingNote;
			newBeggingNote = Instantiate(begging[Mathf.Min(begging.Length-1,PlayerPrefs.GetInt("IAPBeggingNumber"))]);
			newBeggingNote.transform.parent = transform;
			while(newBeggingNote != null)
			{
				yield return new WaitForEndOfFrame();
			}
		}
		transform.position = startPosition;
	}

	public void RequestIAP (String purchaseName) {
		if(Application.isEditor)
		{
			Success(new Product());
		}
		else
		{
			GetComponent<IAP>().purchase(purchaseName);
		}
	}

	public void RestorePurchases () {
		GetComponent<IAP>().restore();
	}

	public void Success (Product product) {
		if(Application.isEditor)
		{
			PlayerPrefs.SetInt("SaveSystemAvailable",1);
			PlayerPrefs.SetInt("PaidSongOneUnlocked",1);
			PlayerPrefs.SetInt("PaidSongTwoUnlocked",1);
			BroadcastMessage("It might have worked! Who knows!");
		}
		else
		{
			if(product.name == "UnlockSaving")
			{
				PlayerPrefs.SetInt("SaveSystemAvailable",1);
			}
			else if(product.name == "UnlockDollarSongOne")
			{
				PlayerPrefs.SetInt("PaidSongOneUnlocked",1);
			}
			else if(product.name == "UnlockDollarSongTwo")
			{
				PlayerPrefs.SetInt("PaidSongTwoUnlocked",1);
			}
			BroadcastMessage("SuccessfulPurchase",product.title + " was successfully unlocked!");
		}
	}

	public void Failure (Product product, String error) {
		BroadcastMessage("FailedPurchase");
	}

	public void Cancel () {
		BroadcastMessage("PurchaseCancelled");
	}

	public void Cancel (Product product) {
		BroadcastMessage("PurchaseCancelled");
	}

	public void Initialized (Boolean result) {
		if(!result)
		{
			BroadcastMessage("NotConnected");
		}
	}

	public void Restored (Product product) {

	}

	public void FinishedRestoring () {

	}
}
