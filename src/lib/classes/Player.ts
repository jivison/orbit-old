import { EventEmitter } from "../EventEmitter";
import { PlaybackEventListeners, TrackPlayback } from "./TrackPlayback";

export class Player extends EventEmitter<PlaybackEventListeners> {
  private static instance?: Player;

  private constructor() {
    super({
      play: [],
      pause: [],
      ended: [],
    });
  }

  public static getInstance(): Player {
    if (!this.instance) this.instance = new Player();
    return this.instance;
  }

  // Intance methods
  private playback?: TrackPlayback;

  public isPlaying: boolean = false;

  private setPlayback(playback: TrackPlayback) {
    if (this.playback === playback) return;

    if (this.playback?.isPlaying) this.playback.stop();
    this.playback = playback;

    this.playback.on(
      "pause",
      (() => {
        this.triggerEvent("pause");
      }).bind(this)
    );

    this.playback.on(
      "ended",
      (() => {
        this.triggerEvent("ended");
      }).bind(this)
    );

    this.playback.on(
      "play",
      (() => {
        this.triggerEvent("play");
      }).bind(this)
    );
  }

  public clearPlayback() {
    if (this.playback) this.playback.stop();
    this.playback = undefined;
  }

  public play(playback?: TrackPlayback) {
    if (playback && this.playback !== playback) {
      this.setPlayback(playback);
    }

    this.playback?.play();
  }

  public playPause(playback?: TrackPlayback) {
    if (playback && this.playback !== playback) {
      this.setPlayback(playback);
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
