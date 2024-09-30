import Vue from 'vue';
import Vuex from 'vuex';
import deck from './modules/deck';
import hand from './modules/hand';

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
