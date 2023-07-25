class BlackJack {
  constructor(lr = 0.1, exp_rate = 0.3) {
    this.player_Q_Values = {}; // key: [(player_value, show_card, usable_ace)][action] = value
    for (let i = 4; i <= 22; i++) {
      for (let j = 2; j <= 22; j++) {
        // k is for Math.round(bet/balance) ratio
        // for (let k in [0, 1]) {
          this.player_Q_Values[[i, j]] = {};
          // this.player_Q_Values[[i, j, k]] = {};

          for (let a in [1, 0]) {
            if (i == 21 && a == 0) {
              this.player_Q_Values[[i, j]][a] = 1;
              // this.player_Q_Values[[i, j, k]][a] = 1;
            } else {
              this.player_Q_Values[[i, j]][a] = 0;
              // this.player_Q_Values[[i, j, k]][a] = 0;
            }
          }
        // }
      }

      this.player_state_action = [];

      //   player, deealer,
      this.state = [
        player_total,
        dealer_total,
        // Math.round(bet / player_balance),
      ]; // initial state
      this.actions = [1, 0]; // 1: HIT  0: STAND
      this.end = false;
      this.lr = lr;
      this.exp_rate = exp_rate;
    }
  }

  selectAction() {
    let action;
    if (this.state[0] < 12) return 1;

    if (Math.random() < this.exp_rate) {
      // random exploration 0: stand, 1: hit
      action = getRandomInt(0, 1);
      console.log("random action: ", action);
    } else {
      // exploitaion (greedy)
      let v = -999;
      action = 0;
      for (let a in this.player_Q_Values[this.state]) {
        if (this.player_Q_Values[this.state][a] > v) {
          action = a;
          v = this.player_Q_Values[this.state][a];
          console.log("gredy action: ", action);
        }
      }
    }
    return action;
  }

  playAction(action) {
    if (action) {
      // hit
      hitPlayer();
    } else {
      this.end = true;
      missPlayer();
      return [player_total, dealer_total];
      // return [player_total, dealer_total, Math.round(bet / player_balance)];
    }

    if (player_total > 21) {
      this.end = true;
    }
    return [player_total, dealer_total];
    // return [player_total, dealer_total, Math.round(bet / player_balance)];
  }

  winner() {
    // player won 1 | draw 0 | (player lost) dealer won -1
    if (player_total > 21) {
      return -1; // dealer won
    } else {
      if (dealer_total > 21) return 1; // player won
      else if (player_total > dealer_total) return 1; // player won
      else if (player_total < dealer_total) return -1; //
      else return 0;
    }
  }
  giveReward() {
    let reward = this.winner();
    let state, action;
    // console.log("SA arr", [...this.player_state_action].reverse());
    // for (let sa in [...this.player_state_action].reverse()) {
    // let rev_player_state_action = [...this.player_state_action].reverse();
    for (let i = this.player_state_action.length-1;i>=0; i--) {
      let sa = this.player_state_action[i];
      state = sa[0];
      action = sa[1];
      try {
        
        reward=this.player_Q_Values[state][action]+this.lr*(reward-this.player_Q_Values[state][action]);
        this.player_Q_Values[state][action] = Number(reward.toFixed(3));
      } catch (error) {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.log(error.message);
        console.log("P D",player_total, dealer_total);
        console.log("SA",state, action);
        console.log("Q", this.player_Q_Values);
        
        console.log("Q S vl", this.player_Q_Values[state]);
        console.log("Q SA vl", this.player_Q_Values[state][action]);
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      }
    }
  }

  reset() {
    console.log(">>>>>> RESETTING VARIABLED <<<<<<");
    this.player_state_action = [];
    this.state = [0, 0]; // initial state
    // this.state = [0, 0, 0]; // initial state
    this.end = false;
  }

  playRL(iters) {
    let action;
    for (let i = 0; i < iters; i++) {
      if (i % 20 == 0) console.log("iter: ", i);

      this.state = [
        player_total,
        dealer_total,
        // Math.round(bet / player_balance),
      ];
      console.log("Init: ", this.state);

      if (player_total == 21 || dealer_total == 21) {
        continue;
      } 
      else {
        while (true) {
          action = this.selectAction();
          if (this.state[0] >= 12) {
            state_action_pair = [this.state, action];
            this.player_state_action.push(state_action_pair);
          }

          

          this.state = this.playAction(action);

          if (this.end) {
            break;
          }
        }

        this.giveReward();
      }
      this.reset();
    }
  }
}
