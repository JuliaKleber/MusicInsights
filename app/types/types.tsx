export type Category = "artist" | "album" | "track" | "recommendations" | "albumTracks";

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
  name: string;
  spotifyId: string;
  artists: Artist[];
}

export type ArtistData = {
  spotifyId: string;
  name: string;
  genres: string[];
  spotifyPopularity: number;
  followers: number;
  image: string;
  formationDate?: string | null;
  disbandmentDate?: string | null;
  isnis?: string | null;
  type?: string | null;
  location?: string;
  country?: string;
} | undefined

export interface ArtistAlbum {
  spotifyId: string;
  name: string;
  releaseDate: string;
  image: string;
}

export type AlbumData = {
  spotifyId: string;
  name: string;
  artists: Artist[];
  label: string;
  releaseDate: string;
  spotifyPopularity: number;
  upc: string;
  image: string;
} | undefined | null

export interface AlbumTracks {
  name: string;
  artists: Artist[];
  tracks: Track[];
  image: string;
}

export type TrackData = {
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
} | undefined | null

export interface Month {
  [key: string]: string;
}
