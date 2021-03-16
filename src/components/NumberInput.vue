<template>
  <div>
    <p v-if="nums.length > 0">{{nums[nums.length - 1]}}</p>
    <button class="button ~urge !high" @click="clear">Clear</button>
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
  },
  data() {
    return {
      nums: this.value,
    };
  },
  mounted() {
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
      console.log(e);
      let val = e.key;
      if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(val) !== -1) {
          this.enterNum(parseInt(val));
      } else if (val === "r") {
          this.enterNum(Math.floor(Math.random() * 10));
      }
    }
  },
};
</script>