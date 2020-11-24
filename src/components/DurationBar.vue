<template>
  <div class="container">
    <div
      v-if="currentTime > 0 && totalDuration > 0"
      class="slider"
      :style="`width: ${
        (Math.ceil(currentTime) / Math.ceil(totalDuration)) * 100
      }%`"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "duration-bar",

  props: {
    totalDuration: {
      type: Number,
      required: true,
    },
    currentTime: {
      type: Number,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 4px;
  background: #dcdcdc;

  &:hover {
    cursor: pointer;
    height: 6px;
  }
}

.slider {
  background: red;
  height: 100%;
}
</style>