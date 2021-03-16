<template>
  <div class="bg-neutral-100 min-h-screen min-w-screen">
    <div class="mx-4 md:mx-auto md:max-w-screen-lg">
      <h3 class="heading text-urge-500">Hi! DotCanvas</h3>
      <number-input v-model="nums" />
      <button @click="computeDistribution">Compute Distributions</button>
      <Plotly
        :data="[
          {
            x: dotDistances,
            type: 'histogram',
            min: 0
          },
        ]"
        type="histogram"
      ></Plotly>
    </div>
  </div>
</template>

<script>
import NumberInput from "./components/NumberInput.vue";
import { howRandom, distances } from "./utils.js";
import { Plotly } from "vue-plotly";

export default {
  name: "App",
  data() {
    return {
      nums: [],
    };
  },
  methods: {
    computeDistribution() {
      let results = howRandom(this.nums, 0.2);
      console.log(results);
    },
  },
  components: {
    NumberInput,
    Plotly,
  },
  computed: {
    dotDistances() {
      return distances(this.nums);
    },
  },
};
</script>