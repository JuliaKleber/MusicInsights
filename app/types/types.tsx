export type Category = "artist" | "album" | "track" | "recommendations";

export type DataCategory =
  | "artistData"
  | "albumListShown"
  | "albumData"
  | "trackListShown"
  | "trackData"
  | "recommendations";

export interface Artist {
  name: string;
  spotifyId: string;
}

export interface Album {
  name: string;
  spotifyId: string;
  releaseDate: string;
  image: {
    height: number;
    width: number;
    url: string;
  };
}

export interface Track {
  name: string;
  spotifyId: string;
  artists?: Artist[];
}

export interface Recommendation {
  trackName: string;
  trackId: string;
  artists: Artist[];
}

export interface ArtistData {
  spotifyId: string;
  name: string;
  genres?: string[];
  spotifyPopularity: number;
  followers: number;
  image: string;
  formationDate?: string | null;
  disbandmentDate?: string | null;
  isnis?: string | null;
  type?: string | null;
  location?: string;
  country?: string;
}

export interface ArtistAlbum {
  spotifyId: string;
  name: string;
  realeaseDate: string;
  image: string;
}

export interface AlbumData {
  name: string;
  artists: Artist[];
  label: string;
  releaseDate: string;
  spotifyPopularity: number;
  upc: string;
  image: string;
}

export interface AlbumTracks {
  name: string;
  artists: Artist[];
  tracks: Track[];
  image: string;
}

export interface TrackData {
  spotifyId: string;
  isrc: string;
  name: string;
  artists: Artist[];
  album: {
    spotifyId: string;
    name: string;
    trackNumber: number;
  };
  spotifyPopularity: number;
  length: number;
  image: string;
  bpm?: string;
  timeSignature?: string;
  key?: string;
  releaseDate: string;
}

export interface Month {
  [key: string]: string;
}
