import { EventEmitter } from "../EventEmitter";
import { Track } from "./Track";
import { PlaybackEventListeners, TrackPlayback } from "./TrackPlayback";

export interface PlayerEventListeners {
  trackChange: ((player: Player, track: Track) => void)[];
}

export class Player extends EventEmitter<
  PlaybackEventListeners & PlayerEventListeners
> {
  private static instance?: Player;

  private constructor() {
    super({
      play: [],
      pause: [],
      ended: [],
      timeUpdate: [],
      trackChange: [],
    });
  }

  public static getInstance(): Player {
    if (!this.instance) this.instance = new Player();
    return this.instance;
  }

  // Intance methods
  private playback?: TrackPlayback;
  private track?: Track;

  public isPlaying = false;

  private setPlayback(track: Track) {
    if (this.track === track) return;

    const playback = track.playback;
    this.track = track;

    if (this.playback?.isPlaying) this.playback.stop();
    this.playback = playback;

    this.playback.on("pause", () => {
      this.triggerEvent("pause");
    });

    this.playback.on("ended", () => {
      this.triggerEvent("ended");
    });

    this.playback.on("play", () => {
      this.triggerEvent("play");
    });

    this.playback.on("timeUpdate", (_: any, e: any) => {
      this.triggerEvent("timeUpdate", e);
    });
  }

  public clearPlayback() {
    if (this.playback) this.playback.stop();
    this.playback = undefined;
  }

  public play(track?: Track) {
    if (track && this.track !== track) {
      this.setPlayback(track);
      this.triggerEvent("trackChange", track);
    }

    this.playback?.play();
  }

  public playPause(track?: Track) {
    if (track && this.track !== track) {
      this.setPlayback(track);
      this.triggerEvent("trackChange", track);
    }

    this.playback?.playPause();
  }

  public stop() {
    this.playback?.stop();
  }

  public pause() {
    this.playback?.pause();
  }
}
