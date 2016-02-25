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

	public GameObject[] buttons;

	Boolean skip;

	String restoreName;

	public TextMesh price;

	GameObject newBeggingNote;

	Boolean restored;

	void Awake () {
		skip = false;
		restored = false;
	}

	// Use this for initialization
	void Start () {
		restoreName = "";
		startPosition = transform.localPosition;
		startPosition.x = 100;
		transform.localPosition = startPosition;
		startPosition.x = 0;
		StartCoroutine(LaunchNote());
	}

	void SkipTheSpeaking () {
		skip = true;
	}

	void DestroyButtons () {
		for(int i = 0; i < buttons.Length; i++)
		{
			Destroy (buttons[i]);
		}
		GetComponent<TextMesh>().text = "Connecting...";
		StartCoroutine(TimeOutCounter());
	}

	IEnumerator TimeOutCounter () {
		yield return new WaitForSeconds(15);
		StartCoroutine(SendFailure());
	}
	// Update is called once per frame
	IEnumerator LaunchNote () {
		if(begging.Length > 0 && !skip && PlayerPrefs.GetInt("IAPBeggingNumber") < begging.Length )
		{
			newBeggingNote = Instantiate(begging[Mathf.Min(begging.Length-1,PlayerPrefs.GetInt("IAPBeggingNumber"))]);
			PlayerPrefs.SetInt("IAPBeggingNumber",PlayerPrefs.GetInt("IAPBeggingNumber") + 1);
			newBeggingNote.transform.parent = transform;
			while(newBeggingNote != null)
			{
				yield return new WaitForEndOfFrame();
			}
			if(GameObject.FindGameObjectWithTag("MapManager") != null)
			{
				GameObject.FindGameObjectWithTag("MapManager").BroadcastMessage("StartSong",SendMessageOptions.DontRequireReceiver);
			}	
		}
		transform.position = startPosition;
	}

	public void RequestIAP (String purchaseName) {
		DestroyButtons();
		if(Application.isEditor)
		{
			Success(new Product());
		}
		else
		{
			GetComponent<IAP>().purchase(purchaseName);
		}
	}

	public void RestorePurchases (String purchaseName) {
		DestroyButtons();
		restoreName = purchaseName;
		GetComponent<IAP>().restore();
	}

	public void ProductsRequested (Product[] products) {
		for(int i = 0; i < products.Length; i++)
		{

		}
	}

	public void Success (Product product) {
		if(Application.isEditor)
		{
			PlayerPrefs.SetInt("SaveSystemAvailable",1);
			PlayerPrefs.SetInt("PaidSongOneUnlocked",1);
			PlayerPrefs.SetInt("PaidSongTwoUnlocked",1);
			BroadcastMessage("SuccessfulPurchase","It might have worked! Who knows!");
		}
		else
		{
			if(product.id == "com.turner.peterpanic.unlocksaving")
			{
				PlayerPrefs.SetInt("SaveSystemAvailable",1);
				BroadcastMessage("SuccessfulPurchase", "Saving was successfully unlocked!");
			}
			else if(product.id == "com.turner.peterpanic.unlockdollarsongone")
			{
				PlayerPrefs.SetInt("PaidSongOneUnlocked",1);
				BroadcastMessage("SuccessfulPurchase", "Dollar Song One was successfully unlocked!");
			}
			else if(product.id == "com.turner.peterpanic.unlockdollarsongtwo")
			{
				PlayerPrefs.SetInt("PaidSongTwoUnlocked",1);
				BroadcastMessage("SuccessfulPurchase", "Dollar Song Two successfully unlocked!");
			}
		}
	}

	public void Failure (String error) {
		StartCoroutine(SendFailure());
	}

	public void Failure (Product product, String error) {
		StartCoroutine(SendFailure());
	}

	public void Cancel () {
		BroadcastMessage("PurchaseCancelled");
	}

	public void Cancel (Product product) {
		BroadcastMessage("PurchaseCancelled");
	}

	public void Initialized (Boolean result) {
		Debug.Log("Initialized WAS:" + result);
		if(result)
		{
		}
	}

	public IEnumerator SendFailure () {
		while(newBeggingNote != null)
		{
			yield return new WaitForEndOfFrame()	;
		}
		BroadcastMessage("FailedPurchase");
	}

	public void Restored (Product product) {
		if(product.id == "com.turner.peterpanic.unlocksaving")
		{
			PlayerPrefs.SetInt("SaveSystemAvailable",1);
		}
		else if(product.id == "com.turner.peterpanic.unlockdollarsongone")
		{
			PlayerPrefs.SetInt("PaidSongOneUnlocked",1);
		}
		else if(product.id == "com.turner.peterpanic.unlockdollarsongtwo")
		{
			PlayerPrefs.SetInt("PaidSongTwoUnlocked",1);
		}
		if(product.name == restoreName || restoreName == "")
		{
			restored = true;
			BroadcastMessage("RestoreSuccess");
		}
		else
		{
		}
	}

	public void FinishedRestoring () {
		if(!restored)
		{
			BroadcastMessage("RestoreFailed");
		}
	}
}
