/* eslint-disable no-param-reassign */
// initial state
const state = () => ({
  deck: '',
  remaining: 0,
});

// getters
const getters = {
  isReady(currState) {
    return currState.deck !== '' && currState.remaining > 0;
  },
};

// actions
const actions = {

  // Sends POST request to api for 6 decks of shuffled cards
  async fillDeck({ commit }) {
    const request = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle', {
      method: 'POST',
      body: {
        deck_count: 6,
      },
    });
    const newDeck = await request.json();
    // If request works
    if (newDeck.success) {
      commit('setDeckId', newDeck.deck_id);
      commit('setRemaining', newDeck.remaining);
    }
    return newDeck;
  },
  async drawCardFromDeck(store) {
    const deckId = store.state.deck;
    const request = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
    const card = await request.json();
    if (card.success) {
      store.commit('setRemaining', card.remaining);
    }
    return card;
  },

};

// mutations
const mutations = {
  addCard(currState, card) {
    state.cards = { ...currState.cards, card };
  },
  endGame(currState) {
    currState.deck = '';
    currState.remaining = 0;
  },
  setDeckId(currState, id) {
    currState.deck = id;
  },
  setRemaining(currState, amt) {
    currState.remaining = amt;
  },

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
