"use server";

import getSpotifyToken from "./getSpotifyToken";
import { Category } from "../types/types";

const spotifySearch: (
  searchTerm: string,
  category?: Category
) => Promise<string[]> = async (searchTerm, category = "artist") => {
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
    const searchResults = data[`${category}s`].items.map((item) => item.id);
    return searchResults;
  } catch (error) {
    console.error("Error fetching search data:", error);
    return null;
  }
};

export default spotifySearch;
