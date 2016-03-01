using UnityEngine;
using System.Collections;

public class CVariables : MonoBehaviour {

	static string unlockSongOnePrice;
	static string unlockSongTwoPrice;
	static string unlockSavingPrice;

	public const string unlockSongOneID = "com.turner.peterpanic.unlockdollarsongone";
	public const string unlockSongTwoID = "com.turner.peterpanic.unlockdollarsongtwo";
	public const string unlockSavingID = "com.turner.peterpanic.unlocksaving";

	public static bool done;


	// Use this for initialization
	public void Start () {
		if(!PlayerPrefs.HasKey("UnlockSongOnePrice"))
		{
			PlayerPrefs.SetString("UnlockSongOnePrice","");
		}
		if(!PlayerPrefs.HasKey("UnlockSongTwoPrice"))
		{
			PlayerPrefs.SetString("UnlockSongTwoPrice","");
		}
		if(!PlayerPrefs.HasKey("UnlockSavingPrice"))
		{
			PlayerPrefs.SetString("UnlockSavingPrice","");
		}
		if(PlayerPrefs.GetString("UnlockSongOnePrice") != "" && PlayerPrefs.GetString("UnlockSongTwoPrice") != "" && PlayerPrefs.GetString("UnlockSavingPrice") != "")
		{
			done = true;
		}
		else
		{
			done = false;
		}
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
		float waitTime = 2;
		IOSInAppPurchaseManager.OnStoreKitInitComplete += OnStoreKitInitComplete;
		IOSInAppPurchaseManager.OnTransactionComplete += OnTransactionComplete;
		while(!done)
		{
			IOSInAppPurchaseManager.instance.LoadStore();
			yield return new WaitForSeconds(waitTime);
			waitTime = Mathf.MoveTowards(waitTime,5f,.5f);
		}
	}

	public static string GetPrices (string productID) {
		
		if(productID == "com.turner.peterpanic.unlocksaving")
		{
			return PlayerPrefs.GetString("UnlockSavingPrice");
		}
		else if(productID == "com.turner.peterpanic.unlockdollarsongone")
		{
			return PlayerPrefs.GetString("UnlockSongOnePrice");
		}
		else if(productID == "com.turner.peterpanic.unlockdollarsongtwo")
		{
			return PlayerPrefs.GetString("UnlockSongTwoPrice");
		}
		else
		{
			return unlockSavingPrice;
		}
	}

	private void OnStoreKitInitComplete (ISN_Result result) {
		if(result.IsSucceeded)
		{
			done = true;
			IOSInAppPurchaseManager.OnStoreKitInitComplete -= OnStoreKitInitComplete;
			IOSProductTemplate t = IOSInAppPurchaseManager.Instance.GetProductById(unlockSongOneID);
			if(t!=null)
			{
				string localizedPrice = t.LocalizedPrice;
				int index = localizedPrice.IndexOf(t.CurrencySymbol);
				string cleanPrice = (index < 0) ? localizedPrice : localizedPrice.Remove(index, t.CurrencySymbol.Length);
//				Debug.Log("id" + t.Id);
//				Debug.Log("title" + t.DisplayName);
//				Debug.Log("description" + t.Description);
//				Debug.Log("price" + t.Price);
//				Debug.Log("localizedPrice" + t.LocalizedPrice);
//				Debug.Log("currencySymbol" + t.CurrencySymbol);
//				Debug.Log("currencyCode" + t.CurrencyCode);
//				Debug.Log("-------------");
//				Debug.Log(localizedPrice);
				unlockSongOnePrice = t.LocalizedPrice;
				if(t.LocalizedPrice != "0.99 $" )
				{
					PlayerPrefs.SetString("UnlockSongOnePrice",t.LocalizedPrice);
				}
			}
			IOSProductTemplate u = IOSInAppPurchaseManager.Instance.GetProductById(unlockSongTwoID);
			if(u!=null)
			{
				string localizedPrice = u.LocalizedPrice;
				int index = localizedPrice.IndexOf(u.CurrencySymbol);
				string cleanPrice = (index < 0) ? localizedPrice : localizedPrice.Remove(index, u.CurrencySymbol.Length);
//				Debug.Log("id" + u.Id);
//				Debug.Log("title" + u.DisplayName);
//				Debug.Log("description" + u.Description);
//				Debug.Log("price" + u.Price);
//				Debug.Log("localizedPrice" + u.LocalizedPrice);
//				Debug.Log("currencySymbol" + u.CurrencySymbol);
//				Debug.Log("currencyCode" + u.CurrencyCode);
//				Debug.Log("-------------");
//				Debug.Log(localizedPrice);
				unlockSongTwoPrice = u.LocalizedPrice;
				if(u.LocalizedPrice != "0.99 $")
				{
					PlayerPrefs.SetString("UnlockSongTwoPrice",u.LocalizedPrice);
				}
			}
			IOSProductTemplate v = IOSInAppPurchaseManager.Instance.GetProductById(unlockSavingID);
			if(v!=null)
			{
				string localizedPrice = v.LocalizedPrice;
				int index = localizedPrice.IndexOf(v.CurrencySymbol);
				string cleanPrice = (index < 0) ? localizedPrice : localizedPrice.Remove(index, v.CurrencySymbol.Length);
//				Debug.Log("id" + v.Id);
//				Debug.Log("title" + v.DisplayName);
//				Debug.Log("description" + v.Description);
//				Debug.Log("price" + t.Price);
//				Debug.Log("localizedPrice" + v.LocalizedPrice);
//				Debug.Log("currencySymbol" + v.CurrencySymbol);
//				Debug.Log("currencyCode" + v.CurrencyCode);
//				Debug.Log("-------------");
//				Debug.Log(localizedPrice);
				unlockSavingPrice = v.LocalizedPrice;
				if(v.LocalizedPrice != "0.99 $")
				{
					PlayerPrefs.SetString("UnlockSavingPrice",v.LocalizedPrice);
				}
			}
		}
		else
		{

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
