using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class SetPrice : MonoBehaviour {
	
	public string productID;
	// Use this for initialization
	void Start () {
		DoStuff ();
	}

	// Update is called once per frame
	void Update () {
	}

	void DoStuff () {
		string localizedPrice = CVariables.GetPrices(productID);
		if(GetComponent<TextMesh>() != null)
		{
			GetComponent<TextMesh>().text = localizedPrice;
		}
	}

	private static void OnStoreKitInitComplete (ISN_Result result) {
		IOSInAppPurchaseManager.OnStoreKitInitComplete -= OnStoreKitInitComplete;
		
		if(result.IsSucceeded) 
		{
			Debug.Log("Inited successfully, Available products count: " + IOSInAppPurchaseManager.Instance.Products.Count.ToString());
		} 
		else 
		{
			Debug.Log("StoreKit Init Failed.  Error code: " + result.Error.Code + "\n" + "Error description:" + result.Error.Description);
		}
	}
}
