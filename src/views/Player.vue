<template>
  <div class="Player">
    <div class="controls-container">
      <div class="controls">
        <div>
          <span v-if="isPlaying" @click="playPause()"
            ><svg-icon class="player-icon" icon="pause"
          /></span>
          <span v-else @click="playPause()"
            ><svg-icon class="player-icon" icon="play"
          /></span>
        </div>
      </div>
    </div>
    <div class="now-playing-container">
      <div v-if="track" class="now-playing">
        <img :src="image(track)" class="track-image" />
        <div class="tags">
          <div class="top-row">{{ track.tags.title }}</div>
          <div class="bottom-row">
            <span class="entity-name">{{ track.tags.artist }}</span> •
            <span class="entity-name">{{ track.tags.album }}</span>
            <span v-if="track.tags.year"
              >• <span class="entity-name">{{ track.tags.year }}</span></span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="ghost"></div>
  </div>
</template>

<script lang="ts">
import { Player } from "@/lib/classes/Player";
import { Track } from "@/lib/classes/Track";
import { createDataURL, MimeFormat } from "@/lib/dataUrl";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      player: Player.getInstance(),
      isPlaying: false,
      track: undefined as Track | undefined,
    };
  },

  mounted() {
    this.player.on("play", () => {
      this.isPlaying = true;
    });

    this.player.on(["pause", "ended"], () => {
      this.isPlaying = false;
    });

    this.player.on("trackChange", (_: Player, track: Track) => {
      this.track = track;
    });
  },

  methods: {
    playPause() {
      this.player.playPause.bind(this.player)();
    },

    stop() {
      this.player.stop.bind(this.player)();
    },

    image(track: Track) {
      if (track.tags.image)
        return createDataURL(
          (track.tags.image! as any).imageBuffer,
          (track.tags.image! as any).mime
        );
    },
  },
});
</script>

<style lang="scss" scoped>
.Player {
  width: 100%;
  background: whitesmoke;
  padding: 1em;
  border-top: grey 2px solid;
  position: fixed;
  bottom: 0;

  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-rows: auto;

  .controls-container,
  .now-playing-container,
  .ghost {
    align-self: center;
  }

  .controls-container {
    grid-column: 1 / span 1;
  }

  .now-playing-container {
    grid-column: 2 / span 1;
    justify-self: center;

    .now-playing {
      display: flex;
      align-items: center;

      .track-image {
        margin-right: 0.7em;
      }

      .tags {
        text-align: left;
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        .top-row {
          margin-bottom: 0.3em;
        }

        .bottom-row {
          color: grey;
        }
      }
    }
  }

  .ghost {
    grid-column: 3 / span 1;
  }
}

.player-icon {
  font-size: 2em;

  &:hover {
    cursor: pointer;
  }
}

.entity-name {
  font-size: 0.9em;
}

.track-image {
  height: 40px;
  width: 40px;
  border: 1px whitesmoke solid;
  border-radius: 10%;
}
</style>
