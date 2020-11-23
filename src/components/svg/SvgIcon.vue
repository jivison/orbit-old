<template>
  <svg class="icon" :class="{ 'icon-spin': spin }">
    <use :xlink:href="`#${icon}`" />
  </svg>
</template>

<script>
// credit: https://css-tricks.com/a-font-like-svg-icon-system-for-vue/

import { defineComponent } from "vue";

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    spin: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style>
svg.icon {
  fill: currentColor;
  height: 1em;
  margin-bottom: 0.125em;
  vertical-align: middle;
  width: 1em;
}
svg.icon-spin {
  animation: icon-spin 2s infinite linear;
}
@keyframes icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>