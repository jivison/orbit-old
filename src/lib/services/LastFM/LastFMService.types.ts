export interface ScrobbleParams {
  artist: string;
  track: string;
  timestamp: number;

  album?: string;
  albumArtist?: string;
  duration?: number;
}

export interface UpdateNowPlayingParams {
  artist: string;
  track: string;
  album?: string;
  trackNumber?: string;
  context?: string;
  mbid?: string;
  duration?: number;
  albumArtist?: string;
}
