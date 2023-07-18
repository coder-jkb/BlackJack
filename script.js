let folder = "cards/"
let prefix = ["ace_of_","2_of_","3_of_","4_of_","5_of_","6_of_","7_of_",
              "8_of_","9_of_","10_of_","jack_of_","queen_of_","king_of_"];

let player_type = "";
let ext = '.png'
let selected = [];
let player_cards = []
let dealer_cards = []
let player_total = 0; 
let dealer_total = 0;
let player_balance = 1000;
let deck = {Heart:[],Spade:[],Club:[],Diamond:[]}
let green =" rgba(0, 128, 0, 0.7)";
let darkgreen = "rgba(0, 100, 0, 0.7)";
let bet = 100;

document.getElementById("balance-amt").textContent = player_balance;

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
  document.getElementById("dealer").style.backgroundColor = darkgreen;
  card1 = get_random_card();
  card2 = get_random_card();
  card3 = get_random_card();
  insertImage(card1, player);
  insertImage(card2, player);
  insertImage(card3, dealer);
  player_total = card1.val + card2.val;
  dealer_total = card3.val
  player_cards = [card1, card2];
  dealer_cards = [card3];
  document.getElementById("player-total").textContent = player_total;
  document.getElementById("dealer-total").textContent = dealer_total;
  checkPlayerScore();
}

function hitPlayer() {
  player = document.getElementById('player-cards');
  card = get_random_card();
  insertImage(card, player);
  player_cards[player_cards.length] = card;
  updatePlayer(card)
}

function missPlayer() {
  document.getElementById("player-hit").disabled = true;
  document.getElementById("player-miss").disabled = true;
  // document.getElementById("dealer-hit").disabled = false;
  document.getElementById("player").style.backgroundColor = darkgreen;
  document.getElementById("dealer").style.backgroundColor = green;
  document.getElementById("turn").textContent = "Dealer's turn";
  dealerPlays();
}

function hitDealer() {
  dealer = document.getElementById("dealer-cards");
  card = get_random_card();
  insertImage(card, dealer);
  dealer_cards[dealer_cards.length] = card;
  updateDealer(card);  
}

function checkPlayerScore() {
  if (player_total == 21) {
    document.getElementById("player-hit").disabled = true;
    document.getElementById("player-miss").disabled = true;
    document.getElementById("player").style.backgroundColor = darkgreen;
    document.getElementById("dealer").style.backgroundColor = green;
    document.getElementById("turn").textContent = "Dealer's turn";
    dealerPlays();
  } else if (player_total > 21) {
    document.getElementById("player-hit").disabled = true;
    document.getElementById("player-miss").disabled = true;
    document.getElementById("player").style.backgroundColor = darkgreen;
    document.getElementById("dealer").style.backgroundColor = green;
    document.getElementById("turn").textContent = `Player BUST! Dealer WON $${bet}!!`;
    document.getElementById("turn-div").style.backgroundColor = "yellow";
    document.getElementById("replay-btn").style.visibility = "visible";
  }
}

function updatePlayer(card) {
  let num_aces = 0;
  player_total = 0;
  player_cards.forEach((card) => {
    if (card.img.includes("ace")) {
      num_aces += 1; // skip aces to decide value after adding for other cards
    } else {
      player_total += card.val;
    }
    if (num_aces > 0) {
      for (let i = 0; i < num_aces - 1; i++) {
        if (player_total + 11 > 21) {
          player_total += 1;
        } else {
          player_total += 11;
        }
      }
      // last ace
      if (player_total + 11 == 21) {
        player_total += 11;
      } else if (player_total + 1 == 21) {
        player_total += 1;
      } else if (player_total + 11 > 21) {
        player_total += 1;
      }
    }
  });

  document.getElementById("player-total").textContent = player_total;

  checkPlayerScore();
}

function updateDealer(card) {
  let num_aces = 0;
  dealer_total = 0;
  dealer_cards.forEach(card => {
    if (card.img.includes("ace")) {
      num_aces += 1 // skip aces to decide value after adding for other cards
    }
    else{
      dealer_total+=card.val
    }
    if (num_aces > 0) {
      for (let i = 0; i < num_aces-1; i++) {
        if (dealer_total + 11 > 21){
          dealer_total += 1;
        }else{
          dealer_total += 11;
        }
      }
      // last ace
      if (dealer_total + 11 == 21) {
        dealer_total += 11;
      } else if (dealer_total + 1 == 21) {
        dealer_total += 1;
      } else if (dealer_total + 11 > 21) {
        dealer_total += 1;
      }
    }
  });
  document.getElementById("dealer-total").textContent = dealer_total;
}

function dealerPlays() {
  while (dealer_total <= 17) {
    hitDealer();
  }
  // dealer's turn is over, Now its decision time
  if (player_total == dealer_total) {
    document.getElementById("turn").textContent = "It's a DRAW !!!";
    player_balance = player_balance + Number(bet);
    document.getElementById("balance-amt").textContent = player_balance;
  } else if (player_total == 21) {
    document.getElementById("turn").textContent = `Player got a Black Jack. Player WON $${bet}!!`;
    player_balance += 2 * bet;
    document.getElementById("balance-amt").textContent = player_balance;

  } else if (dealer_total == 21) {
    document.getElementById(
      "turn"
    ).textContent = `Dealer got a Black Jack. Dealer WON $${bet}!!`;
  } else if (dealer_total > 21) {
    document.getElementById("turn").textContent = `Dealer BUST! Player WON $${bet}!!`;
    player_balance += 2 * bet;
    document.getElementById("balance-amt").textContent = player_balance;
    
  } 
  else if (player_total > dealer_total) {
    document.getElementById("turn").textContent = `Player WON $${bet}!!`;
    player_balance += 2 * bet;
    document.getElementById("balance-amt").textContent = player_balance;
  } else {
    document.getElementById("turn").textContent = `Dealer WON $${bet}!!`;
  }
    
  document.getElementById("turn-div").style.backgroundColor = "yellow";
  document.getElementById("replay-btn").style.visibility = "visible";
}

function allIn() {
  document.getElementById("bet-amt").value = player_balance;
}

// document.getElementById("dealer-hit").disabled = true; 
function placeBet() {
  bet = document.getElementById("bet-amt").value;

  if( bet % 50 == 0 && bet >= 50 && bet <= player_balance){
    player_balance = player_balance - bet;
    document.getElementById("balance-amt").textContent = player_balance;
    document.getElementById("betted-amt").textContent = bet;
    game_box = document.getElementById("game-box");
    form_box = document.getElementById("form-box");
    game_box.style.visibility = "visible";
    form_box.style.display = "none";
    distribute_cards();
  }
  else{
    document.getElementById("bet-amt").value = "";
    alert("1. bet must me in multiples of 50\n2. Bet must be in the range of $50 and $"+player_balance)
  }

  if (player_type == "AI") {
    while (player_total <= 17) {
      console.log("player hit");
      hitPlayer();
    }
    missPlayer();
  }

}

if (player_total >= 21) {
  document.getElementById("player-hit").disabled = true;
}

function replay() {
  if (player_balance < 50){
    alert("Player is out of balance. Game over!!")
  }else{
    // window.location.reload("Refresh");
    selected = [];
    player_cards = [];
    dealer_cards = [];
    player_total = 0;
    dealer_total = 0;
    player = document.getElementById("player-cards");
    dealer = document.getElementById("dealer-cards");
    player.innerHTML = ""; // remove all card
    dealer.innerHTML = "";
  
    game_box = document.getElementById("game-box");
    form_box = document.getElementById("form-box");
    game_box.style.visibility = "hidden";
    form_box.style.display = "block";
  
    document.getElementById("turn").textContent = "Player's turn";
    document.getElementById("turn-div").style.backgroundColor = "transparent";
    document.getElementById("dealer").style.backgroundColor = darkgreen;
    document.getElementById("player").style.backgroundColor = green;
    document.getElementById("player-hit").disabled = false;
    document.getElementById("player-miss").disabled = false;
  }
}

function selectPlayer(player_radio) {
  player_type = player_radio.value;
  // console.log(player_radio.value);
  if (player_type == "AI") {
    document.getElementById("player-hit").disabled = true;
    document.getElementById("player-miss").disabled = true;
    document.getElementById("player-hit").style.display = "none";
    document.getElementById("player-miss").style.display = "none";
    document.getElementById("AI-player").style.display = "block";
  } else {
    document.getElementById("player-hit").disabled = false;
    document.getElementById("player-miss").disabled = false;
    document.getElementById("AI-player").style.display = "none";
    document.getElementById("player-hit").style.display = "inline";
    document.getElementById("player-miss").style.display = "inline";
  }
}