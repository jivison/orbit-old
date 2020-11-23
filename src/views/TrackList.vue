<template>
  <div class="TrackList">
    <div v-if="tracks.length">
      <track-item v-for="track in tracks" v-bind:track="track" :key="track" />
    </div>
  </div>
</template>

<script lang="ts">
import TrackItem from "@/components/TrackItem.vue";
import { defineComponent } from "vue";
import { Track } from "../lib/classes/Track";
import { FilesystemService } from "../lib/services/FilesystemService";

export default defineComponent({
  components: { TrackItem },
  data() {
    return {
      tracks: [] as Track[],
    };
  },

  mounted() {
    const filesystemService = new FilesystemService();

    const tracks = filesystemService
      .globReadDirectory(
        "/Users/john/Music/_Downloads/**/*.mp3"
        // "/Users/john/Music/_Downloads/**/*.flac"
      )
      .then((tracks) =>
        (this.tracks = tracks.map((t) => new Track(t))).sort((a, b) =>
          a.toString().localeCompare(b.toString())
        )
      );
  },

  methods: {},
});
</script>
