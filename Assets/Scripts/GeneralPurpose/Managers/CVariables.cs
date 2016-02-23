using UnityEngine;
using System.Collections;

public class CVariables : MonoBehaviour {

	static string unlockSongOnePrice;
	static string unlockSongTwoPrice;
	static string unlockSavingPrice;

	public const string unlockSongOneID = "com.turner.peterpanic.unlockdollarsongone";
	public const string unlockSongTwoID = "com.turner.peterpanic.unlockdollarsongtwo";
	public const string unlockSavingID = "com.turner.peterpanic.unlocksaving";


	// Use this for initialization
	void Start () {
		IOSInAppPurchaseManager.instance.AddProductId(unlockSongOneID);
		IOSInAppPurchaseManager.instance.AddProductId(unlockSongTwoID);
		IOSInAppPurchaseManager.instance.AddProductId(unlockSavingID);
		StartCoroutine(StartPrices());
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public IEnumerator StartPrices () {
		yield return new WaitForSeconds(1f);
		IOSInAppPurchaseManager.OnStoreKitInitComplete += OnStoreKitInitComplete;
		IOSInAppPurchaseManager.OnTransactionComplete += OnTransactionComplete;
		IOSInAppPurchaseManager.instance.LoadStore();
	}

	public static string GetPrices (string productID) {
		
		if(productID == "com.turner.peterpanic.unlocksaving")
		{
			return unlockSavingPrice;
		}
		else if(productID == "com.turner.peterpanic.unlockdollarsongone")
		{
			return unlockSongOnePrice;
		}
		else if(productID == "com.turner.peterpanic.unlockdollarsongtwo")
		{
			return unlockSongTwoPrice;
		}
		else
		{
			return unlockSavingPrice;
		}
	}

	private void OnStoreKitInitComplete (ISN_Result result) {
		IOSInAppPurchaseManager.OnStoreKitInitComplete -= OnStoreKitInitComplete;
		IOSProductTemplate t = IOSInAppPurchaseManager.Instance.GetProductById(unlockSongOneID);
		if(t!=null)
		{
			string localizedPrice = t.LocalizedPrice;
			int index = localizedPrice.IndexOf(t.CurrencySymbol);
			string cleanPrice = (index < 0) ? localizedPrice : localizedPrice.Remove(index, t.CurrencySymbol.Length);
			Debug.Log("id" + t.Id);
			Debug.Log("title" + t.DisplayName);
			Debug.Log("description" + t.Description);
			Debug.Log("price" + t.Price);
			Debug.Log("localizedPrice" + t.LocalizedPrice);
			Debug.Log("currencySymbol" + t.CurrencySymbol);
			Debug.Log("currencyCode" + t.CurrencyCode);
			Debug.Log("-------------");
			Debug.Log(localizedPrice);
			unlockSongOnePrice = t.LocalizedPrice;
		}
		IOSProductTemplate u = IOSInAppPurchaseManager.Instance.GetProductById(unlockSongTwoID);
		if(t!=null)
		{
			string localizedPrice = u.LocalizedPrice;
			int index = localizedPrice.IndexOf(u.CurrencySymbol);
			string cleanPrice = (index < 0) ? localizedPrice : localizedPrice.Remove(index, u.CurrencySymbol.Length);
			Debug.Log("id" + u.Id);
			Debug.Log("title" + u.DisplayName);
			Debug.Log("description" + u.Description);
			Debug.Log("price" + u.Price);
			Debug.Log("localizedPrice" + u.LocalizedPrice);
			Debug.Log("currencySymbol" + u.CurrencySymbol);
			Debug.Log("currencyCode" + u.CurrencyCode);
			Debug.Log("-------------");
			Debug.Log(localizedPrice);
			unlockSongTwoPrice = u.LocalizedPrice;
		}
		IOSProductTemplate v = IOSInAppPurchaseManager.Instance.GetProductById(unlockSavingID);
		if(t!=null)
		{
			string localizedPrice = v.LocalizedPrice;
			int index = localizedPrice.IndexOf(v.CurrencySymbol);
			string cleanPrice = (index < 0) ? localizedPrice : localizedPrice.Remove(index, v.CurrencySymbol.Length);
			Debug.Log("id" + v.Id);
			Debug.Log("title" + v.DisplayName);
			Debug.Log("description" + v.Description);
			Debug.Log("price" + t.Price);
			Debug.Log("localizedPrice" + v.LocalizedPrice);
			Debug.Log("currencySymbol" + v.CurrencySymbol);
			Debug.Log("currencyCode" + v.CurrencyCode);
			Debug.Log("-------------");
			Debug.Log(localizedPrice);
			unlockSavingPrice = v.LocalizedPrice;
		}
	}

	private void OnTransactionComplete (IOSStoreKitResult responce) {
		switch(responce.State) {
		case InAppPurchaseState.Purchased:
		{
			IOSInAppPurchaseManager.Instance.VerifyLastPurchase(IOSInAppPurchaseManager.APPLE_VERIFICATION_SERVER); //change for release
			break;
		}
		case InAppPurchaseState.Restored:
		{
			IOSInAppPurchaseManager.Instance.VerifyLastPurchase(IOSInAppPurchaseManager.APPLE_VERIFICATION_SERVER); //change for release	
			break;
		}
		case InAppPurchaseState.Deferred:
		{
			IOSNativePopUpManager.showMessage("","Request sent!");
			break;
		}
		case InAppPurchaseState.Failed:
		{
			IOSNativePopUpManager.showMessage("Transaction failed :(", responce.Error.Description);
			break;
		}
		default:
			break;
		}	
	}
}
