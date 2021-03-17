<template>
  <Plotly
    class="mt-8"
    :data="[
      {
        x: simulations,
        type: 'histogram',
        min: 0,
        name: 'Simulated',
        histnorm: 'probability',
        xbins: {
          size: 0.02,
          start: 0,
        },
      },
    ]"
    :layout="{
      ...plotlyLayout,
      title: { text: title, font: { color: 'white' }, color: 'white' },
      shapes: [
        {
          type: 'line',
          x0: observed,
          y0: 0,
          x1: observed,
          yref: 'paper',
          y1: 1,
          line: {
            color: 'orange',
            width: 2,
          },
        },
        {
          type: 'line',
          x0: threshold,
          y0: 0,
          x1: threshold,
          yref: 'paper',
          y1: 1,
          line: {
            color: 'lightgreen',
            width: 2,
            dash: 'dot',
          },
        },
      ],
      annotations: [
        {
          showarrow: false,
          text: 'Obs.',
          align: 'right',
          x: observed,
          xanchor: 'right',
          y: 0,
          yanchor: 'top',
          textposition: 'top',
          font: { color: 'orange' },
        },
        {
          showarrow: false,
          text: 'Max',
          align: 'right',
          x: threshold,
          xanchor: 'left',
          y: 0,
          yanchor: 'top',
          textposition: 'bottom',
          font: { color: 'lightgreen' },
        },
      ],
      yaxis: {
        title: {
          text: 'Prob. of outcome',
          font: {
            color: 'white'
          },
        },
        color: 'white'
      },
      xaxis: {
        title: {
          text: 'K-S Value',
          font: {
            color: 'white'
          },
        },
        color: 'white'
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
        Plotly
    },
    data() {
        return {
            plotlyLayout
        }
    },
    props: {
        threshold: Number,
        observed: Number,
        simulations: Number,
        title: String
    }

}
</script>