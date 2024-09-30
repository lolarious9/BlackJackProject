<template>
  <div>
    <b-card v-if="!isDealer">
      <b-img
        v-for="cards of hand"
        :key="cards.img"
        :src="cards.img"
      />
    </b-card>
    <b-card v-else>
      <b-img
        :src="hand[0].img"
      />
    </b-card>
  </div>
</template>

<script>

export default {
  name: 'Hand',

  props: {
    isDealer: {
      type: Boolean,
      default: false,
    },
    hand: {
      required: true,
      type: Array,
    },
  },

};
</script>
