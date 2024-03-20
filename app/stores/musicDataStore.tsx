import { create } from 'zustand';
import { Recommendations, ArtistData, ArtistAlbums, AlbumData, AlbumTracks, TrackData } from '../types/types';

type MusicDataStoreState = {
  artistSearchResults: string[];
  albumSearchResults: string[];
  trackSearchResults: string[];
  genre: string | null;
  recommendations: Recommendations | null;
  artistData: ArtistData | null;
  artistAlbums: ArtistAlbums | null;
  albumListShown: boolean;
  albumData: AlbumData | null;
  albumTracks: AlbumTracks | null;
  trackListShown: boolean;
  trackData: TrackData | null;
  resetArtistSearchResults: () => void;
  resetAlbumSearchResults: () => void;
  resetTrackSearchResults: () => void;
  setGenre: (genre: string) => void;
  setRecommendations: (recommendations: Recommendations) => void;
  setArtistData: (data: ArtistData) => void;
  setAlbumListShown: (value: boolean) => void;
  setAlbumData: (data: AlbumData) => void;
  setTrackListShown: (value: boolean) => void;
  setTrackData: (data: TrackData) => void;
};

const useMusicDataStore = create<MusicDataStoreState>((set) => ({
  artistSearchResults: [],
  albumSearchResults: [],
  trackSearchResults: [],

  genre: null,
  recommendations: null,

  artistData: null,
  artistAlbums: null,
  albumListShown: false,

  albumData: null,
  albumTracks: null,
  trackListShown: false,

  trackData: null,

  resetArtistSearchResults: () => {
    set(() => ({ artistSearchResults: [] }))
  },
  resetAlbumSearchResults: () => {
    set(() => ({ albumSearchResults: [] }))
  },
  resetTrackSearchResults: () => {
    set(() => ({ trackSearchResults: [] }))
  },

  setGenre: (genre: string) => {
    set(() => ({ genre: genre }))
  },
  setRecommendations: (recommendations: Recommendations) => {
    set(() => ({ recommendations: recommendations }))
  },
  setArtistData: (data: ArtistData) => {
    set(() => ({ artistData: data }))
  },
  setAlbumListShown: (value: boolean) => {
    set(() => ({ albumListShown: value }))
  },
  setAlbumData: (data: AlbumData) => {
    set(() => ({ albumData: data }))
  },
  setTrackListShown: (value: boolean) => {
    set(() => ({ trackListShown: value }))
  },
  setTrackData: (data: TrackData) => {
    set(() => ({ trackData: data }))
  },
}));

export default useMusicDataStore;
