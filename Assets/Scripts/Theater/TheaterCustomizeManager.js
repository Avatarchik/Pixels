#pragma strict

var theaterPieces:String[];
var FOHPieces:String[];
var theaterPiecesSprites:Sprite[];
var FOHPiecesSprites:Sprite[];

var selectablePieces:String[];
var selectableSprites:Sprite[];

private var currentSelected:int;

static var pieceName:String;

static var pieceSprite:Sprite;

function Start () {
	currentSelected = 0;
	if(TheaterController.currentState == TheaterStatus.HomeLedger)
	{
		selectablePieces = theaterPieces;
		selectableSprites = theaterPiecesSprites;
	}
	else
	{
		selectablePieces = FOHPieces;
		selectableSprites = FOHPiecesSprites;
	}
}

function Update () {
	CheckValue();
	if(TheaterController.currentState == TheaterStatus.HomeLedger)
	{
		selectablePieces = theaterPieces;
		selectableSprites = theaterPiecesSprites;
	}
	else
	{
		selectablePieces = FOHPieces;
		selectableSprites = FOHPiecesSprites;
	}
	pieceName = selectablePieces[currentSelected];
	pieceSprite = selectableSprites[currentSelected];
}

function PieceChange (change:int) {
	currentSelected += change;
	CheckValue();
}

function CheckValue () {
	if(currentSelected >= selectablePieces.Length)
	{
		currentSelected = 0;
	}
	if(currentSelected<0)
	{
		currentSelected = selectablePieces.Length -1;
	}
}