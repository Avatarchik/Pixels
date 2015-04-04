#pragma strict

var currency:int;

var coinSprites:Sprite[];

var coin:SpriteRenderer;

private var animating:boolean;

function Start () {
	animating = false;
	currency = PlayerPrefs.GetInt("CurrencyNumber");
	StartCoroutine(CurrencyCounting());
}

function CurrencyCounting(){
	while(true)
	{
		if(currency < PlayerPrefs.GetInt("CurrencyNumber"))
		{
			currency++;
			if(!animating)
			{
				CoinAnimate();
			}
			yield WaitForSeconds(.1);
		}
		else if(currency > PlayerPrefs.GetInt("CurrencyNumber"))
		{
			currency--;
			yield WaitForSeconds(.01);
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