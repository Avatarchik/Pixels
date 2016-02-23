//using UnityEngine;
//using System.Collections;
//using System.Collections.Generic;
//using CodeStage.AntiCheat.ObscuredTypes;
//using TMPro;
//using UnityEngine.Analytics;
//​
//public class UnlockManager : MonoBehaviour {
//	​
//	public List<tk2dSprite> greyWhenLocked;
//	public List<GameObject> disableWhenLocked;
//	public List<GameObject> enableWhenLocked;
//	public List<Transform> nudgeXWhenLocked;
//	public List<Button> buttonsToDisableWhenLocked;
//	public TextMeshPro cost;
//	public TextMeshPro restoreButtonText;
//	public Button restoreButton;
//	​
//	public ServerContactIdle idler;
//	​
//	public List<GameObject> moveDownWhenLocked;
//	​
//	public SiegeManager manager;
//	​
//	public const string FUNLOCK =  "Fsk37ip4GUQQA";
//	private bool setup = false;
//	private bool ready = false;
//	​
//	// Use this for initialization
//	public void init () {
//		setup = false;
//		ready = false;
//		​
//		if(!manager.gameStarted)
//		{
//			foreach(tk2dSprite sprite in greyWhenLocked)
//				sprite.color = new Color(0.768f,0.768f,0.768f);
//			​
//			foreach(GameObject o in disableWhenLocked)
//				o.SetActive(false);
//			​
//			foreach(GameObject o in enableWhenLocked)
//				o.SetActive(true);
//			​
//			foreach(Transform p in nudgeXWhenLocked)
//			{
//				if(Platforms.platform == Platform.iPad || Platforms.platform == Platform.iPadRetina)
//					p.localPosition = p.localPosition.MoveXTo(5.22f);
//				else
//					p.localPosition = p.localPosition.MoveXTo(5.57f);
//				​
//				Debug.Log(p.localPosition.x);
//			}
//			​
//			foreach(Button b in buttonsToDisableWhenLocked)
//				b.enabled = false;
//			​
//			foreach(GameObject o in moveDownWhenLocked)
//				o.transform.localPosition = o.transform.localPosition.AddYTo(-2);
//			​
//			setup = true;
//		}
//		​
//		IOSInAppPurchaseManager.Instance.addProductId(FUNLOCK);
//		IOSInAppPurchaseManager.OnStoreKitInitComplete += OnStoreKitInitComplete;
//		IOSInAppPurchaseManager.OnTransactionComplete += OnTransactionComplete;
//		IOSInAppPurchaseManager.OnVerificationComplete += OnVerificationComplete;
//		IOSInAppPurchaseManager.OnRestoreComplete += OnRestoreComplete;
//		​
//		IOSInAppPurchaseManager.Instance.loadStore();
//	}
//	​
//	private void OnStoreKitInitComplete (ISN_Result result) {
//		IOSInAppPurchaseManager.OnStoreKitInitComplete -= OnStoreKitInitComplete;
//		IOSProductTemplate t = IOSInAppPurchaseManager.Instance.GetProductById(FUNLOCK);
//		if(t!=null)
//		{
//			string localizedPrice = t.localizedPrice;
//			int index = localizedPrice.IndexOf(t.currencySymbol);
//			string cleanPrice = (index < 0) ? localizedPrice : localizedPrice.Remove(index, t.currencySymbol.Length);
//			cost.text = "Unlock The Full Game For <#94B77B>"+cleanPrice;
//			​
//			/*Debug.Log("id" + t.id);
//			Debug.Log("title" + t.title);
//			Debug.Log("description" + t.description);
//			Debug.Log("price" + t.price);
//			Debug.Log("localizedPrice" + t.localizedPrice);
//			Debug.Log("currencySymbol" + t.currencySymbol);
//			Debug.Log("currencyCode" + t.currencyCode);
//			Debug.Log("-------------");*/
//			​
//			//Debug.Log(localizedPrice);
//			​
//			ready = true;
//		}
//		/*if(result.IsSucceeded) {
//			Debug.Log("Inited successfully, Avaliable products found: " + IOSInAppPurchaseManager.instance.products.Count.ToString());
//		} else {
//			Debug.Log("StoreKit Init Failed.  Error code: " + result.error.code + "\n" + "Error description:" + result.error.description);
//		}*/
//	}
//	​
//	private void OnRestoreComplete (IOSStoreKitRestoreResult response)
//	{
//		if(response.IsSucceeded)
//		{
//			IOSInAppPurchaseManager.Instance.VerifyLastPurchase(IOSInAppPurchaseManager.APPLE_VERIFICATION_SERVER); //change for release
//		}
//		else if(response.IsFailed)
//		{
//			IOSNativePopUpManager.showMessage("Restore failed :(", response.Error.Description);
//			idler.hide();
//		}
//	}
//	​
//	private void OnTransactionComplete (IOSStoreKitResult responce) {
//		
//		//Debug.Log("OnTransactionComplete: " + responce.productIdentifier);
//		//Debug.Log("OnTransactionComplete: state: " + responce.state);
//		restoreButtonText.text = "Restore Purchases";
//		restoreButton.enabled = true;
//		
//		switch(responce.State) {
//		case InAppPurchaseState.Purchased:
//		{
//			Debug.Log("purchased");
//			IOSInAppPurchaseManager.Instance.VerifyLastPurchase(IOSInAppPurchaseManager.APPLE_VERIFICATION_SERVER); //change for release
//			break;
//		}
//		case InAppPurchaseState.Restored:
//		{
//			Debug.Log("restored");
//			//Our product been succsesly purchased or restored
//			//So we need to provide content to our user 
//			//depends on productIdentifier
//			IOSInAppPurchaseManager.Instance.VerifyLastPurchase(IOSInAppPurchaseManager.APPLE_VERIFICATION_SERVER); //change for release	
//			break;
//		}
//		case InAppPurchaseState.Deferred:
//		{
//			//iOS 8 introduces Ask to Buy, which lets 
//			//parents approve any purchases initiated by children
//			//You should update your UI to reflect this 
//			//deferred state, and expect another Transaction 
//			//Complete  to be called again with a new transaction state 
//			//reflecting the parent's decision or after the 
//			//transaction times out. Avoid blocking your UI 
//			//or gameplay while waiting for the transaction to be updated.
//			IOSNativePopUpManager.showMessage("","Request sent!");
//			idler.hide();
//			break;
//		}
//		case InAppPurchaseState.Failed:
//		{
//			IOSNativePopUpManager.showMessage("Transaction failed :(", responce.Error.Description);
//			idler.hide();
//			//Our purchase flow is failed.
//			//We can unlock interface and report user that the purchase is failed. 
//			//Debug.Log("Transaction failed with error, code: " + responce.error.code);
//			//Debug.Log("Transaction failed with error, description: " + responce.error.description);
//			break;
//		}
//		default:
//			break;
//		}
//		
//		//IOSNativePopUpManager.showMessage("Store Kit Response", "product " + responce.productIdentifier + " state: " + responce.state.ToString());
//	}
//	​
//	void OnVerificationComplete (IOSStoreKitVerificationResponse response) {
//		​
//		if(response.status == 0) {
//			Debug.Log("Transaction is valid");
//			if(response.productIdentifier == FUNLOCK)
//				unlockContent();
//		}
//		else if(response.status == 21005)
//		{
//			IOSNativePopUpManager.showMessage("The receipt server is not currently available.", "Please try again later");
//			idler.hide();
//			//The receipt server is not currently available.
//		}
//		else if(response.status == 21007)
//		{
//			idler.hide();
//			Debug.Log("This receipt is from the test environment, but it was sent to the production environment for verification. Send it to the test environment instead.");
//		}
//		else if(response.status == 21008)
//		{
//			idler.hide();
//			Debug.Log("This receipt is from the production environment, but it was sent to the test environment for verification. Send it to the production environment instead.");
//		}
//	}
//	​
//	void unlockContent()
//	{
//		​
//		IDictionary<string, object> d = new Dictionary<string, object>();
//		Analytics.CustomEvent("PurchasedGame",d);
//		​
//		if(setup)
//		{
//			setup = false;
//			foreach(tk2dSprite sprite in greyWhenLocked)
//				sprite.color = Color.white;
//			
//			foreach(GameObject o in disableWhenLocked)
//				o.SetActive(true);
//			
//			foreach(GameObject o in enableWhenLocked)
//				o.SetActive(false);
//			
//			foreach(Transform p in nudgeXWhenLocked)
//			{
//				if(Platforms.platform == Platform.iPad || Platforms.platform == Platform.iPadRetina)
//					p.localPosition = p.localPosition.MoveXTo(4.17f);
//				else
//					p.localPosition = p.localPosition.MoveXTo(4.52f);
//			}
//			​
//			foreach(Button b in buttonsToDisableWhenLocked)
//				b.enabled = true;
//			​
//			foreach(GameObject o in moveDownWhenLocked)
//				o.transform.localPosition = o.transform.localPosition.AddYTo(2);
//			​
//			manager.gameStarted = true;
//			manager.enableGamecenterButtons();
//			ObscuredPrefs.SetInt("gameStarted", 1);
//			ObscuredPrefs.Save();
//			​
//			IOSNativePopUpManager.showMessage("Thanks so much for your support!", "I hope you enjoy the game :)");
//			​
//			idler.hide();
//		}
//	}
//	​
//	void showUnlockScreen()
//	{
//		//do all the unlock stuff
//		if(setup)
//		{
//			if(ready)
//			{
//				buyContent();
//				idler.show();
//			}
//		}
//	}
//	​
//	void restoreContent()
//	{
//		if(setup)
//		{
//			idler.show();
//			restoreButtonText.text = "Restoring...";
//			restoreButton.enabled = false;
//			IOSInAppPurchaseManager.Instance.restorePurchases();
//		}
//	}
//	​
//	void buyContent()
//	{
//		IOSInAppPurchaseManager.Instance.buyProduct(FUNLOCK);
//	}
//}