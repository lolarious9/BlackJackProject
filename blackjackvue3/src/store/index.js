import Vue from 'vue';
import Vuex from 'vuex';
import deck from './deck';
import hand from './hand';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {
  },
  actions: {
  },
  modules: {
    hand, deck,
  },
});
