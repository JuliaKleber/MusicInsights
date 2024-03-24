import { create } from "zustand";

type MusicDataState = {
  artistSearchResults: string[];
  albumSearchResults: string[];
  trackSearchResults: string[];
  genre: string | null;
  recommendations: Recommendation[];
  artistData: ArtistData | null;
  artistAlbums: ArtistAlbum[] | null;
  albumListShown: boolean;
  albumData: AlbumData | null;
  albumTracks: AlbumTracks | null;
  trackListShown: boolean;
  trackData: TrackData | null;
};

type MusicDataActions = {
  setArtistSearchResults: (searchResults: string[]) => void;
  setAlbumSearchResults: (searchResults: string[]) => void;
  setTrackSearchResults: (searchResults: string[]) => void;

  resetArtistSearchResults: () => void;
  resetAlbumSearchResults: () => void;
  resetTrackSearchResults: () => void;

  setGenre: (genre: string) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;

  setArtistData: (data: ArtistData | null | undefined) => void;
  setArtistAlbums: (data: ArtistAlbum[] | undefined) => void;
  setAlbumListShown: (value: boolean) => void;
  setAlbumData: (data: AlbumData | null | undefined) => void;
  setAlbumTracks: (data: AlbumTracks | null | undefined) => void;
  setTrackListShown: (value: boolean) => void;
  setTrackData: (data: TrackData | null | undefined) => void;
};

type MusicDataStore = MusicDataState & MusicDataActions;

export const useMusicDataStore = create<MusicDataStore>()((set) => ({
  artistSearchResults: [],
  albumSearchResults: [],
  trackSearchResults: [],

  genre: null,
  recommendations: [],

  artistData: null,
  artistAlbums: [],
  albumListShown: false,

  albumData: null,
  albumTracks: null,
  trackListShown: false,

  trackData: null,

  setArtistSearchResults: (searchResults) => {
    set(() => ({ artistSearchResults: searchResults }));
  },
  setAlbumSearchResults: (searchResults) => {
    set(() => ({ albumSearchResults: searchResults }));
  },
  setTrackSearchResults: (searchResults) => {
    set(() => ({ trackSearchResults: searchResults }));
  },

  resetArtistSearchResults: () => {
    set(() => ({ artistSearchResults: [] }));
  },
  resetAlbumSearchResults: () => {
    set(() => ({ albumSearchResults: [] }));
  },
  resetTrackSearchResults: () => {
    set(() => ({ trackSearchResults: [] }));
  },

  setGenre: (genre: string) => {
    set(() => ({ genre: genre }));
  },
  setRecommendations: (recommendations: Recommendation[]) => {
    set(() => ({ recommendations: recommendations }));
  },

  setArtistData: (data) => {
    set(() => ({ artistData: data }));
  },
  setArtistAlbums: (data) => {
    set(() => ({ artistAlbums: data }));
  },
  setAlbumListShown: (value) => {
    set(() => ({ albumListShown: value }));
  },
  setAlbumData: (data) => {
    set(() => ({ albumData: data }));
  },
  setAlbumTracks: (data) => {
    set(() => ({ albumTracks: data }));
  },
  setTrackListShown: (value) => {
    set(() => ({ trackListShown: value }));
  },
  setTrackData: (data) => {
    set(() => ({ trackData: data }));
  },
}));


export default useMusicDataStore;
