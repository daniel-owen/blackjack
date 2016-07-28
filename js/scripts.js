// to do: center message box, set background to green
// fix case where player hits and checkWin runs too early
// fix case where player can be dealt a hand w/o betting
// have bank update on reset
// fix case where player can bet more than they have

// DONE ---- set messages after game over
// the table/game looks like rob made it; change this
// DONE ---- what about those stupid 11, 12, 13?
// what about aces? ------- FIX THIS
// the player can hit forever
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
var bank = 100;
var bet = 0;


$(document).ready(function(){

	$('.deal-button').click(function(){
		$('.deal-button').prop('disabled', true); // disable deal button
		$('.five-button, .ten-button, .twentyFive-button, .fifty-button').prop('disabled', true); // disable betting buttons
		createDeck(); // run a function that creates an array of 1h - 13c
		shuffleDeck(); // shuffle the deck

		// push the new card onto the player's hand array; then place it on the DOM
		playersHand.push(theDeck[0]);
		setTimeout(function(){
			placeCard('player', 'one', theDeck[0]);
		}, 250);
	
		// push the new card onto the dealers's hand array; then place it on the DOM
		dealersHand.push(theDeck[1]);
		setTimeout(function(){
			placeCard('dealer', 'one', theDeck[1]);
		}, 500);

		// push the new card onto the player's hand array; then place it on the DOM
		playersHand.push(theDeck[2]);
		setTimeout(function(){
			placeCard('player', 'two', theDeck[2]);
		}, 750);

		// push the new card onto the dealers's hand array; then place it on the DOM
		dealersHand.push(theDeck[3]);
		setTimeout(function(){
			placeCard('dealer', 'two', theDeck[3]);
		}, 1000);

		calculateTotal(playersHand, 'player'); // calculate total for player
		calculateTotal(dealersHand, 'dealer'); // calculate total for dealer
	});

	$('.hit-button').click(function(){
		var playerTotal = calculateTotal(playersHand, 'player');
		if (playerTotal < 21){
		var slotForNewCard = '';
			if (playersHand.length == 2){slotForNewCard = "three";}
			else if(playersHand.length == 3){slotForNewCard = "four";}
			else if(playersHand.length == 4){slotForNewCard = "five";}
			else if(playersHand.length == 5){slotForNewCard = "six";}

			setTimeout(function(){
				placeCard('player', slotForNewCard, theDeck[topOfTheDeck]);
				playersHand.push(theDeck[topOfTheDeck]);
				playerTotal = calculateTotal(playersHand, 'player');
				topOfTheDeck++;
			}, 250);
		}
	});

	$('.stand-button').click(function(){
		// player clicked on stand. what happens to the player? loses ability to hit, bet
		$('.hit-button').prop('disabled', true); // disable hit button
		$('.five-button, .ten-button, .twentyFive-button, .fifty-button').prop('disabled', true); // disable betting buttons
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
		playersHand = []; // empty the player's hand
		dealersHand = []; // empty the dealer's hand
		theDeck = []; // empty the deck
		topOfTheDeck = 5; // reset top of deck to 5
		$('.message-center').text(''); // reset win/loss/push message to empty string
		$('.card').text(''); // reset cards to blank
		$('.player-total-number').text('0'); // reset number in player total html
		$('.dealer-total-number').text('0'); // reset number in dealer total html
		// $('.bet-total').text('0'); // reset number in bet total html
		disableButtons(false); // re-enable all buttons for a new game
		$('.five-button, .ten-button, .twentyFive-button, .fifty-button').prop('disabled', false); // enable betting buttons
	});

	$('.five-button, .ten-button, .twentyFive-button, .fifty-button').click(function(){
		bank -= Number($(this).val()); // decrease bank by value of button
		$('.bank-total').text(bank); // update html of bank
		bet += Number($(this).val()); // increase bank by value of button
		$('.bet-total').text(bet); // update html of bank
	});

});

function checkWin(){
	// get player total
	var playerTotal = calculateTotal(playersHand, 'player');
	// get dealer total
	var dealerTotal = calculateTotal(dealersHand, 'dealer');
	// assign player outcome
	var playerOutcome = '';

	if (playerTotal > 21){ // player has busted
		playerOutcome = 'lose';
		$('.message-center').text('You busted. Dealer Wins!');
	}else if(dealerTotal > 21){ // dealer has busted
		playerOutcome = 'win';
		$('.message-center').text('Dealer busted. You Win!');
	}else{ // neither player has more than 21
		if((playerTotal == 21) && (playersHand.length == 2) && (playerTotal > dealerTotal)){ // player has blackjack; dealer does not
			playerOutcome = 'blackjack'
			$('.message-center').text('Blackjack! You Win!');
		}else if(playerTotal > dealerTotal){ // player has more than dealer
			playerOutcome = 'win';
			$('.message-center').text('You Win!');
		}else if(dealerTotal > playerTotal){ // dealer has more than player
			playerOutcome = 'lose';
			$('.message-center').text('Dealer Wins!');
		}else{
			playerOutcome = 'push';
			$('.message-center').text('Push');
		}
	}
	disableButtons(true);
	payout(playerOutcome, bet);
}

////////////////////////////////////////////
function placeCard(who, where, cardToPlace){
	var classSelector = '.'+who+'-cards .card-'+where;
	$(classSelector).html('<img src="images/'+cardToPlace+'.png">');
}
////////////////////////////////////////////

////////////////////////////////////////////
function createDeck(){
// fill the deck with: 52 cards; 13 cards for each of the 4 suits (h, s, d, c)
	var suits = ['h', 's', 'd', 'c'];
	for(var s = 0; s < suits.length; s++){
		for (var c = 1; c <= 13; c++){
			theDeck.push(c+suits[s]);
		}
	}
}
////////////////////////////////////////////

////////////////////////////////////////////
function shuffleDeck(){
// [1], [2], [3],...[50], [51], [52]
	for(var i = 0; i < 1000; i++){
		card1 = Math.floor(Math.random() * theDeck.length);
		card2 = Math.floor(Math.random() * theDeck.length);
		var temp = theDeck[card1];
		theDeck[card1] = theDeck[card2];
		theDeck[card2] = temp;
	}
}
////////////////////////////////////////////

////////////////////////////////////////////
function calculateTotal(hand, whosTurn){
	var hasAce = false;
	var cardValue = 0;
	var total = 0;
	for (var i = 0; i < hand.length; i++){
		cardValue = Number(hand[i].slice(0,-1));
		if ((cardValue == 1) && ((total + 11) <= 21)){
			cardValue = 11;
			hasAce = true;
		}else if (cardValue > 10){
			cardValue = 10;
		}else if ((cardValue + total > 21) && (hasAce)){
			total = total - 10;
			hasAce = false;
		}
		total += cardValue;
	}
	// update the html with the new total
	var elementToUpdate = '.'+whosTurn+'-total-number';
	$(elementToUpdate).text(total);
	return total;
}
////////////////////////////////////////////

////////////////////////////////////////////
function disableButtons(bool){
	$('.deal-button').prop('disabled', bool);
	$('.hit-button').prop('disabled', bool);
	$('.stand-button').prop('disabled', bool);
}
////////////////////////////////////////////

function payout(playerOutcome, betAmount){
	if (playerOutcome == 'blackjack'){
		bank += betAmount + (betAmount * 1.5);
	}else if(playerOutcome == 'win'){
		bank += (betAmount * 2);
	}else if(playerOutcome == 'push'){
		bank += betAmount;
	}
	$('.bank-total').text(bank); // update html of bank
	$('.bet-total').text('0'); // reset number in bet total html
	bet = 0;
}