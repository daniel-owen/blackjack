// to do: center message box, set background to green
// after deal button has been clicked, disable it until reset button is pressed
// fix case where player hits and

// DONE ---- set messages after game over
// the table/game looks like rob made it; change this
// DONE ---- what about those stupid 11, 12, 13?
// DONE ---- what about aces?
// DONE ---- the player can hit forever
// there is no win counter/bet system
// DONE ---- there is no deck to draw from
// the cards aren't red or black like they could or should be
// the cards are lame. find images
// there is no delay on showing the cards...it's instant
// you can see the dealers 2nd card on deal. that's unfair to the house


// 1. when the user clicks deal, deal.
var theDeck = [];
var playersHand = [];
var dealersHand = [];
var topOfTheDeck = 5;

$(document).ready(function(){

	$('.deal-button').click(function(){
		createDeck(); // run a function that creates an array of 1h - 13c
		shuffleDeck();

		// push the new card onto the player's hand array; then place it on the DOM
		playersHand.push(theDeck[0]);
		placeCard('player', 'one', theDeck[0]);

		dealersHand.push(theDeck[1]);
		placeCard('dealer', 'one', theDeck[1]);

		playersHand.push(theDeck[2]);
		placeCard('player', 'two', theDeck[2]);

		dealersHand.push(theDeck[3]);
		placeCard('dealer', 'two', theDeck[3]);

		calculateTotal(playersHand, 'player');
		calculateTotal(dealersHand, 'dealer');
	});

	$('.hit-button').click(function(){
		var slotForNewCard = '';
		if (playersHand.length == 2){slotForNewCard = "three";}
		else if(playersHand.length == 3){slotForNewCard = "four";}
		else if(playersHand.length == 4){slotForNewCard = "five";}
		else if(playersHand.length == 5){slotForNewCard = "six";}
		placeCard('player', slotForNewCard, theDeck[topOfTheDeck]);
		playersHand.push(theDeck[topOfTheDeck]);
		calculateTotal(playersHand, 'player');
		topOfTheDeck++;
		checkWin();
	});

	$('.stand-button').click(function(){
		// player clicked on stand. what happends to the player? nothing.
		var slotForNewCard = '';
		var dealerTotal = calculateTotal(dealersHand, 'dealer');
		while(dealerTotal < 17){
			// dealer has less than 17. hit away!
			if (dealersHand.length == 2){slotForNewCard = "three";}
			else if (dealersHand.length == 3){slotForNewCard = "four";}
			else if (dealersHand.length == 4){slotForNewCard = "five";}
			else if (dealersHand.length == 5){slotForNewCard = "six";}
			placeCard('dealer', slotForNewCard, theDeck[topOfTheDeck]);
			dealersHand.push(theDeck[topOfTheDeck]);
			dealerTotal = calculateTotal(dealersHand, 'dealer');
			topOfTheDeck++;
		}
		// dealer has at least 17. check to see who won
		checkWin();
	});

	$('.reset-button').click(function(){
		playersHand = []; // empty the players hand
		dealersHand = []; // empty the dealers hand
		theDeck = []; // empty the deck
		topOfTheDeck = 5; // reset top of deck to 5
		$('.message-center').text(''); // reset win/loss/push message to an empty string
		$('.card').text(''); // reset cards to blank
		$('.player-total-number').text('0'); // reset number in player total html
		$('.dealer-total-number').text('0'); // reset number in dealer total html
		disableButtons(false);
	});

});

function checkWin(){
	// get player total
	var playerTotal = calculateTotal(playersHand, 'player');
	// get dealer total
	var dealerTotal = calculateTotal(dealersHand, 'dealer');

	if (playerTotal > 21){ // player has busted
		// set a message somewhere that says this
		$('.message-center').text('You busted. Dealer Wins!');
	}else if(dealerTotal > 21){ // dealer has busted
		// set a message somewhere that says this
		$('.message-center').text('Dealer busted. You Win!');
	}else{ // neither player has more than 21
		if (playerTotal > dealerTotal){
			// player won. say this somewhere
			$('.message-center').text('You Win!');
		}else if (dealerTotal > playerTotal){
			// dealer won. say this somewhere
			$('.message-center').text('Dealer Wins!');
		}else{
			// push (tie). say this somewhere
			$('.message-center').text('Push');
		}
	}
	disableButtons(true);
}

function placeCard(who, where, cardToPlace){
	var classSelector = '.'+who+'-cards .card-'+where;

	// write logic to fix the 11, 12, 13 issue

	$(classSelector).html(cardToPlace);
}

function createDeck(){
// fill the deck with 
// - 52 cards
// - 4 suits
// 	- h, s, d, c
	var suits = ['h', 's', 'd', 'c'];
	for(var s = 0; s < suits.length; s++){
		for (var c = 1; c <= 13; c++){
			theDeck.push(c+suits[s]);
		}
	}
}

function shuffleDeck(){
// [1]
// [2]
// [3]
// ...
// [50]
// [51]
// [52]
	for(var i = 0; i < 1000; i++){
		card1 = Math.floor(Math.random() * theDeck.length);
		card2 = Math.floor(Math.random() * theDeck.length);
		var temp = theDeck[card1];
		theDeck[card1] = theDeck[card2];
		theDeck[card2] = temp;
	}
}

function calculateTotal(hand, whosTurn){
	// console.log(hand);
	// console.log(whosTurn);
	var cardValue = 0;
	var total = 0;
	for (var i = 0; i < hand.length; i++){
		cardValue = Number(hand[i].slice(0,-1));	
		if (cardValue > 10){
			cardValue = 10;
		}else if(cardValue == 1 && total < 11){
			cardValue = 11;
		}else if(cardValue == 1 && total > 10){
			cardValue = 1;
		}
		total += cardValue;
	}
	// update the html with the new total
	var elementToUpdate = '.'+whosTurn+'-total-number';
	$(elementToUpdate).text(total);
	return total;
}

function disableButtons(TF){
	$('.deal-button').prop('disabled', TF);
	$('.hit-button').prop('disabled', TF);
	$('.stand-button').prop('disabled', TF);
}