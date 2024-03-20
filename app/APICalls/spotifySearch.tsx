"use server";

import useMusicDataStore from "../stores/musicDataStore";
import getSpotifyToken from "./getSpotifyToken";
import getMetaData from "./getMetaData";
import { Category, ArtistData, AlbumData, TrackData } from "../types/types";

const updateMusicDataStore = (category: Category, data) => {
  if (category === "artist" && data.artists.items[0]) {
    useMusicDataStore.setState({
      artistSearchResults: data.artists.items.map((item) => item.id),
    });
    return data.artists.items[0].id;
  } else if (category === "album" && data.albums.items[0]) {
    useMusicDataStore.setState({
      albumSearchResults: data.albums.items.map((item) => item.id),
    });
    return data.albums.items[0].id;
  } else if (category === "track" && data.tracks.items[0]) {
    useMusicDataStore.setState({
      trackSearchResults: data.tracks.items.map((item) => item.id),
    });
    return data.tracks.items[0].id;
  }
};

const spotifySearch: (
  searchTerm: string,
  category?: Category
) => Promise<ArtistData | AlbumData | TrackData | null> = async (searchTerm, category = "artist") => {
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
    const spotifyId = await updateMusicDataStore(category, data);
    const returnedData = await getMetaData(spotifyId, category);
    return returnedData;
  } catch (error) {
    console.error("Error fetching search data:", error);
    return null;
  }
};

export default spotifySearch;
