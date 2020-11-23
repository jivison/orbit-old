<template>
  <div class="TrackItem" @dblclick="play(track)">
    {{ track.tags.title }} - {{ track.tags.artist }}
  </div>
</template>

<script lang="ts">
import { Track } from "@/lib/classes/Track";
import { defineComponent } from "vue";

export default defineComponent({
  props: ["track"],

  methods: {
    play(track: Track) {
      track.play.bind(track)();
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
