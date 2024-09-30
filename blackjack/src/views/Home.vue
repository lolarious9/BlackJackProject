<template>
  <main>
    <b-container v-if="gameState !== ''">
      <h1>{{ gameState }}</h1>
      <b-button @click="startGame">
        Play Again
      </b-button>
    </b-container>
    <b-container>
      <b-row
        v-if="gameLoop"
        class=".mb-5"
      >
        <b-col>
          <b-card>
            <b-card-title v-if="coverDealer">
              Dealer
            </b-card-title>
            <b-card-title v-if="!coverDealer">
              Dealer: {{ dealerPoints }}
            </b-card-title>
            <hand
              v-if="dealer"
              :is-dealer="coverDealer"
              :hand="dealer"
            />
          </b-card>
        </b-col>
      </b-row>

      <b-row
        v-if="gameLoop"
      >
        <b-col>
          <b-card
            deck

            text-left
          >
            <b-card-title>
              Player: {{ playerPoints }}
            </b-card-title>
            <b-row
              v-if="gameState === ''"
              align-h="center"
            >
              <b-col>
                <b-button @click="drawCard('player')">
                  Draw Card
                </b-button>
              </b-col>
              <b-col>
                <b-button @click="endTurn">
                  End Turn
                </b-button>
              </b-col>
            </b-row>
            <b-row>
              <hand
                v-if="player"
                :hand="player"
              />
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </main>
</template>

<script>
import { computed, watch, ref } from '@vue/composition-api';
import Hand from '@/components/Hand.vue';

export default {
  name: 'Home',
  components: { Hand },
  data() {
    return {
      state: '',
    };
  },

  created() {
    // Initialize and shuffle deck on app start
    this.startGame();
  },
  setup(props, context) {
    // Draws a card for the supplied deck
    async function drawCard(deck) {
      await context.root.$store.dispatch('hand/drawCard', deck);
    }
    function endTurn() {
      context.root.$store.commit('hand/endTurn');
    }

    const gameState = ref(context.state);
    // Main game loop, will resolve true when deck is loaded and ready to play
    const gameLoop = computed(() => context.root.$store.getters['deck/isReady'] || gameState.value !== '');
    // Forces the two initial draws

    const dealer = computed(() => context.root.$store.getters['hand/getDealer']);
    const player = computed(() => context.root.$store.getters['hand/getPlayer']);
    const turn = computed(() => context.root.$store.getters['hand/getTurn']);
    const playerPoints = computed(() => context.root.$store.getters['hand/getPlayerVal']);
    const dealerPoints = computed(() => context.root.$store.getters['hand/getDealerVal']);

    // We lose if we go over 21
    const overTwentyOne = computed(() => context.root.$store.getters['hand/overTwentyOne']);
    watch(overTwentyOne, (val) => { if (val) { gameState.value = 'LOSS'; } });

    // show or hide dealer value and card
    const coverDealer = computed(() => turn.value === 'Player');
    const canDraw = computed(() => parseInt(dealerPoints.value, 10) < 16);

    async function didWeWin() {
      return new Promise((resolve) => {
        if (dealerPoints > 21) {
          return resolve('WON');
        }
        if (context.root.$store.getters['hand/isTie']) {
          return resolve('TIE');
        }
        const winner = context.root.$store.getters['hand/isPlayerWinning'] ? 'WON' : 'LOSS';
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
        context.root.$store.commit('deck/endGame');
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
        context.root.$store.commit('deck/endGame');
      }
    }, { lazy: true });

    // Starts the Game
    async function startGame() {
      await this.$store.dispatch('deck/fillDeck');
      this.$store.commit('hand/emptyHands');
      this.gameState = '';
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
