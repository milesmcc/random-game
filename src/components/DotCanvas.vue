<template>
  <div>
    <canvas
      ref="canvas"
      width="300"
      height="300"
      @click="click"
      class="rounded-lg shadow-xl bg-neutral-000"
    />
    <button class="button ~urge !high" @click="fillRandom(25)">
      Fill Random
    </button>
    <button class="button ~urge !high" @click="clear">Clear</button>
  </div>
</template>

<script>
export default {
  name: "DotCanvas",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dots: this.value,
    };
  },
  methods: {
    drawDot(x, y) {
      let canvas = this.$refs.canvas;
      canvas.getContext("2d").fillRect(x, y, 5, 5);
      this.dots.push([x, y]);
      this.$emit("input", this.dots);
    },
    clear() {
      let canvas = this.$refs.canvas;
      this.dots = [];
      this.$emit("input", this.dots);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    },
    click(e) {
      let canvas = this.$refs.canvas;
      let x = e.clientX - canvas.getBoundingClientRect().left;
      let y = e.clientY - canvas.getBoundingClientRect().top;
      this.drawDot(x, y);
    },
    fillRandom(n) {
      let i = 0;
      let canvas = this.$refs.canvas;
      let width = canvas.clientWidth;
      let height = canvas.clientHeight;
      while (i < n) {
        i++;
        this.drawDot(
          Math.random() * width,
          Math.random() * height
        );
      }
    },
  },
};
</script>