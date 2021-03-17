<template>
  <div class="w-full">
    <div class="flex items-center mb-24">
      <div>
        <robot-friend />
        <div class="absolute text-6xl text-urge-100">
          <div
            v-for="num of numsRecent"
            :key="num[1]"
            class="absolute animate-explode -mt-24 ml-32"
          >
            {{ num[0] }}
          </div>
        </div>
      </div>

      <div class="text-lg speech-bubble p-4">
        <p v-if="nums.length < 25">
          Time to prove you're a robot. Please enter 50 random (uniform) numbers
          using your keypad.
        </p>
        <p v-if="nums.length >= 25 && nums.length < maxNums">
          Keep going... you're nearly there...
        </p>
        <p
          v-if="nums.length >= maxNums && results.isHuman === undefined"
          class="animate-pulse"
        >
          Hmm... I'm thinking...
        </p>
        <p
          v-if="results.isHuman === true"
          class="text-critical-600 font-bold text-2xl"
        >
          Get out of here, human!
        </p>
        <p
          v-if="results.isHuman === false"
          class="text-urge-600 font-bold text-2xl"
        >
          Bleep bloop, fellow robot!
        </p>
      </div>
    </div>
    <div v-if="nums.length < maxNums">
      <progress
        :max="maxNums"
        :value="nums.length"
        class="progress ~urge !high mt-8"
        v-if="nums.length > 0 && nums.length < maxNums"
      />
      <div>
        <button
          class="button ~neutral mt-4 lg:hidden"
          v-if="nums.length < maxNums"
          @click="$refs.input.focus()"
        >
          On a phone? Open keypad
        </button>
        <input
          type="tel"
          class="opacity-0 block"
          ref="input"
          @input="manualInput"
        />
      </div>
    </div>
    <div v-if="results.isHuman !== undefined" class="text-lg mt-12">
      <div v-if="results.isHuman === true">
        <p>
          <span class="font-bold text-critical-600"
            >We got you! Away, human!</span
          >
          Due to significant evidence of non-random behavior, we have no choice
          but to bar you from the robot club.
        </p>
      </div>
      <div v-if="results.isHuman === false">
        <p>
          <span class="font-bold text-positive-600"
            >Hello, my robot friend!</span
          >
          Welcome to the club. Bleep bloop.
        </p>
        <p class="mt-4">
          Well done generating random numbers! And if you're a human &mdash;
          after all, our test is not infallible &mdash; your entropy skills are
          quite impressive.
        </p>
      </div>
      <div class="mt-4">
        <p>In case you were curious, here's a breakdown of your scores...</p>
        <h3 class="heading mt-12">Raw Distribution</h3>
        <p class="mt-4">
          The "raw distribution" captures the number of times you entered each
          particular digit in total. In general, we expect the distribution of
          digits to be relatively uniform. Here's what your distribution looked
          like:
        </p>
        <Plotly
          class="mt-8"
          :data="[
            {
              x: nums,
              type: 'histogram',
              min: 0,
              name: 'Observed',
              xbins: {
                start: 0,
                end: 9,
                size: 1,
              },
            },
            {
              x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
              y: Array(10).fill(this.maxNums / 10),
              name: 'Expected',
              line: { shape: 'hv' },
              type: 'line',
              mode: 'lines',
            },
          ]"
          :layout="plotlyLayout"
          type="histogram"
        ></Plotly>
        <p class="mt-6">
          The Kolmogorov-Smirnov statistic for your random digits compared
          against the expected distribution was
          <strong>{{ results.ksAbsolute.toFixed(4) }}</strong
          >. The maximum allowable value was
          <strong>{{ results.absThreshold.toFixed(4) }}</strong
          >, which would exclude only around {{ pVal * 100 }}% of robots. The following chart illustrates how well your distribution fit the expected uniform relative to other randomly sampled uniform distributions (each with n={{maxNums}}, simulated 10,000 times).
        </p>
        <k-s-test-distribution :observed="results.ksAbsolute" :threshold="results.absThreshold" :simulations="results.absKSSims" title="Distribution of K-S stats for fit to uniform (n=10,000)" />
        <h3 class="heading mt-12">Distance Distribution</h3>
        <p class="mt-4">
          The "distance distribution" captures the distance between each digit
          you entered. For example, if you entered '5' followed by '3,' then the
          distance for that pair is 2. (There are not negative distances.) We
          expect the distances to follow a particular distribution &mdash; see
          the write-up for more details &mdash; and we can use the
          Kolmogorov-Smirnov test to assess how well the observed inputs adhere
          to that distribution. Here's what your particular distance
          distribution looked like:
        </p>
        <Plotly
          class="mt-8"
          :data="[
            {
              x: results.numDistances,
              type: 'histogram',
              min: 0,
              name: 'Observed',
              xbins: {
                start: 0,
                end: 9,
                size: 1,
              },
            },
            {
              x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
              y: Array.from(
                { length: 10 },
                (a, idx) => distPMF(0, 9, idx) * this.maxNums
              ),
              name: 'Expected',
              type: 'line',
              line: { shape: 'hv' },
              mode: 'lines',
            },
          ]"
          :layout="plotlyLayout"
          type="histogram"
        ></Plotly>
        <p class="mt-6">
          The Kolmogorov-Smirnov statistic for your digits' relative distances
          compared against the expected distribution was
          <strong>{{ results.ksDistances.toFixed(4) }}</strong
          >. The maximum allowable value was
          <strong>{{ results.distThreshold.toFixed(4) }}</strong
          >, which would exclude only around {{ pVal * 100 }}% of robots.
          The following chart illustrates how well your distance distribution fit the expected distribution relative to other randomly sampled distance distributions (each with n={{maxNums}}, simulated 10,000 times).
        </p>
        <k-s-test-distribution :observed="results.ksDistances" :threshold="results.distThreshold" :simulations="results.distKSSims" title="Distribution of K-S stats for fit to expected distance distribution (n=10,000)" />
      </div>
      <button class="button ~urge !high mt-4" @click="clear()">
        Try Again
      </button>
    </div>
  </div>
</template>

<script>
import { howRandom, distPMF, plotlyLayout } from "../utils.js";
import { Plotly } from "vue-plotly";
import RobotFriend from "./RobotFriend.vue";
import KSTestDistribution from "./KSTestDistribution.vue";

export default {
  name: "NumberInput",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      nums: this.value,
      maxNums: 50,
      results: {},
      pVal: 0.2,
      numsRecent: [],
      showlegend: true,
      distPMF,
      plotlyLayout
    };
  },
  mounted() {
    document.addEventListener("keydown", this.enterValue);
  },
  components: {
    Plotly,
    RobotFriend,
    KSTestDistribution
  },
  methods: {
    enterNum(n) {
      this.nums.push(n);
      this.$emit("input", this.nums);

      if (this.nums.length >= this.maxNums) {
        this.computeResults();
      }

      this.numsRecent.push([n, Math.random()]);
      setTimeout(() => this.numsRecent.shift(), 500);
    },
    clear() {
      this.nums = [];
      this.$emit("input", this.nums);
      this.results = {};
    },
    enterValue(e) {
      if (this.nums.length >= this.maxNums) {
        return;
      }
      let val = e.key;
      if (
        ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(val) !== -1
      ) {
        this.enterNum(parseInt(val));
      } else if (val === "r") {
        this.enterNum(Math.floor(Math.random() * 10));
      } else if (val === "m") {
        for (let i = 0; i < 100; i++) {
          this.enterNum(Math.floor(Math.random() * 10));
        }
      }
    },
    manualInput(e) {
      console.log(e);
    },
    computeResults() {
      let results = howRandom(this.nums, this.pVal);
      setTimeout(() => (this.results = results), 750);
    },
  },
};
</script>

<style scoped>
.animate-explode {
  animation: ping 0.7s cubic-bezier(0, 0, 0.2, 1);
}

.speech-bubble {
  position: relative;
  background: var(--color-neutral-200);
  border-radius: 0.4em;
}

.speech-bubble:after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-right-color: var(--color-neutral-200);
  border-left: 0;
  border-bottom: 0;
  margin-top: -10px;
  margin-left: -20px;
}
</style>