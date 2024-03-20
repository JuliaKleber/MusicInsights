"use client";

import useMusicDataStore from "../stores/musicDataStore";
import getSpotifyToken from "./getSpotifyToken";
import getSpotifyData from "./getMetaData";
import { Category } from "../types/types";

const spotifySearch: (
  searchTerm: string,
  category?: Category
) => Promise<void> = async (searchTerm, category = "artist") => {
  const accessToken = await getSpotifyToken();
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const url = `https://api.spotify.com/v1/search?q=${encodedSearchTerm}&type=${category}&limit=20`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    let spotifyId = null;
    if (category === "artist" && data.artists.items[0]) {
      useMusicDataStore.setState({
        artistSearchResults: data.artists.items.map((item) => item.id),
      });
      spotifyId = data.artists.items[0].id;
    } else if (category === "album" && data.albums.items[0]) {
      useMusicDataStore.setState({
        albumSearchResults: data.albums.items.map((item) => item.id),
      });
      spotifyId = data.albums.items[0].id;
    } else if (category === "track" && data.tracks.items[0]) {
      useMusicDataStore.setState({
        trackSearchResults: data.tracks.items.map((item) => item.id),
      });
      spotifyId = data.tracks.items[0].id;
    }
    getSpotifyData(spotifyId, category);
  } catch (error) {
    console.error("Error fetching search data:", error);
  }
};

export default spotifySearch;
