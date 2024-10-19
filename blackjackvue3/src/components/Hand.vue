<template>
  <div>
    <BCard v-if="!isDealer">
      <BImg
        v-for="cards of hand"
        :key="cards.img"
        :src="cards.img"
      />
    </BCard>
    <BCard v-else>
      <BImg
        v-if="hand[0]"
        :src="hand[0].img"
      />
    </BCard>
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
