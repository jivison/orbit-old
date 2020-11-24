import { EventEmitter } from "../EventEmitter";
import { LastFMService } from "../services/LastFM/LastFMService";
import { Queue, QueueEventListeners } from "./Queue";
import { Track } from "./Track";
import { PlaybackEventListeners, TrackPlayback } from "./TrackPlayback";

export interface PlayerEventListeners {
  trackChange: ((player: Player, track: Track) => void)[];
}

export class Player extends EventEmitter<
  PlaybackEventListeners & PlayerEventListeners & QueueEventListeners
> {
  private static instance?: Player;

  private constructor() {
    super({
      play: [],
      pause: [],
      ended: [],
      timeUpdate: [],
      trackChange: [],
      loopingToggle: [],
    });

    this.on("ended", () => {
      const track = this.queue.next();

      this.play(track);
    });

    this.on("trackChange", (_: any, track: Track) => {
      this.trackScrobbled = false;
      if (track.tags.artist && track.tags.title)
        this.lastFMService.updateNowPlaying({
          artist: track.tags.artist,
          track: track.tags.title,
          album: track.tags.album,
          duration: track.tags.duration,
          trackNumber: track.tags.trackNumber,
        });
    });

    this.on("timeUpdate", (_: any, e) => {
      if (
        !this.trackScrobbled &&
        this.track?.tags?.duration &&
        this.track.tags.artist &&
        this.track.tags.title
      ) {
        const currentTime = (e.currentTarget as HTMLAudioElement).currentTime;

        if (currentTime > this.track.tags.duration / 2) {
          this.trackScrobbled = true;
          this.lastFMService.scrobbleTrack({
            artist: this.track.tags.artist,
            track: this.track.tags.title,
            album: this.track.tags.album,
            timestamp: new Date().getTime() / 1000,
          });
        }
      }
    });

    this.queue.on("loopingToggle", (value: boolean) => {
      this.triggerEvent("loopingToggle", value);
    });
  }

  public static getInstance(): Player {
    if (!this.instance) this.instance = new Player();
    return this.instance;
  }

  // Intance methods
  private lastFMService = new LastFMService();
  private trackScrobbled?: boolean;

  private queue: Queue = new Queue({
    loopingToggle: [],
  });
  private playback?: TrackPlayback;
  private track?: Track;

  public isPlaying = false;

  public clearQueue() {
    this.queue.clear();
  }

  public playWithQueue(tracks: Track[]) {
    this.clearQueue();
    this.queue.addTracks(tracks);
    const track = this.queue.next();

    this.play(track);
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

  public skip() {
    const track = this.queue.skip();
    this.play(track);
  }

  public skipBack() {
    const track = this.queue.previous();
    this.play(track);
  }

  public toggleLooping() {
    this.queue.toggleLooping();
  }

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
}
