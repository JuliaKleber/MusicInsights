type Category = "artist" | "album" | "track" | "recommendations" | "albumTracks";

type DataCategory =
  | "artistData"
  | "albumListShown"
  | "albumData"
  | "trackListShown"
  | "trackData"
  | "recommendations";

interface Artist {
  name: string;
  spotifyId: string;
}

interface Album {
  name: string;
  spotifyId: string;
  releaseDate: string;
  image: {
    height: number;
    width: number;
    url: string;
  };
}

interface Track {
  name: string;
  spotifyId: string;
  artists?: Artist[];
}

interface Recommendation {
  name: string;
  spotifyId: string;
  artists: Artist[];
}

interface ArtistData {
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
}

interface ArtistAlbum {
  spotifyId: string;
  name: string;
  releaseDate: string;
  image: string;
}

interface AlbumData {
  spotifyId: string;
  name: string;
  artists: Artist[];
  label: string;
  releaseDate: string;
  spotifyPopularity: number;
  upc: string;
  image: string;
}

interface AlbumTracks {
  name: string;
  artists: Artist[];
  tracks: Track[];
  image: string;
}

interface TrackData {
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

interface Month {
  [key: string]: string;
}

