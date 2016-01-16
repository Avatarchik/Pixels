using UnityEngine;
using System.Collections;
using System;

public class IAPButton : MonoBehaviour {

	public IAPManager manager;

	public String unlockName;
	public Boolean cancel;
	public Boolean restore;
	public Boolean unlock;

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	void Clicked () {
		if(cancel)
		{
			manager.Cancel();
		}
		else if(restore)
		{
			manager.RestorePurchases(unlockName);
		}
		else if(unlock)
		{
			manager.RequestIAP(unlockName);
		}
	}
}
