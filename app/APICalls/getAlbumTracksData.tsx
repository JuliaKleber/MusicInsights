"use server";

import getSpotifyToken from "./getSpotifyToken";

const setAlbumTracks = (data: any) => {
  const albumTracks: AlbumTracks = {
    name: data.name,
    artists: data.artists.map((artist: any) => ({
      spotifyId: artist.id,
      name: artist.name,
    })),
    tracks: data.tracks.items.map((item: any) => ({
      spotifyId: item.id,
      name: item.name,
    })),
    image: data.images[1].url,
  };
  return albumTracks;
};

const getAlbumTracksData = async (id: string | null) => {
  const url = `https://api.spotify.com/v1/albums/${id}`;
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
    return data ? setAlbumTracks(data) : null;
  } catch (error) {
    console.error(`Error fetching album's tracks data:`, error);
    return null;
  }
};

export default getAlbumTracksData;
