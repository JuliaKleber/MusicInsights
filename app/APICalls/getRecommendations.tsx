"use server";

import getSpotifyToken from "./getSpotifyToken";
import useMusicDataStore from "../stores/musicDataStore";

const setRecommendations = (data: any) => {
  const recommendations = data.tracks.map((track: any) => ({
    name: track.name,
    spotifyId: track.id,
    artists: track.artists.map((artist: any) => ({
      spotifyId: artist.id,
      name: artist.name,
    })),
  }));
  return recommendations;
};

const getRecommendations = async (genre: string) => {
  const accessToken = await getSpotifyToken();
  const url = `https://api.spotify.com/v1/recommendations?limit=5&seed_genres=${genre}`;
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
    let recommendations;
    if (data.tracks.length !== 0) {
      recommendations = await setRecommendations(data);
    } else {
      recommendations = [];
    }
    return recommendations;
  } catch (error) {
    useMusicDataStore.setState({ recommendations: [] });
    console.error("Error fetching search data:", error);
  }
};

export default getRecommendations;
