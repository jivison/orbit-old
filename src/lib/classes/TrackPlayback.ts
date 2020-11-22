import { readFileSync } from "fs";
import { createDataURL, MimeAudioFormat } from "../dataUrl";

export class TrackPlayback {
  private audioElement?: HTMLAudioElement;
  public isPlaying = false;

  constructor(private path: string) {}

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
      this.isPlaying = false;
    }
  }

  playPause() {
    console.log(this.isPlaying);
    if (this.isPlaying) this.pause();
    else this.play();
  }

  private createAudioElement(dataURL: string): HTMLAudioElement {
    const audioElement = document.createElement("audio");
    audioElement.src = dataURL;

    audioElement.onended = (() => {
      this.isPlaying = false;
    }).bind(this);

    audioElement.onplay = (() => {
      this.isPlaying = true;
    }).bind(this);

    return audioElement;
  }

  private async load(path: string) {
    const songFile = readFileSync(path);
    return createDataURL(songFile, MimeAudioFormat.mp3);
  }
}
