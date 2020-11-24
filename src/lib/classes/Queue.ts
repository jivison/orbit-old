import { EventEmitter } from "../EventEmitter";
import { Track } from "./Track";

export interface QueueEventListeners {
  loopingToggle: ((queue: Queue) => void)[];
}

export class Queue extends EventEmitter<QueueEventListeners> {
  private tracks: Track[] = [];
  private currentPosition = -1;

  public looping = false;

  public get length() {
    return this.tracks.length;
  }

  public clear() {
    this.tracks = [];
    this.currentPosition = -1;
  }

  public addTracks(tracks: Track[]) {
    this.tracks.push(...tracks);
  }

  public next(): Track {
    if (this.looping) return this.getTrack();
    else {
      this.currentPosition++;
      return this.getTrack();
    }
  }

  public skip(): Track {
    this.currentPosition++;
    return this.getTrack();
  }

  public previous(): Track {
    this.currentPosition =
      this.currentPosition === 0 ? 0 : this.currentPosition - 1;

    return this.getTrack();
  }

  public toggleLooping() {
    this.looping = !this.looping;
    this.triggerEvent("loopingToggle", this.looping);
  }

  private getTrack(): Track {
    return this.tracks[this.currentPosition];
  }
}
