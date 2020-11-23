import { readFileSync } from "fs";
import { createDataURL, MimeFormat } from "../dataUrl";
import { EventEmitter } from "../EventEmitter";

export type PlaybackEventListener = (playback: TrackPlayback) => void;

export interface PlaybackEventListeners {
  play: PlaybackEventListener[];
  pause: PlaybackEventListener[];
  ended: PlaybackEventListener[];
}

export class TrackPlayback extends EventEmitter<PlaybackEventListeners> {
  private audioElement?: HTMLAudioElement;
  public isPlaying = false;

  constructor(private path: string) {
    super({
      play: [],
      pause: [],
      ended: [],
    });
  }

  play() {
    if (this.audioElement) {
      this.audioElement.play();
    } else {
      this.load(this.path).then((dataURL) => {
        this.audioElement = this.createAudioElement(dataURL);
        this.audioElement.play();
      });
    }
  }

  stop() {
    if (this.audioElement) {
      this.pause();
      this.audioElement.currentTime = 0;
    }
  }

  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  playPause() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  private createAudioElement(dataURL: string): HTMLAudioElement {
    const audioElement = document.createElement("audio");
    audioElement.src = dataURL;

    audioElement.onended = (() => {
      this.isPlaying = false;
      this.triggerEvent("ended");
    }).bind(this);

    audioElement.onplay = (() => {
      this.isPlaying = true;
      this.triggerEvent("play");
    }).bind(this);

    audioElement.onpause = (() => {
      this.isPlaying = false;
      this.triggerEvent("pause");
    }).bind(this);

    return audioElement;
  }

  private async load(path: string) {
    const songFile = readFileSync(path);
    return createDataURL(songFile, MimeFormat.mp3);
  }
}
