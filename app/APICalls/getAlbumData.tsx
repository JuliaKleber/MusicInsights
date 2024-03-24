"use server";

import getSpotifyToken from "./getSpotifyToken";

const setSpotifyData = (data: any) => {
  const albumData: AlbumData = {
    spotifyId: data.id,
    name: data.name,
    artists: data.artists.map((artist: any) => ({
      spotifyId: artist.id,
      name: artist.name,
    })),
    label: data.label,
    releaseDate: data.release_date,
    spotifyPopularity: data.popularity,
    upc: data.external_ids.upc,
    image: data.images[1].url,
  };
  return albumData;
};

const getAlbumData = async (
  id: string | null,
) => {
  const url = `https://api.spotify.com/v1/albums/${id}`
  const accessToken = await getSpotifyToken();
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data ? setSpotifyData(data) : null;
  } catch (error) {
    console.error(`Error fetching album data:`, error);
    return null;
  }
};

export default getAlbumData;
