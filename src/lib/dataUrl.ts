export enum MimeAudioFormat {
  mp3 = "audio/mp3",
}

export function createDataURL(buffer: Buffer, format: MimeAudioFormat): string {
  const data = buffer.toString("base64");

  return `data:${format};base64,${data}`;
}
