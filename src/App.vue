<template>
  <!-- <div>
    <h1>My Event</h1>
    <p>Capacity: {{ capacity }}</p>
    <button @click="increaseCapacity()">Increase Capacity</button>
  </div> -->
  <track-list />
</template>

<script lang="ts">
import { ref } from "vue";
import TrackList from "./views/TrackList.vue";

export default {
  components: {
    TrackList,
  },
  // setup() {
  //   const capacity = ref(3);

  //   function increaseCapacity() {
  //     capacity.value++;
  //   }

  //   return { capacity, increaseCapacity };
  // },
};
</script>