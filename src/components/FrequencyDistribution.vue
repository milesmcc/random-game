<template>
  <Plotly
    class="mt-8"
    :data="[
      {
        x: observed,
        type: 'histogram',
        name: 'Observed',
        xbins: {
          start: 0,
          end: 9,
          size: 1,
        },
      },
      {
        x: expectedX,
        y: expectedY,
        name: 'Expected',
        type: 'line',
        line: { shape: 'hv' },
        mode: 'lines',
      },
    ]"
    :layout="{
      ...plotlyLayout,
      title: { text: title, font: { color: 'white' }, color: 'white' },
      yaxis: {
        title: {
          text: 'Observed (count)',
          font: {
            color: 'white',
          },
        },
        color: 'white',
      },
      xaxis: {
        title: {
          text: 'Value',
          font: {
            color: 'white',
          },
        },
        color: 'white',
      },
    }"
    type="histogram"
  ></Plotly>
</template>

<script>
import { Plotly } from "vue-plotly";
import { plotlyLayout } from "../utils.js";

export default {
  components: {
    Plotly,
  },
  data() {
    return {
      plotlyLayout,
    };
  },
  props: {
    observed: Array,
    expectedX: Array,
    expectedY: Array,
    title: String,
  },
};
</script>