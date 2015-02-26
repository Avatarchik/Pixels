#pragma strict

// All of the possible pieces and representative sprites to be loaded.
var theaterPieces:String[];
var FOHPieces:String[];
var theaterPiecesSprites:Sprite[];
var FOHPiecesSprites:Sprite[];

// Constantly updated list of Sprites and names that could possibly be selected based on camera location.
var selectablePieces:String[];
var selectableSprites:Sprite[];

// The currently selected piece.
private var currentSelected:int;

// The publicly accessible name and sprite of the piece that is currently selected.
static var pieceName:String;
static var pieceSprite:Sprite;

function Start () {
	// Sets the initial pieces, selection.
	currentSelected = 0;
	selectablePieces = theaterPieces;
	selectableSprites = theaterPiecesSprites;
}

function Update () {
	// Makes sure selection number is in range of selectable pieces.
	CheckValue();
	if(TheaterController.currentState == TheaterStatus.HomeLedger || TheaterController.currentState == TheaterStatus.Home)
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
	// Changes currently selected piece and checks availability.
	currentSelected += change;
	CheckValue();
}

function CheckValue () {
	// Makes sure selection number is in range of selectable pieces.
	if(currentSelected >= selectablePieces.Length)
	{
		currentSelected = 0;
	}
	if(currentSelected<0)
	{
		currentSelected = selectablePieces.Length -1;
	}
}