import nodeID3, {
  Tags,
  read as readTags,
  update as updateTags,
} from "node-id3";
import { Player } from "./Player";
import { TrackPlayback } from "./TrackPlayback";

export class Track {
  public tags: Tags = {};
  public filepath: string;
  private playback: TrackPlayback;

  get isPlaying(): boolean {
    return this.playback.isPlaying;
  }

  constructor(filepath: string) {
    this.filepath = filepath;
    this.loadTags();
    this.playback = new TrackPlayback(filepath);
  }

  private loadTags() {
    this.tags = readTags.bind(nodeID3)(this.filepath);
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
    Player.getInstance().play(this.playback);
  }
}
