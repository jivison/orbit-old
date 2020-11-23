<template>
  <div class="TrackList">
    <div v-if="tracks.length">
      <li v-for="track in tracks" :key="track">
        {{ track.toString() }}
        <button @click="play(track)">Play</button>
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Track } from "../lib/classes/Track";
import { FilesystemService } from "../lib/services/FilesystemService";

export default defineComponent({
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

  methods: {
    play(track: Track) {
      track.play.bind(track)();
    },
  },
});
</script>
