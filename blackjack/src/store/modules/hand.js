/* eslint-disable no-param-reassign */
// initial state
const state = () => ({
  dealer: [],
  player: [],
  turn: 'Player',
});

// Get either player or dealer decks
const getters = {
  getPlayer(currState) {
    return currState.player;
  },
  getDealer(currState) {
    return currState.dealer;
  },
  // This will update and keep track of the value of the dealer cards
  getDealerVal(currState) {
    let total = 0;
    currState.dealer.forEach((element) => {
      if (element.card === 'ACE') {
        if (total + 10 > 21) {
          total += 1;
        }
      }
      const next = parseInt(element.card, 10);
      if (!Number.isInteger(next)) {
        total += 10;
      } else {
        total += next;
      }
    });
    return total;
  },
  // This will update and keep track of the value of the player cards
  getPlayerVal(currState) {
    let total = 0;
    currState.player.forEach((element) => {
      if (element.card === 'ACE') {
        if (total + 10 > 21) {
          total += 1;
        }
      }
      const next = parseInt(element.card, 10);
      if (!Number.isInteger(next)) {
        total += 10;
      } else {
        total += next;
      }
    });
    return total;
  },
  overTwentyOne(currState, otherGetters) {
    return (otherGetters.getPlayerVal > 21);
  },
  isPlayerWinning(currState, otherGetters) {
    return otherGetters.getPlayerVal > otherGetters.getDealerVal;
  },
  isTie(currState, otherGetters) {
    return otherGetters.getPlayerVal === otherGetters.getDealerVal;
  },
  getTurn(currState) {
    return currState.turn;
  },

};

const actions = {
  async drawCard({ dispatch, commit }, deck) {
    // request a card from the deck
    const request = await dispatch('deck/drawCardFromDeck', '', { root: true });
    const card = await request.cards;
    commit('addCard', {
      card: {
        suit: card[0].suit.toLowerCase(),
        card: card[0].value.toLowerCase(),
        img: card[0].image,
      },
      deck,
    });
    return request;
  },

};

// mutations
const mutations = {
  // Empties the hands
  emptyHands(currState) {
    currState.player.length = 0;
    currState.dealer.length = 0;
    currState.turn = 'Player';
  },
  addCard(currState, { card, deck }) {
    currState[deck].push(card);
  },
  endTurn(currState) {
    currState.turn = 'Dealer';
  },

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
