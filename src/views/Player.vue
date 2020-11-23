<template>
  <div>
    <button @click="playPause()">
      <span v-if="isPlaying">Pause</span>
      <span v-else>Play</span>
    </button>
    <button @click="stop()">Stop</button>
  </div>
</template>

<script lang="ts">
import { Player } from "@/lib/classes/Player";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      player: Player.getInstance(),
      isPlaying: false,
    };
  },

  mounted() {
    this.player.on(
      "play",
      (() => {
        this.isPlaying = true;
      }).bind(this)
    );

    this.player.on(
      ["pause", "ended"],
      (() => {
        this.isPlaying = false;
      }).bind(this)
    );
  },

  methods: {
    playPause() {
      this.player.playPause.bind(this.player)();
    },

    stop() {
      this.player.stop.bind(this.player)();
    },
  },
});
</script>