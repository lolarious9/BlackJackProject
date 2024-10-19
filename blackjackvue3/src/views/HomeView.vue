<template>
  <main>
    <BContainer v-if="gameState !== ''">
      <h1>{{ gameState }}</h1>
      <BButton @click="startGame">
        Play Again
      </BButton>
    </BContainer>
    <BContainer>
      <BRow
        v-if="gameLoop"
        class=".mb-5"
      >
        <BCol>
          <BCard>
            <BCardTitle v-if="coverDealer">
              Dealer
            </BCardTitle>
            <BCardTitle v-if="!coverDealer">
              Dealer: {{ dealerPoints }}
            </BCardTitle>
            <hand
              v-if="dealer"
              :is-dealer="coverDealer"
              :hand="dealer"
            />
          </BCard>
        </BCol>
      </BRow>

      <BRow
        v-if="gameLoop"
      >
        <BCol>
          <BCard
            deck
            text-left
          >
            <BCardTitle>
              Player: {{ playerPoints }}
            </BCardTitle>
            <BRow
              v-if="gameState === ''"
              align-h="center"
            >
              <BCol>
                <b-button @click="drawCard('player')">
                  Draw Card
                </b-button>
              </BCol>
              <BCol>
                <b-button @click="endTurn">
                  End Turn
                </b-button>
              </BCol>
            </BRow>
            <BRow>
              <hand
                v-if="player"
                :hand="player"
              />
            </BRow>
          </BCard>
        </BCol>
      </BRow>
    </BContainer>
  </main>
</template>

<script>
import { computed, watch, ref } from 'vue';
import Hand from '@/components/Hand.vue';
import { useStore } from 'vuex';


export default {
  name: 'HomeView',
  components: { Hand },

  created() {
    // Initialize and shuffle deck on app start
    this.startGame();
  },
  setup() {
    const store = useStore()
    // Draws a card for the supplied deck
    async function drawCard(deck) {
      await store.dispatch('hand/drawCard', deck);
    }
    function endTurn() {
      store.commit('hand/endTurn');
    }

    const gameState = ref("");
    // Main game loop, will resolve true when deck is loaded and ready to play
    const gameLoop = computed(() => store.getters['deck/isReady'] || gameState.value !== '');
    // Forces the two initial draws

    const dealer = computed(() => store.getters['hand/getDealer']);
    const player = computed(() => store.getters['hand/getPlayer']);
    const turn = computed(() => store.getters['hand/getTurn']);
    const playerPoints = computed(() => store.getters['hand/getPlayerVal']);
    const dealerPoints = computed(() => store.getters['hand/getDealerVal']);

    // We lose if we go over 21
    const overTwentyOne = computed(() => store.getters['hand/overTwentyOne']);
    watch(overTwentyOne, (val) => { if (val) { gameState.value = 'LOSS'; } });

    // show or hide dealer value and card
    const coverDealer = computed(() => turn.value === 'Player');
    const canDraw = computed(() => parseInt(dealerPoints.value, 10) < 16);

    async function didWeWin() {
      return new Promise((resolve) => {
        if (dealerPoints.value > 21) {
          return resolve('WON');
        }
        if (store.getters['hand/isTie']) {
          return resolve('TIE');
        }
        const winner = store.getters['hand/isPlayerWinning'] ? 'WON' : 'LOSS';
        return resolve(winner);
      });
    }
    // Dealers turn loop
    async function dealerTurn() {
      if (canDraw.value) {
        await drawCard('dealer');
        await dealerTurn();
      } else {
        gameState.value = await didWeWin();
        store.commit('deck/endGame');
      }
    }

    // Starts the dealers turn
    watch(turn, async (newTurn) => {
      if (newTurn === 'Dealer') {
        await dealerTurn();
      }
    });
    // Watch if game ends, reset the deck if so
    watch(gameState, (newVal) => {
      if (newVal !== '') {
        store.commit('deck/endGame');
      }
    }, { lazy: true });

    // Starts the Game
    async function startGame() {
      await store.dispatch('deck/fillDeck');
      store.commit('hand/emptyHands');
      gameState.value = '';
      return Promise.all(
        [
          drawCard('player'),
          drawCard('player'),
          drawCard('dealer'),
          drawCard('dealer'),
        ],
      );
    }

    return {
      gameLoop,
      dealer,
      player,
      drawCard,
      endTurn,
      playerPoints,
      dealerPoints,
      turn,
      gameState,
      coverDealer,
      startGame,
    };
  },

  methods: {

  },

};
</script>
