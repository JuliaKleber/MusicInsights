import { create } from "zustand";
import {
  Recommendation,
  ArtistData,
  ArtistAlbums,
  AlbumData,
  AlbumTracks,
  TrackData,
} from "../types/types";

type MusicDataState = {
  artistSearchResults: string[];
  albumSearchResults: string[];
  trackSearchResults: string[];
  genre: string | null;
  recommendations: Recommendation[];
  artistData: ArtistData | null;
  artistAlbums: ArtistAlbums | null;
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
  setArtistData: (data: ArtistData) => void;
  setAlbumListShown: (value: boolean) => void;
  setAlbumData: (data: AlbumData) => void;
  setTrackListShown: (value: boolean) => void;
  setTrackData: (data: TrackData) => void;
};

type MusicDataStore = MusicDataState & MusicDataActions;

export const useMusicDataStore = create<MusicDataStore>()((set) => ({
  artistSearchResults: [],
  albumSearchResults: [],
  trackSearchResults: [],

  genre: null,
  recommendations: [],

  artistData: null,
  artistAlbums: null,
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
  setArtistData: (data: ArtistData) => {
    set(() => ({ artistData: data }));
  },
  setAlbumListShown: (value: boolean) => {
    set(() => ({ albumListShown: value }));
  },
  setAlbumData: (data: AlbumData) => {
    set(() => ({ albumData: data }));
  },
  setTrackListShown: (value: boolean) => {
    set(() => ({ trackListShown: value }));
  },
  setTrackData: (data: TrackData) => {
    set(() => ({ trackData: data }));
  },
}));


export default useMusicDataStore;
