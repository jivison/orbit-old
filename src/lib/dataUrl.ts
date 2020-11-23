export enum MimeFormat {
  mp3 = "audio/mp3",
  jpeg = "image/jpeg",
}

export function createDataURL(buffer: Buffer, format: MimeFormat): string {
  const data = buffer.toString("base64");

  return `data:${format};base64,${data}`;
}
