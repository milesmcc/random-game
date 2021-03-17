<template>
  <div class="max-w-screen-sm w-full">
    <p class="italic text-center text-xl">
      Time to prove you're a robot!<br />
      Please enter 50 random numbers from your keypad.
    </p>
    <div class="flex items-center justify-center mt-12">
      <transition name="fade">
        <div
          class="flex items-center justify-around w-32 h-32 bg-neutral-200 rounded text-6xl text-urge-600"
        >
          <p v-if="nums.length === 0" class="animate-pulse">#</p>
          <p v-if="nums.length > 0" class="animate-pulse">
            {{ nums[nums.length - 1] }}
          </p>
        </div>
      </transition>
    </div>
    <progress
      :max="maxNums"
      :value="nums.length"
      class="progress ~urge !high mt-8"
    />
    <div class="text-center">
      <button
        v-if="nums.length >= maxNums"
        class="button ~critical !low mb-2 block"
        @click="clear"
      >
        Reset
      </button>
      <button class="button ~neutral mt-4" @click="$refs.input.focus()">
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
</template>

<script>
export default {
  name: "NumberInput",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    maxNums: Number,
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
  },
};
</script>

<style scoped>
.animate-explode {
  animation: ping 0.7s cubic-bezier(0, 0, 0.2, 1);
}
</style>