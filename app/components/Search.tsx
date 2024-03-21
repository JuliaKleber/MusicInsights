"use client";

import { useState } from "react";
import spotifySearch from "../APICalls/spotifySearch";
import getMetaData from "../APICalls/getMetaData";
import useStyleStore, { buttonStyle } from "../stores/styleStore";
import { Category, ArtistData, AlbumData, TrackData } from "../types/types";
import useMusicDataStore from "../stores/musicDataStore";

interface SearchProps {
  scrollToCard: (category: Category, extra?: string) => void;
}

interface ButtonProps {
  text: string;
  category: Category;
}

const Search: React.FC<SearchProps> = ({ scrollToCard }) => {
  const setArtistSearchResults = useMusicDataStore(
    (state) => state.setArtistSearchResults
  );
  const setAlbumSearchResults = useMusicDataStore(
    (state) => state.setAlbumSearchResults
  );
  const setTrackSearchResults = useMusicDataStore(
    (state) => state.setTrackSearchResults
  );

  const setArtistData = useMusicDataStore((state) => state.setArtistData);
  const setAlbumData = useMusicDataStore((state) => state.setAlbumData);
  const setTrackData = useMusicDataStore((state) => state.setTrackData);

  const setArtistAlbums = useMusicDataStore((state) => state.setArtistAlbums);
  const setAlbumListShown = useMusicDataStore((state) => state.setAlbumListShown);
  const setTrackListShown = useMusicDataStore((state) => state.setTrackListShown);

  const darkMode = useStyleStore((state) => state.darkMode);

  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      const artistResults = await spotifySearch(searchTerm, "artist");
      const artistData: ArtistData = await getMetaData(artistResults[0], "artist");
      setArtistSearchResults(artistResults);
      setArtistData(artistData);
      setArtistAlbums([]);
      setAlbumListShown(false);
      const albumResults = await spotifySearch(searchTerm, "album");
      const albumData: AlbumData = await getMetaData(albumResults[0], "album");
      setAlbumSearchResults(albumResults);
      setAlbumData(albumData);
      setTrackListShown(false);
      const trackResults = await spotifySearch(searchTerm, "track");
      const trackData: TrackData = await getMetaData(trackResults[0], "track");
      setTrackSearchResults(trackResults);
      setTrackData(trackData);
    }
  };

  const handleSearch = async (category: Category) => {
    const searchResults = await spotifySearch(searchTerm, category);
    if (category === "artist") {
      const data: ArtistData = await getMetaData(searchResults[0], category);
      setArtistSearchResults(searchResults);
      setArtistData(data);
      setArtistAlbums([]);
      setAlbumListShown(false);
    } else if (category === "album") {
      const data: AlbumData = await getMetaData(searchResults[0], category);
      setAlbumSearchResults(searchResults);
      setAlbumData(data);
      setTrackListShown(false);
    } else if (category === "track") {
      const data: TrackData = await getMetaData(searchResults[0], category);
      setTrackSearchResults(searchResults);
      setTrackData(data);
    }
    scrollToCard(category);
  };

  const input = (
    <input
      type="text"
      placeholder="Enter Search Term"
      onChange={(event) => setSearchTerm(event.target.value)}
      onKeyDown={(event) => handleKeyDown(event)}
      className={`w-64 p-1 m-1 text-center rounded-md border ${
        darkMode
          ? "text-white bg-gray-700 border-gray-900 focus:outline-none focus:border-pink-100"
          : "border-gray-200 bg-gray-50 focus:outline-none focus:border-sky-600"
      }`}
    />
  );

  const Button: React.FC<ButtonProps> = ({ text, category }) => {
    return (
      <button className={buttonStyle} onClick={() => handleSearch(category)}>
        {text}
      </button>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {input}
      <div className="flex flex-row justify-center items-center">
        <Button text="Search Artist" category="artist" />
        <Button text="Search Album" category="album" />
        <Button text="Search Track" category="track" />
      </div>
    </div>
  );
};

export default Search;
