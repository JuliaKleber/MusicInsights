"use client";

import { useState } from "react";
import spotifySearch from "../APICalls/spotifySearch";
import getArtistData from "../APICalls/getArtistData";
import getAlbumData from "../APICalls/getAlbumData";
import getTrackData from "../APICalls/getTrackData";
import { buttonStyle } from "../styles/styles";
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
  const setAlbumListShown = useMusicDataStore(
    (state) => state.setAlbumListShown
  );
  const setTrackListShown = useMusicDataStore(
    (state) => state.setTrackListShown
  );

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (category: Category) => {
    const searchResults = await spotifySearch(searchTerm, category);
    if (category === "artist") {
      const data = await getArtistData(searchResults[0]);
      setArtistSearchResults(searchResults);
      setArtistData(data);
      setArtistAlbums([]);
      setAlbumListShown(false);
    } else if (category === "album") {
      const data = await getAlbumData(searchResults[0]);
      setAlbumSearchResults(searchResults);
      setAlbumData(data);
      setTrackListShown(false);
    } else if (category === "track") {
      const data = await getTrackData(searchResults[0]);
      setTrackSearchResults(searchResults);
      setTrackData(data);
    }
    scrollToCard(category);
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch("artist");
      handleSearch("album");
      handleSearch("track");
    }
  };

  const input = (
    <input
      type="text"
      placeholder="Enter Search Term"
      onChange={(event) => setSearchTerm(event.target.value)}
      onKeyDown={(event) => handleKeyDown(event)}
      className="w-64 p-1 m-1 text-center rounded-md border focus:outline-none
        dark:text-white dark:bg-gray-700 dark:border-gray-900 dark:focus:border-pink-100
        border-gray-200 bg-gray-50 focus:border-sky-600
      "
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
