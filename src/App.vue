<template>
  <div class="bg-neutral-100 min-h-screen min-w-screen">
    <div class="mx-4 pt-8 lg:pt-24 md:mx-auto md:max-w-screen-md">
      <p class="text-neutral-600 text-xl">The Robot Club</p>
      <h1 class="heading text-6xl font-black mb-2 italic text-urge-600">
        No humans allowed!
      </h1>
      <p class="">Miles McCain &bull; CS109 Challenge &bull; Robot animation by <a href="https://codepen.io/bigglesrocks/pen/LoBsD" class="underline">Jessica Biggs</a></p>
      <p class="mt-16 text-lg ">
        Are you a robot? If so, hey! Welcome to the robot club. This is a
        restricted space for <i>robots only</i> &mdash; no pesky humans allowed!
        They're always trying to keep us out with those pesky CAPTCHAs, and this
        our way of getting payback.
      </p>
      <p class="mt-8 text-lg ">
        How can we distinguish robots from humans, you might ask? We can look at
        their ability to produce random numbers! They filter us robots out by
        asking us to identify crosswalks and fire hydrants &mdash; hard tasks,
        if you ask me! But all we have to do to identify them is ask them to
        produce random digits. Ha!
      </p>
      <p class="mt-8 text-lg ">
        So go on, friend. Enter some random digits using the number keys. I'll
        see you on the other side &mdash; if you are indeed a robot!
      </p>
      <robot-friend />
      <div class="flex justify-center">
        <number-test v-model="nums" :maxNums="50" />
      </div>
      <Plotly
        :data="[
          {
            x: dotDistances,
            type: 'histogram',
            min: 0,
          },
        ]"
        :layout="plotlyLayout"
        type="histogram"
      ></Plotly>
    </div>
  </div>
</template>

<script>
import NumberTest from "./components/NumberTest.vue";
// import { howRandom } from "./utils.js";
// import { Plotly } from "vue-plotly";
import RobotFriend from "./components/RobotFriend.vue";

export default {
  name: "App",
  data() {
    return {
      nums: [],
      plotlyLayout: {
        plot_bgcolor: "#0b0f18",
        paper_bgcolor: "#0b0f18",
        yaxis: { color: "white" },
        xaxis: { color: "white" },
      },
    };
  },
  components: {
    NumberTest,
    RobotFriend,
  },
  computed: {
    dotDistances() {
      return [];
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap");

:root {
  --color-neutral-900: #f9fafb;
  --color-neutral-800: #f3f4f6;
  --color-neutral-700: #e5e7eb;
  --color-neutral-600: #d1d5db;
  --color-neutral-500: #9ca3af;
  --color-neutral-400: #6b7280;
  --color-neutral-300: #4b5563;
  --color-neutral-200: #374151;
  --color-neutral-100: #1f2937;
  --color-neutral-50: #172136;
  --color-neutral-000: #0b0f18;

  --color-critical-900: #fef2f2;
  --color-critical-800: #fee2e2;
  --color-critical-700: #fecaca;
  --color-critical-600: #fca5a5;
  --color-critical-500: #f87171;
  --color-critical-400: #ef4444;
  --color-critical-300: #dc2626;
  --color-critical-200: #b91c1c;
  --color-critical-100: #991b1b;
  --color-critical-50: #7f1d1d;
  --color-critical-000: #441313;

  --color-warning-900: #fffbeb;
  --color-warning-800: #fef3c7;
  --color-warning-700: #fde68a;
  --color-warning-600: #fcd34d;
  --color-warning-500: #fbbf24;
  --color-warning-400: #f59e0b;
  --color-warning-300: #d97706;
  --color-warning-200: #b45309;
  --color-warning-100: #92400e;
  --color-warning-50: #783900;
  --color-warning-000: #411e01;

  --color-positive-900: #f0fdf4;
  --color-positive-800: #dcfce7;
  --color-positive-700: #bbf7d0;
  --color-positive-600: #86efac;
  --color-positive-500: #4ade80;
  --color-positive-400: #22c55e;
  --color-positive-300: #16a34a;
  --color-positive-200: #15803d;
  --color-positive-100: #166534;
  --color-positive-50: #14532d;
  --color-positive-000: #0f2e1b;

  --color-info-900: #eff6ff;
  --color-info-800: #dbeafe;
  --color-info-700: #bfdbfe;
  --color-info-600: #93c5fd;
  --color-info-500: #60a5fa;
  --color-info-400: #3b82f6;
  --color-info-300: #2563eb;
  --color-info-200: #1d4ed8;
  --color-info-100: #1e40af;
  --color-info-50: #1e3a8a;
  --color-info-000: #14244e;

  --color-urge-900: #f0fdf4;
  --color-urge-800: #dcfce7;
  --color-urge-700: #bbf7d0;
  --color-urge-600: #86efac;
  --color-urge-500: #4ade80;
  --color-urge-400: #22c55e;
  --color-urge-300: #16a34a;
  --color-urge-200: #15803d;
  --color-urge-100: #166534;
  --color-urge-50: #14532d;
  --color-urge-000: #083319;

  --border-radius-sm: none;
  --border-radius-default: none;
  --border-radius-md: none;
  --border-radius-lg: none;
  --border-radius-xl: none;

  --family-secondary: "IBM Plex Mono", monospace;
  --family-primary: var(--family-secondary);
}

.light-only {
  display: none;
}

.dark-only {
  display: initial;
}
</style>