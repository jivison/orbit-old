import { readFileSync } from "fs";
import nodeID3, {
  Tags,
  read as readTags,
  update as updateTags,
} from "node-id3";
import { Player } from "./Player";
import { TrackPlayback } from "./TrackPlayback";
import mp3Duration from "mp3-duration";

export class Track {
  public tags: Tags & { duration?: number } = {};
  public filepath: string;
  public playback: TrackPlayback;

  get isPlaying(): boolean {
    return this.playback.isPlaying;
  }

  constructor(filepath: string) {
    this.filepath = filepath;
    this.loadTags();
    this.playback = new TrackPlayback(filepath);
  }

  private loadTags() {
    const file = readFileSync(this.filepath);
    this.tags = readTags.bind(nodeID3)(file);
    mp3Duration(file, (err, duration) => {
      // console.log("Duration: ", duration);
      // console.log("Err: ", err);
      this.tags.duration = duration;
    });
  }

  public updateTags(tags: Tags): Tags {
    updateTags(tags, this.filepath);
    this.loadTags();
    return this.tags;
  }

  public toString(): string {
    return this.tags.artist && this.tags.title
      ? `Track<${this.tags.artist} - ${this.tags.title}>`
      : `Track<${this.filepath}>`;
  }

  public play() {
    Player.getInstance().play(this);
  }
}
