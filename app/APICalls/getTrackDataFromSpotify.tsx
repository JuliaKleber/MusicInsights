"use server";

import getSpotifyToken from "./getSpotifyToken";

const setSpotifyData = (data: any) => {
  const trackData: TrackData = {
    spotifyId: data.id,
    isrc: data.external_ids.isrc,
    name: data.name,
    artists: data.artists.map((artist: any) => ({
      spotifyId: artist.id,
      name: artist.name,
    })),
    album: {
      spotifyId: data.album.id,
      name: data.album.name,
      trackNumber: data.track_number,
    },
    spotifyPopularity: data.popularity,
    length: Math.round(data.duration_ms / 1000),
    image: data.album.images[1].url,
    releaseDate: data.album.release_date,
  };
  return trackData;
};

const getTrackDataFromSpotify = async (id: string | null) => {
  const url = `https://api.spotify.com/v1/tracks/${id}`;
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
    return setSpotifyData(data);
  } catch (error) {
    console.error(`Error fetching track data:`, error);
  }
};

export default getTrackDataFromSpotify;
