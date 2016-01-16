#pragma strict

import CodeStage.AntiCheat.ObscuredTypes;

@HideInInspector var currency:int;

var coinSprites:Sprite[];

var coin:SpriteRenderer;

private var animating:boolean;

var coinSound:AudioClip;

function Start () {
	animating = false;
	currency = ObscuredPrefs.GetInt("CurrencyNumber");
	StartCoroutine(CurrencyCounting());
}

function CurrencyCounting(){
	while(true)
	{
		if(currency < ObscuredPrefs.GetInt("CurrencyNumber"))
		{
			currency++;
			AudioManager.PlaySound(coinSound,.1);
			if(!animating)
			{
				CoinAnimate();
			}
			//yield WaitForSeconds(.1);
		}
		else if(currency > ObscuredPrefs.GetInt("CurrencyNumber"))
		{
			currency = Mathf.MoveTowards(currency,ObscuredPrefs.GetInt("CurrencyNumber"),3);
		}
		if(GetComponent(TextMesh)!=null)
		{
			GetComponent(TextMesh).text = currency.ToString();
		}
		yield;
	}
	yield;
}

function CoinAnimate () {
	animating = true;
	var placeholder:int = 1;
	while(placeholder != 0)
	{
		yield WaitForSeconds(.02);
		coin.sprite = coinSprites[placeholder];
		if(placeholder + 1 < coinSprites.Length)
		{
			placeholder++;
		}
		else
		{
			placeholder = 0;
		}
	}
	yield WaitForSeconds(.02);
	coin.sprite = coinSprites[placeholder];
	animating = false;
	
}