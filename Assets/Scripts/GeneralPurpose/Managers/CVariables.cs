using UnityEngine;
using System.Collections;

public class CVariables : MonoBehaviour {

	static string unlockSongOnePrice;
	static string unlockSongTwoPrice;
	static string unlockSavingPrice;

	// Use this for initialization
	void Start () {
		StartCoroutine(StartPrices());
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	static IEnumerator StartPrices () {

		yield return new WaitForSeconds(1f);
		IOSInAppPurchaseManager.instance.LoadStore();
		yield return new WaitForSeconds(.2f);
		int counter = 0;
		while((unlockSavingPrice == null || unlockSavingPrice == "" || unlockSongOnePrice == null || unlockSongOnePrice == "" || unlockSongTwoPrice == null || unlockSongTwoPrice == ""))
		{
			string icon = IOSInAppPurchaseManager.Instance.GetProductById("com.turner.peterpanic.unlocksaving").CurrencySymbol;
			string priceString = IOSInAppPurchaseManager.Instance.GetProductById("com.turner.peterpanic.unlocksaving").LocalizedPrice;
			unlockSavingPrice = " " + icon + priceString.Substring(0,priceString.Length-1);

			icon = IOSInAppPurchaseManager.Instance.GetProductById("com.turner.peterpanic.unlockdollarsongone").CurrencySymbol;
			priceString = IOSInAppPurchaseManager.Instance.GetProductById("com.turner.peterpanic.unlockdollarsongone").LocalizedPrice;
			unlockSongOnePrice = " " + icon + priceString.Substring(0,priceString.Length-1);

			icon = IOSInAppPurchaseManager.Instance.GetProductById("com.turner.peterpanic.unlockdollarsongtwo").CurrencySymbol;
			priceString = IOSInAppPurchaseManager.Instance.GetProductById("com.turner.peterpanic.unlockdollarsongtwo").LocalizedPrice;
			unlockSongTwoPrice = " " + icon + priceString.Substring(0,priceString.Length-1);
			counter ++;
			yield return new WaitForSeconds(5f);
		}

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
}
