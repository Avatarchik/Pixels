using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class SetPrice : MonoBehaviour {

	public string productID;
	// Use this for initialization
	void Start () {
		IOSInAppPurchaseManager.instance.LoadStore();
		StartCoroutine(DoStuff());
	}

	// Update is called once per frame
	void Update () {
	}

	IEnumerator DoStuff () {
		yield return new WaitForSeconds(.2f);
		string localizedPrice = IOSInAppPurchaseManager.Instance.GetProductById(productID).LocalizedPrice;
		string icon = IOSInAppPurchaseManager.Instance.GetProductById(productID).CurrencySymbol;
		if(GetComponent<TextMesh>() != null)
		{
			GetComponent<TextMesh>().text = " " + icon + localizedPrice.Substring(0,localizedPrice.Length-1);
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
