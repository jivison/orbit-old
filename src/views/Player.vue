<template>
  <div class="player-container">
    <duration-bar :currentTime="currentTime" :totalDuration="totalDuration" />

    <div class="player">
      <div class="controls-container">
        <div class="controls">
          <div>
            <svg-icon
              @click="skipBack()"
              class="player-icon minor-icon"
              icon="skip-back"
            />
          </div>
          <div class="playpause-button">
            <span v-if="isPlaying" @click="playPause()"
              ><svg-icon class="player-icon" icon="pause"
            /></span>
            <span v-else @click="playPause()"
              ><svg-icon class="player-icon" icon="play"
            /></span>
          </div>
          <div>
            <svg-icon
              @click="skip()"
              class="player-icon minor-icon"
              icon="skip-forward"
            />
          </div>
          <div class="duration-display">
            {{ displayDuration(currentTime) }} /
            {{ displayDuration(totalDuration) }}
          </div>
        </div>
      </div>
      <div class="now-playing-container">
        <div v-if="track" class="now-playing">
          <img
            v-if="track.tags.image"
            :src="image(track)"
            class="track-image"
          />

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
    </div>
  </div>
</template>

<script lang="ts">
import DurationBar from "@/components/DurationBar.vue";
import SvgIcon from "@/components/svg/SvgIcon.vue";
import { Player } from "@/lib/classes/Player";
import { Track } from "@/lib/classes/Track";
import { createDataURL, MimeFormat } from "@/lib/dataUrl";
import { defineComponent } from "vue";
import { displayDuration } from "../helpers/displayDuration";

export default defineComponent({
  components: { DurationBar, SvgIcon },

  data() {
    return {
      player: Player.getInstance(),
      isPlaying: false,
      track: undefined as Track | undefined,
      currentTime: 0,
      totalDuration: 0,
      looping: false,
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
      this.currentTime = 0;
      this.totalDuration = track.tags.duration || 0;
    });

    this.player.on("timeUpdate", (_: any, e: Event) => {
      this.currentTime = (e.currentTarget as HTMLAudioElement).currentTime;
    });

    this.player.on("loopingToggle", (_: any, value: boolean) => {
      this.looping = value;
    });
  },

  methods: {
    playPause() {
      this.player.playPause.bind(this.player)();
    },

    stop() {
      this.player.stop.bind(this.player)();
    },

    skip() {
      this.player.skip();
    },

    skipBack() {
      this.player.skipBack();
    },

    toggleLooping() {
      this.player.toggleLooping();
    },

    image(track: Track) {
      if (track.tags.image)
        return createDataURL(
          (track.tags.image! as any).imageBuffer,
          (track.tags.image! as any).mime
        );
    },

    displayDuration(duration: number) {
      return displayDuration(duration);
    },
  },
});
</script>

<style lang="scss" scoped>
.player-container {
  width: 100%;
  background: whitesmoke;
  position: fixed;
  bottom: 0;

  .player {
    padding: 1em;
    display: grid;
    grid-template-columns: repeat(3, 33%);
    grid-template-rows: auto;
  }
}
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

.player-icon {
  font-size: 2em;

  &:hover {
    cursor: pointer;
  }
}

.minor-icon {
  font-size: 1.2em;
}

.entity-name {
  font-size: 0.9em;
}

.playpause-button {
  margin-left: 0.7em;
  margin-right: 0.7em;
}

.track-image {
  height: 40px;
  width: 40px;
  border: 1px whitesmoke solid;
  border-radius: 10%;
}

.controls {
  display: flex;
  align-items: center;
}

.duration-display {
  font-size: 0.8em;
  color: grey;
  margin-left: 1.5em;
}
</style>
