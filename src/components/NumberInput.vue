<template>
  <div class="max-w-screen-sm w-full">
    <div class="flex items-center justify-around w-12 bg-neutral-200 rounded">
      <p v-if="nums.length > 0">{{nums[nums.length - 1]}}</p>
    </div>
    <progress :max="maxNums" :value="nums.length" class="progress ~urge !high" />
    <button class="button ~critical !low" @click="clear">Reset</button>
  </div>
</template>

<script>
export default {
  name: "NumberInput",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    maxNums: Number
  },
  data() {
    return {
      nums: this.value,
    };
  },
  mounted() {
    console.log(this.maxNums);
      document.addEventListener("keydown", this.enterValue);
  },
  methods: {
    enterNum(n) {
      this.nums.push(n);
      this.$emit("input", this.nums);
    },
    clear() {
      this.nums = [];
      this.$emit("input", this.nums);
    },
    enterValue(e) {
      let val = e.key;
      if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(val) !== -1) {
          this.enterNum(parseInt(val));
      } else if (val === "r") {
          this.enterNum(Math.floor(Math.random() * 10));
      } else if (val === "m") {
        for (let i = 0; i < 100; i++){
          this.enterNum(Math.floor(Math.random() * 10));
        }
      }
    }
  },
};
</script>