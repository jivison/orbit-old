declare module "mp3-duration" {
  declare function mp3Duration(
    filename: string | Buffer,
    callback: (err: any | null, duration: number) => void
  ): void;

  declare function mp3Duration(
    filename: string | Buffer,
    cbrEstimate: boolean,
    callback: (err: any | null, duration: number) => void
  ): void;

  export = mp3Duration;
}
