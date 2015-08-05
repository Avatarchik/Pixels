#pragma strict

var highlight:SpriteRenderer;

// All of the possible pieces and representative sprites to be loaded.
var theaterPieces:String[];
var FOHPieces:String[];
var theaterPiecesSprites:Sprite[];
var FOHPiecesSprites:Sprite[];
var theaterHighlights:Sprite[];
var FOHHighlights:Sprite[];
var theaterLocations:Vector3[];
var FOHLocations:Vector3[];

// Constantly updated list of Sprites and names that could possibly be selected based on camera location.
var selectablePieces:String[];
var selectableSprites:Sprite[];
var selectableHighlights:Sprite[];
var selectableLocations:Vector3[];

// The currently selected piece.
var currentSelected:int;

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
	if(TheaterController.currentState == TheaterStatus.Home)
	{
		selectablePieces = theaterPieces;
		selectableSprites = theaterPiecesSprites;
		selectableHighlights = theaterHighlights;
		selectableLocations = theaterLocations;
	}
	else
	{
		selectablePieces = FOHPieces;
		selectableSprites = FOHPiecesSprites;
		selectableHighlights = FOHHighlights;
		selectableLocations = FOHLocations;
	}
	if(!TheaterController.customizing)
	{
		selectableHighlights = null;
	}
	if(currentSelected >= selectablePieces.Length)
	{
		currentSelected = 0;
	}
	pieceName = selectablePieces[currentSelected];
	pieceSprite = selectableSprites[currentSelected];
	
	if(selectableHighlights != null)
	{
		highlight.sprite = selectableHighlights[currentSelected];
	}
	else
	{
		highlight.sprite = null;
	}
	highlight.transform.localPosition = selectableLocations[currentSelected];
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