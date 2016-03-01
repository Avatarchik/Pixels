using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class SetPrice : MonoBehaviour {
	
	public string productID;

	// Use this for initialization
	void Start () {
		StartCoroutine(DoStuff ());
	}

	// Update is called once per frame
	void Update () {
	}

	public IEnumerator DoStuff () {
		while(!CVariables.done)
		{
			yield return new WaitForEndOfFrame();
		}
		yield return new WaitForSeconds(0f);
		string localizedPrice = CVariables.GetPrices(productID);
		if(GetComponent<TextMesh>() != null)
		{
			GetComponent<TextMesh>().text = localizedPrice;
		}
		if(localizedPrice == "0.99 $")
		{
			GetComponent<TextMesh>().text = "";
		}
	}
}
