<template>
  <div class="TrackItem" @dblclick="play(trackIndex)">
    {{ track.tags.title }} - {{ track.tags.artist }}
  </div>
</template>

<script lang="ts">
import { Track } from "@/lib/classes/Track";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    track: {
      type: Track,
      required: true,
    },
    trackIndex: {
      type: Number,
      required: true,
    },
    onDoubleClick: {
      type: Function,
      required: true,
    },
  },

  methods: {
    play(trackIndex: number) {
      this.onDoubleClick(trackIndex);
    },
  },
});
</script>

<style lang="scss" scoped>
.TrackItem {
  padding: 0.2em;
  user-select: none;

  &.selected {
    cursor: pointer;
    background-color: #cbeae7;
  }
}
</style>
