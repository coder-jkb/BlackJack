folder = "cards/"
prefix = ["ace_of_",
          "2_of_",
          "3_of_",
          "4_of_",
          "5_of_",
          "6_of_",
          "7_of_",
          "8_of_",
          "9_of_",
          "10_of_",
          "jack_of_",
          "queen_of_",
          "king_of_"];

ext = '.png'

selected = []

player_total = 0; dealer_total = 0;

player_balance = "1000";

deck = {Heart:[],Spade:[],Club:[],Diamond:[]}

// deck of cards
for (let i = 0; i < 13; i++){

    deck.Heart[i] = { val: i + 1, img: folder + prefix[i] + "hearts" + ext};
    deck.Spade[i] = { val: i + 1, img: folder + prefix[i] + "spades" + ext };
    deck.Club[i] = { val: i + 1, img: folder + prefix[i] + "clubs" + ext };
    deck.Diamond[i] = { val: i + 1, img: folder + prefix[i] + "diamonds" + ext };
    if(i == 1){
        deck.Heart[0].val = 11;
        deck.Spade[0].val = 11;
        deck.Club[0].val = 11;
        deck.Diamond[0].val = 11;
    }
    if(i >= 9){
        deck.Heart[i].val = 10;
        deck.Spade[i].val = 10;
        deck.Club[i].val = 10;
        deck.Diamond[i].val = 10;
    }
    
}

function insertImage(card, parent) {
    let img = document.createElement("img");
    img.src = card.img;
    img.height = "150";
    img.style.padding = "5px";
    parent.appendChild(img);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function get_random_card(){
    suit = Object.keys(deck)[getRandomInt(0,3)];
    while (true){
      card = deck[suit][getRandomInt(0, 12)];
      if (!(selected.includes(card))){
        break;
      }
    }
    selected[selected.length] = card;
  
    return card
}

function distribute_cards(){
  player = document.getElementById("player-cards");
  dealer = document.getElementById("dealer-cards");
  player.innerHTML = ""
  dealer.innerHTML = ""
  document.getElementById("dealer").style.backgroundColor = "darkgreen";
  card1 = get_random_card();
  card2 = get_random_card();
  card3 = get_random_card();
  insertImage(card1, player);
  insertImage(card2, player);
  insertImage(card3, dealer);
  // player_cards = [card1, card2]
  // dealer_cards = [card3]
  player_total = card1.val + card2.val
  dealer_total = card3.val
  document.getElementById("player-total").textContent = player_total;
  document.getElementById("dealer-total").textContent = dealer_total;
  document.getElementById("balance-amt").textContent = player_balance;
  checkPlayerScore();
}

function hitPlayer() {
  player = document.getElementById('player-cards');
  card = get_random_card();
  insertImage(card, player);
  updatePlayer(card)
}

function missPlayer() {
  document.getElementById("player-hit").disabled = true;
  document.getElementById("player-miss").disabled = true;
  // document.getElementById("dealer-hit").disabled = false;
  document.getElementById("player").style.backgroundColor = "darkgreen";
  document.getElementById("dealer").style.backgroundColor = "green";
  document.getElementById("turn").textContent = "Dealer's turn";
  dealerPlays();
}

function hitDealer() {
  dealer = document.getElementById("dealer-cards");
  card = get_random_card();
  insertImage(card, dealer);
  updateDealer(card);  
}

function checkPlayerScore() {
  if (player_total == 21) {
    document.getElementById("player-hit").disabled = true;
    document.getElementById("player-miss").disabled = true;
    document.getElementById("player").style.backgroundColor = "darkgreen";
    document.getElementById("dealer").style.backgroundColor = "green";
    document.getElementById("turn").textContent = "Dealer's turn";
    dealerPlays();
  } else if (player_total > 21) {
    document.getElementById("player-hit").disabled = true;
    document.getElementById("player-miss").disabled = true;
    document.getElementById("player").style.backgroundColor = "darkgreen";
    document.getElementById("dealer").style.backgroundColor = "green";
    document.getElementById("turn").textContent = "Player BUST ! Dealer WON !!";
    document.getElementById("turn-div").style.backgroundColor = "yellow";
    document.getElementById("replay-btn").style.visibility = "visible";
  }
}

function updatePlayer(card) {
  if (card.img.includes("ace")) {
    
    if (player_total + card.val > 21) {
      // use 1 as value for ace
      player_total = player_total + 1;
    } else {
      player_total = player_total + card.val;
    }
  }
  else{player_total = player_total + card.val;}

  document.getElementById("player-total").textContent =
    "Value: " + player_total;

  checkPlayerScore();
}

function updateDealer(card) {

  if (card.img.includes("ace")) {
    
    if (dealer_total + card.val > 21) {
      // use 1 as value for ace
      dealer_total = dealer_total + 1;
    } else {
      dealer_total = dealer_total + card.val;
    }
  }
  else{dealer_total = dealer_total + card.val;}
  document.getElementById("dealer-total").textContent = "Value: " + dealer_total;
}

function dealerPlays() {
  while (dealer_total <= 17) {
    hitDealer();
  }
  // dealer's turn is over, Now its decision time
  if (player_total == dealer_total) {
    document.getElementById("turn").textContent = "It's a DRAW !!!";
  } else if (player_total == 21) {
    document.getElementById("turn").textContent = "Player got a Black Jack. Player WON!!";
  } else if (dealer_total == 21) {
    document.getElementById("turn").textContent = "Dealer got a Black Jack. Dealer WON!!";
  } else if (dealer_total > 21) {
    document.getElementById("turn").textContent = "Dealer BUST ! Player WON !!";
  } 
  // else if (player_total < dealer_total && dealer_total == 21) {
  //   document.getElementById("turn").textContent =
  //     "Dealer got a Black Jack. Dealer WON!!";
  // } 
  else if (player_total > dealer_total) {
    document.getElementById("turn").textContent = "Player WON !!";
  } else {
    document.getElementById("turn").textContent = "Dealer WON !!";
  }
    
  document.getElementById("turn-div").style.backgroundColor = "yellow";
  document.getElementById("replay-btn").style.visibility = "visible";
}

// document.getElementById("dealer-hit").disabled = true; 

distribute_cards();

if (player_total >= 21) {
  document.getElementById("player-hit").disabled = true;
}

function refresh() {
  // window.location.reload("Refresh");
  selected = [];
  player_total = 0;
  dealer_total = 0;
  player_balance = "1000";
  document.getElementById("turn").textContent = "Player's turn";
  document.getElementById("turn-div").style.backgroundColor = "transparent";
  document.getElementById("player-hit").disabled = false;
  document.getElementById("player-miss").disabled = false;
  distribute_cards();
}