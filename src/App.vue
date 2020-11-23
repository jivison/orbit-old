<template>
  <div id="app">
    <svg-sprite />
    <track-list />
    <player />
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import TrackList from "./views/TrackList.vue";
import Player from "./views/Player.vue";
import SvgSprite from "./components/svg/SvgSprite.vue";

export default {
  components: {
    TrackList,
    Player: Player,
    SvgSprite,
  },
};
</script>

